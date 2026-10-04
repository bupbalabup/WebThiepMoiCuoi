import test from "node:test";
import assert from "node:assert/strict";
import { onRequest, validateWish } from "../functions/api/wishes.js";
import { WISH_HEADERS, vietnamSheetDate } from "../functions/_lib/sheet-data.js";
import worker from "../worker/index.js";

const payload = { name: "  Nguyễn   Văn A ", message: "=Một lời chúc\nChúc hai bạn hạnh phúc!", invitationSide: "bride", invitationSlug: "nguyen-van-a", idempotencyKey: "123e4567-e89b-12d3-a456-426614174000", turnstileToken: "test-token", website: "" };
const makeRequest = (input = payload, origin = "https://wedding.example") => new Request("https://wedding.example/api/wishes", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", "X-Requested-With": "wedding-invitation" }, body: JSON.stringify(input) });

test("wish validation rejects invalid sides, reserved slugs and oversized content", () => {
  assert.equal(validateWish(null), null);
  assert.equal(validateWish({ ...payload, invitationSide: "unknown" }), null);
  assert.equal(validateWish({ ...payload, invitationSlug: "phuc-dap" }), null);
  assert.equal(validateWish({ ...payload, message: "a".repeat(2001) }), null);
  assert.equal(validateWish({ ...payload, name: "a".repeat(121) }), null);
  assert.equal(validateWish({ ...payload, message: "  " }), null);
  assert.equal(validateWish(payload).name, "Nguyễn Văn A");
});

test("Sheet timestamp is sortable and represents Vietnam local time", () => {
  assert.equal(vietnamSheetDate(Date.parse("2026-09-30T17:00:00Z")), 46296);
  assert.equal(vietnamSheetDate(Date.parse("2026-09-30T05:00:00Z")), 46295.5);
});

test("wishes reject cross-site posts and GET; honeypot never writes", async () => {
  assert.equal((await onRequest({ request: makeRequest(payload, "https://attacker.example"), env: {} })).status, 403);
  assert.equal((await worker.fetch(new Request("https://wedding.example/api/wishes"), {})).status, 405);
  assert.equal((await onRequest({ request: makeRequest({ website: "spam" }), env: {} })).status, 201);
});

test("wishes verify action, preserve text safely and write Vietnamese data to the correct tab", async () => {
  const pair = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  const pem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(await crypto.subtle.exportKey("pkcs8", pair.privateKey)).toString("base64")}\n-----END PRIVATE KEY-----`;
  const env = { GOOGLE_PRIVATE_KEY: pem, GOOGLE_CLIENT_EMAIL: "test@example.iam.gserviceaccount.com", GOOGLE_SHEET_ID: "test-sheet", TURNSTILE_SECRET_KEY: "fake-secret", ALLOWED_ORIGINS: "https://wedding.example" };
  const original = globalThis.fetch;
  let appended, action = "wedding_wish", duplicate = false, validSlug = true;
  globalThis.fetch = async (url, init = {}) => {
    const target = String(url);
    if (target.includes("oauth2.googleapis.com")) return Response.json({ access_token: "test", expires_in: 3600 });
    if (target.includes("challenges.cloudflare.com")) return Response.json({ success: true, hostname: "wedding.example", action });
    if (init.method !== "POST" && target.includes("A1%3AH1")) return Response.json({ values: [["STT", ...WISH_HEADERS]] });
    if (target.includes("H2%3AH")) return Response.json({ values: duplicate ? [[payload.idempotencyKey]] : [] });
    if (target.includes("A1%3AC")) return Response.json({ values: validSlug ? [["STT", "Tên khách mời", "Đường dẫn khách mời"], ["1", "Nguyễn Văn A", "nguyen-van-a"]] : [["STT", "Tên khách mời", "Đường dẫn khách mời"]] });
    assert.match(target, /valueInputOption=RAW/);
    assert.match(target, /L%E1%BB%9Di%20ch%C3%BAc%20nh%C3%A0%20g%C3%A1i/);
    assert.match(decodeURIComponent(target), /'Lời chúc nhà gái'!A1:H1/);
    appended = JSON.parse(init.body).values[0];
    return Response.json({ updates: { updatedRows: 1 } });
  };
  try {
    const response = await onRequest({ request: makeRequest(), env });
    assert.equal(response.status, 201);
    assert.equal(appended[0], null);
    assert.equal(typeof appended[1], "number");
    assert.deepEqual(appended.slice(2), ["Nguyễn Văn A", payload.message, "Nhà gái", "nguyen-van-a", "Nguyễn Văn A", payload.idempotencyKey]);
    appended = null; duplicate = true;
    assert.equal((await onRequest({ request: makeRequest(), env })).status, 200);
    assert.equal(appended, null);
    duplicate = false; validSlug = false;
    assert.equal((await onRequest({ request: makeRequest(), env })).status, 400);
    assert.equal(appended, null);
    action = "wedding_rsvp";
    assert.equal((await onRequest({ request: makeRequest(), env })).status, 400);
    assert.equal(appended, null);
  } finally { globalThis.fetch = original; }
});
