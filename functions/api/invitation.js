import { readSheetRows } from "../_lib/google.js";
import { isSameSiteRequest, json, publicError } from "../_lib/http.js";
import { invitationColumns } from "../_lib/sheet-data.js";
import { validateLookup } from "../_lib/validation.js";

const SHEET_TABS = {
  groom: "Nhà trai mời onl",
  bride: "Nhà gái mời onl",
};

async function handleGet({ request, env }) {
  if (!isSameSiteRequest(request, env.ALLOWED_ORIGINS || "")) {
    return publicError(403, "FORBIDDEN", "Yêu cầu không hợp lệ.");
  }

  const url = new URL(request.url);
  const validation = validateLookup(url.searchParams.get("side"), url.searchParams.get("slug"));
  if (!validation.ok) return publicError(400, validation.code, "Đường dẫn thiệp không hợp lệ.");

  try {
    const { side, slug } = validation.value;
    const tab = SHEET_TABS[side].replace(/'/g, "''");
    const table = invitationColumns(await readSheetRows(env, `'${tab}'!A1:C`));
    const matches = table.rows.filter((row) => String(row[table.slugIndex] || "").trim().toLowerCase() === slug);
    if (!matches.length) return publicError(404, "INVITATION_NOT_FOUND", "Không tìm thấy thiệp mời này.");
    if (matches.length > 1) return publicError(409, "DUPLICATE_SLUG", "Link thiệp đang bị trùng. Vui lòng liên hệ gia đình.");

    const invitedName = String(matches[0][table.nameIndex] || "").trim().replace(/\s+/g, " ").slice(0, 120);
    if (!invitedName) return publicError(404, "INVITATION_NOT_FOUND", "Không tìm thấy thiệp mời này.");
    return json({ ok: true, name: invitedName, side, slug });
  } catch (error) {
    console.error("Invitation lookup failed", error instanceof Error ? error.message : "UNKNOWN");
    return publicError(503, "INVITATION_SERVICE_UNAVAILABLE", "Chưa thể mở thiệp cá nhân. Vui lòng thử lại sau.");
  }
}

export function onRequest(context) {
  if (context.request.method !== "GET") {
    return publicError(405, "METHOD_NOT_ALLOWED", "Phương thức không được hỗ trợ.");
  }
  return handleGet(context);
}
