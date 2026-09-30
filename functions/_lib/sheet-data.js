export const RSVP_HEADERS_VI = ["Thời gian gửi", "Họ và tên", "Phúc đáp", "Tổng số người", "Mối quan hệ", "Thông tin khác", "Mã phúc đáp", "Bên mời", "Đường dẫn khách mời", "Tên được mời"];
export const RSVP_HEADERS_LEGACY = ["submitted_at", "name", "attendance", "guest_count", "relationship", "relationship_other", "submission_id", "invitation_side", "invitation_slug", "invited_name"];
export const WISH_HEADERS = ["Thời gian gửi", "Họ và tên", "Lời chúc", "Bên mời", "Đường dẫn khách mời", "Tên được mời", "Mã lời chúc"];
export const ATTENDANCE_LABELS = { attending: "Có tham dự", accepted: "Có tham dự", considering: "Đang cân nhắc", declined: "Không tham dự" };
export const RELATIONSHIP_LABELS = { family: "Gia đình/người thân", friend: "Bạn bè", coworker: "Đồng nghiệp", mutual_friend: "Bạn chung", other: "Mục khác" };
export const SIDE_LABELS = { groom: "Nhà trai", bride: "Nhà gái" };
// Sheets dates are serial numbers. Apply the display format separately so dates remain sortable.
export function vietnamSheetDate(now = Date.now()) { return (now + 7 * 3600000) / 86400000 + 25569; }
export function hasHeaders(row, expected) { return expected.every((value, i) => row?.[i] === value); }
