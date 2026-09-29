import test from "node:test";
import assert from "node:assert/strict";
import { buildRsvpUrl, matchRoute, normalizePath } from "../src/lib/routes.js";

test("static RSVP routes take priority over personal slugs", () => {
  assert.deepEqual(matchRoute("/nha-trai/phuc-dap"), { page: "rsvp", side: "groom", slug: null });
  assert.deepEqual(matchRoute("/nha-gai/phuc-dap/"), { page: "rsvp", side: "bride", slug: null });
});

test("personal routes accept safe slugs and reject unsafe paths", () => {
  assert.deepEqual(matchRoute("/nha-trai/nguyen-van-a"), { page: "invitation", side: "groom", slug: "nguyen-van-a" });
  assert.equal(matchRoute("/nha-trai/Nguyen Van A").page, "not-found");
  assert.equal(matchRoute("/nha-gai/a/b").page, "not-found");
});

test("route helpers normalize paths and preserve side on RSVP links", () => {
  assert.equal(normalizePath("//nha-trai///"), "/nha-trai");
  assert.equal(buildRsvpUrl("groom", "nguyen-van-a"), "/nha-trai/phuc-dap?khach=nguyen-van-a");
  assert.equal(buildRsvpUrl("bride", null), "/nha-gai/phuc-dap");
});
