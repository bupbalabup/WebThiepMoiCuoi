export const RSVP_CLOSES_AT = new Date("2026-10-16T00:00:00+07:00");

export function isRsvpClosed(now = new Date()) {
  return now >= RSVP_CLOSES_AT;
}
