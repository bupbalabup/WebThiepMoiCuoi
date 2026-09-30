import { appendSheetRow, readSheetRows } from "../_lib/google.js";
import { isSameSiteRequest, json, publicError, readSmallJson } from "../_lib/http.js";
import { verifyTurnstile } from "../_lib/turnstile.js";
import { validateLookup, VALID_SIDES } from "../_lib/validation.js";
import { WISH_HEADERS, SIDE_LABELS, vietnamSheetDate, hasHeaders } from "../_lib/sheet-data.js";

export function validateWish(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const message = typeof input.message === "string" ? input.message.trim().replace(/\r\n/g, "\n") : "";
  const slug = input.invitationSlug || "";
  if (!name || name.length > 120 || !message || message.length > 2000 || !VALID_SIDES.has(input.invitationSide)
    || !/^[0-9a-f-]{16,80}$/i.test(input.idempotencyKey || "")
    || (slug && !validateLookup(input.invitationSide, slug).ok)) return null;
  return { name, message, slug, side: input.invitationSide, id: input.idempotencyKey };
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return publicError(405, "METHOD_NOT_ALLOWED", "Phương thức không được hỗ trợ.");
  if (!isSameSiteRequest(request, env.ALLOWED_ORIGINS || "") || request.headers.get("X-Requested-With") !== "wedding-invitation") {
    return publicError(403, "FORBIDDEN", "Yêu cầu không hợp lệ.");
  }
  let input;
  try { input = await readSmallJson(request); }
  catch { return publicError(400, "INVALID_REQUEST", "Dữ liệu gửi lên không hợp lệ."); }
  if (typeof input?.website === "string" && input.website.trim()) return json({ ok: true, message: "Cảm ơn lời chúc của bạn!" }, { status: 201 });
  const data = validateWish(input);
  if (!data) return publicError(400, "VALIDATION_FAILED", "Vui lòng nhập tên và lời chúc (tối đa 2.000 ký tự).");
  if (env.TURNSTILE_SECRET_KEY && input.turnstileToken) {
    const verified = await verifyTurnstile(env, input.turnstileToken, request.headers.get("CF-Connecting-IP") || "", new URL(request.url).hostname, "wedding_wish").catch(() => false);
    if (!verified) return publicError(400, "TURNSTILE_FAILED", "Xác minh chống spam đã hết hạn. Vui lòng thử lại.");
  }
  try {
    const tab = data.side === "groom" ? "Lời chúc nhà trai" : "Lời chúc nhà gái";
    const headers = await readSheetRows(env, `'${tab}'!A1:G1`);
    if (!hasHeaders(headers[0], WISH_HEADERS)) throw new Error("WISH_HEADERS_MISMATCH");
    const ids = await readSheetRows(env, `'${tab}'!G2:G`);
    if (ids.some(row => row[0] === data.id)) return json({ ok: true, message: "Cảm ơn lời chúc của bạn!" });
    let invitedName = "";
    if (data.slug) {
      const inviteTab = data.side === "groom" ? "Nhà trai mời onl" : "Nhà gái mời onl";
      const rows = await readSheetRows(env, `'${inviteTab}'!A2:B`);
      const matches = rows.filter(row => String(row[1] || "").trim() === data.slug);
      if (matches.length !== 1) return publicError(400, "INVALID_INVITATION", "Link thiệp cá nhân không hợp lệ.");
      invitedName = String(matches[0][0] || "").trim().replace(/\s+/g, " ").slice(0, 120);
      if (!invitedName) return publicError(400, "INVALID_INVITATION", "Link thiệp cá nhân không hợp lệ.");
    }
    await appendSheetRow(env, `'${tab}'!A:G`, [vietnamSheetDate(), data.name, data.message, SIDE_LABELS[data.side], data.slug, invitedName, data.id]);
    return json({ ok: true, message: "Cảm ơn bạn! Lời chúc đã được gửi đến Tuấn Anh và Ngọc Anh." }, { status: 201 });
  } catch (error) {
    console.error("Wish save failed", error instanceof Error ? error.message : "UNKNOWN");
    return publicError(503, "SERVICE_UNAVAILABLE", "Chưa thể lưu lời chúc. Vui lòng thử lại sau.");
  }
}
