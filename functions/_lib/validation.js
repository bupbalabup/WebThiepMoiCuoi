export const VALID_SIDES = new Set(["groom", "bride"]);
export const VALID_ATTENDANCE = new Set(["attending", "considering", "declined"]);
export const VALID_RELATIONSHIPS = new Set(["family", "friend", "coworker", "mutual_friend", "other"]);
export const RSVP_CLOSES_AT_MS = Date.parse("2026-10-16T00:00:00+07:00");
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function validateLookup(side, slug) {
  if (!VALID_SIDES.has(side)) return { ok: false, code: "INVALID_SIDE" };
  if (!SLUG_PATTERN.test(slug || "") || slug === "phuc-dap" || slug.length > 120) {
    return { ok: false, code: "INVALID_SLUG" };
  }
  return { ok: true, value: { side, slug } };
}

export function validateRsvp(input, nowMs = Date.now()) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, code: "INVALID_REQUEST" };
  }
  if (nowMs >= RSVP_CLOSES_AT_MS) return { ok: false, code: "RSVP_CLOSED" };

  const name = cleanText(input.name, 120);
  const relationshipOther = cleanText(input.relationshipOther, 120);
  const invitationSlug = input.invitationSlug == null ? "" : cleanText(input.invitationSlug, 120);
  const idempotencyKey = cleanText(input.idempotencyKey, 80);
  const errors = {};

  if (!name) errors.name = "required";
  if (!VALID_ATTENDANCE.has(input.attendance)) errors.attendance = "invalid";
  if (!VALID_RELATIONSHIPS.has(input.relationship)) errors.relationship = "invalid";
  if (!VALID_SIDES.has(input.invitationSide)) errors.invitationSide = "invalid";
  if (input.relationship === "other" && !relationshipOther) errors.relationshipOther = "required";
  if (invitationSlug && (!SLUG_PATTERN.test(invitationSlug) || invitationSlug === "phuc-dap")) errors.invitationSlug = "invalid";
  if (!/^[0-9a-f-]{16,80}$/i.test(idempotencyKey)) errors.idempotencyKey = "invalid";

  let guestCount = Number(input.guestCount);
  if (input.attendance === "declined") guestCount = 0;
  else if (!Number.isSafeInteger(guestCount) || guestCount < 1) errors.guestCount = "invalid";

  if (Object.keys(errors).length) return { ok: false, code: "VALIDATION_FAILED", errors };
  return {
    ok: true,
    value: {
      name,
      attendance: input.attendance,
      guestCount,
      relationship: input.relationship,
      relationshipOther: input.relationship === "other" ? relationshipOther : "",
      invitationSide: input.invitationSide,
      invitationSlug,
      idempotencyKey,
    },
  };
}
