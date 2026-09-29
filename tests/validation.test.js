import test from "node:test";
import assert from "node:assert/strict";
import { RSVP_CLOSES_AT_MS, validateLookup, validateRsvp } from "../functions/_lib/validation.js";

const valid = {
  name: "  Nguyễn   Văn A ",
  attendance: "attending",
  guestCount: 2,
  relationship: "friend",
  relationshipOther: "should be discarded",
  invitationSide: "groom",
  invitationSlug: "nguyen-van-a",
  idempotencyKey: "123e4567-e89b-12d3-a456-426614174000",
};

test("normalizes a valid RSVP and removes unrelated other text", () => {
  const result = validateRsvp(valid, RSVP_CLOSES_AT_MS - 1);
  assert.equal(result.ok, true);
  assert.equal(result.value.name, "Nguyễn Văn A");
  assert.equal(result.value.guestCount, 2);
  assert.equal(result.value.relationshipOther, "");
});

test("declined RSVP always stores zero guests", () => {
  const result = validateRsvp({ ...valid, attendance: "declined", guestCount: 999 }, RSVP_CLOSES_AT_MS - 1);
  assert.equal(result.ok, true);
  assert.equal(result.value.guestCount, 0);
});

test("other relationship requires a short explanation", () => {
  const result = validateRsvp({ ...valid, relationship: "other", relationshipOther: " " }, RSVP_CLOSES_AT_MS - 1);
  assert.equal(result.ok, false);
  assert.equal(result.errors.relationshipOther, "required");
});

test("guest count has no business maximum but must be a safe positive integer", () => {
  assert.equal(validateRsvp({ ...valid, guestCount: 1000 }, RSVP_CLOSES_AT_MS - 1).ok, true);
  assert.equal(validateRsvp({ ...valid, guestCount: 0 }, RSVP_CLOSES_AT_MS - 1).ok, false);
  assert.equal(validateRsvp({ ...valid, guestCount: 1.5 }, RSVP_CLOSES_AT_MS - 1).ok, false);
});

test("server deadline closes at midnight after 15 October in Vietnam", () => {
  assert.equal(validateRsvp(valid, RSVP_CLOSES_AT_MS - 1).ok, true);
  assert.equal(validateRsvp(valid, RSVP_CLOSES_AT_MS).code, "RSVP_CLOSED");
});

test("lookup only accepts known sides and safe non-reserved slugs", () => {
  assert.equal(validateLookup("groom", "nguyen-van-a").ok, true);
  assert.equal(validateLookup("family", "nguyen-van-a").ok, false);
  assert.equal(validateLookup("bride", "phuc-dap").ok, false);
  assert.equal(validateLookup("bride", "../secret").ok, false);
});
