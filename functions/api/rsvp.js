import { appendSheetRow, readSheetRows } from "../_lib/google.js";
import { isSameSiteRequest, json, publicError, readSmallJson } from "../_lib/http.js";
import { verifyTurnstile } from "../_lib/turnstile.js";
import { validateRsvp } from "../_lib/validation.js";
import { RSVP_HEADERS_VI, RSVP_HEADERS_LEGACY, ATTENDANCE_LABELS, RELATIONSHIP_LABELS, SIDE_LABELS, vietnamSheetDate, hasHeaders, hasSttHeaders, invitationColumns } from "../_lib/sheet-data.js";

export const RSVP_HEADERS = RSVP_HEADERS_VI;
export const RSVP_TAB_NAMES = Object.freeze({
  groom: "Nhà trai",
  bride: "Nhà gái",
});

function rsvpTabName(env, invitationSide) {
  const configured = invitationSide === "groom"
    ? env.GOOGLE_GROOM_RSVP_TAB
    : env.GOOGLE_BRIDE_RSVP_TAB;
  return configured || RSVP_TAB_NAMES[invitationSide];
}

async function handlePost({ request, env }) {
  if (!isSameSiteRequest(request, env.ALLOWED_ORIGINS || "")) {
    return publicError(403, "FORBIDDEN", "Yêu cầu không hợp lệ.");
  }
  if (request.headers.get("X-Requested-With") !== "wedding-invitation") {
    return publicError(403, "FORBIDDEN", "Yêu cầu không hợp lệ.");
  }

  let input;
  try {
    input = await readSmallJson(request);
  } catch (error) {
    const status = error.status || 400;
    return publicError(status, error.message, status === 413 ? "Dữ liệu gửi lên quá lớn." : "Dữ liệu gửi lên không hợp lệ.");
  }

  if (typeof input?.website === "string" && input.website.trim()) {
    return json({ ok: true, message: "Phúc đáp đã được ghi nhận." }, { status: 201 });
  }

  const validation = validateRsvp(input);
  if (!validation.ok) {
    const status = validation.code === "RSVP_CLOSED" ? 410 : 400;
    const message = validation.code === "RSVP_CLOSED"
      ? "Đã hết hạn phúc đáp. Vui lòng liên hệ trực tiếp với gia đình."
      : "Vui lòng kiểm tra lại các câu trả lời.";
    return json({ ok: false, code: validation.code, message, fields: validation.errors || {} }, { status });
  }

  const remoteIp = request.headers.get("CF-Connecting-IP") || "";
  const expectedHostname = new URL(request.url).hostname;
  if (env.TURNSTILE_SECRET_KEY && input.turnstileToken) {
    const challengeIsValid = await verifyTurnstile(env, input.turnstileToken, remoteIp, expectedHostname).catch(() => false);
    if (!challengeIsValid) {
      return publicError(400, "TURNSTILE_FAILED", "Xác minh chống spam đã hết hạn. Vui lòng thử lại.");
    }
  }

  try {
    const data = validation.value;
    const tab = rsvpTabName(env, data.invitationSide).replace(/'/g, "''");
    const headers = await readSheetRows(env, `'${tab}'!A1:K1`);
    const hasStt = hasSttHeaders(headers[0], RSVP_HEADERS) || hasSttHeaders(headers[0], RSVP_HEADERS_LEGACY);
    if (!hasStt && !hasHeaders(headers[0], RSVP_HEADERS) && !hasHeaders(headers[0], RSVP_HEADERS_LEGACY)) {
      throw new Error("RSVP_SHEET_HEADERS_MISMATCH");
    }
    const idRows = await readSheetRows(env, hasStt ? `'${tab}'!H2:H` : `'${tab}'!G2:G`);
    if (idRows.some((row) => String(row[0] || "") === data.idempotencyKey)) {
      return json({ ok: true, message: "Phúc đáp đã được ghi nhận." });
    }

    let invitedName = "";
    if (data.invitationSlug) {
      const invitationTab = data.invitationSide === "groom" ? "Nhà trai mời onl" : "Nhà gái mời onl";
      const invitationTable = invitationColumns(await readSheetRows(env, `'${invitationTab}'!A1:C`));
      const matches = invitationTable.rows.filter((row) => String(row[invitationTable.slugIndex] || "").trim().toLowerCase() === data.invitationSlug);
      if (matches.length !== 1) {
        return publicError(matches.length ? 409 : 400, matches.length ? "DUPLICATE_SLUG" : "INVITATION_NOT_FOUND", "Link thiệp cá nhân không hợp lệ.");
      }
      invitedName = String(matches[0][invitationTable.nameIndex] || "").trim().replace(/\s+/g, " ").slice(0, 120);
      if (!invitedName) return publicError(400, "INVITATION_NOT_FOUND", "Link thiệp cá nhân không hợp lệ.");
    }

    await appendSheetRow(env, hasStt ? `'${tab}'!B:K` : `'${tab}'!A:J`, [
      vietnamSheetDate(),
      data.name,
      ATTENDANCE_LABELS[data.attendance],
      data.guestCount,
      RELATIONSHIP_LABELS[data.relationship],
      data.relationshipOther,
      data.idempotencyKey,
      SIDE_LABELS[data.invitationSide],
      data.invitationSlug,
      invitedName,
    ]);
    return json({ ok: true, message: "Phúc đáp đã được lưu." }, { status: 201 });
  } catch (error) {
    console.error("RSVP append failed", error instanceof Error ? error.message : "UNKNOWN");
    return publicError(503, "RSVP_SERVICE_UNAVAILABLE", "Chưa thể lưu phúc đáp. Vui lòng thử lại sau.");
  }
}

export function onRequest(context) {
  if (context.request.method !== "POST") {
    return publicError(405, "METHOD_NOT_ALLOWED", "Phương thức không được hỗ trợ.");
  }
  return handlePost(context);
}
