import test from "node:test";
import assert from "node:assert/strict";
import { onRequest as invitationRequest } from "../functions/api/invitation.js";
import { onRequest as rsvpRequest, RSVP_HEADERS, RSVP_TAB_NAMES } from "../functions/api/rsvp.js";

function bytesToBase64(bytes) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value);
}

async function createPrivateKeyPem() {
  const pair = await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  );
  const bytes = new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey));
  const body = bytesToBase64(bytes).match(/.{1,64}/g).join("\n");
  return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----\n`;
}

function env(privateKey) {
  return {
    APP_ENV: "production",
    TURNSTILE_SECRET_KEY: "fake-secret-for-tests",
    GOOGLE_CLIENT_EMAIL: "wedding-test@example.iam.gserviceaccount.com",
    GOOGLE_PRIVATE_KEY: privateKey,
    GOOGLE_SHEET_ID: "private-sheet-id",
    ALLOWED_ORIGINS: "https://wedding.example",
  };
}

function request(path, init = {}) {
  return new Request(`https://wedding.example${path}`, {
    ...init,
    headers: { Origin: "https://wedding.example", ...(init.headers || {}) },
  });
}

test("invitation API returns one matching name without exposing the sheet", async () => {
  const privateKey = await createPrivateKeyPem();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes("oauth2.googleapis.com")) return Response.json({ access_token: "test-access-token", expires_in: 3600 });
    assert.match(String(url), /sheets\.googleapis\.com/);
    return Response.json({ values: [["Nguyễn Văn A", "nguyen-van-a"]] });
  };
  try {
    const response = await invitationRequest({
      request: request("/api/invitation?side=groom&slug=nguyen-van-a"),
      env: env(privateKey),
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, name: "Nguyễn Văn A", side: "groom", slug: "nguyen-van-a" });
    assert.equal(response.headers.get("Cache-Control"), "no-store, max-age=0");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("RSVP API verifies and appends values as a raw row", async () => {
  const privateKey = await createPrivateKeyPem();
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  let appended;
  globalThis.fetch = async (url, init = {}) => {
    const target = String(url);
    if (target.includes("oauth2.googleapis.com")) return Response.json({ access_token: "test-access-token", expires_in: 3600 });
    if (target.includes("challenges.cloudflare.com")) return Response.json({success:true,hostname:"wedding.example",action:"wedding_rsvp"});
    if (target.includes("A1%3AJ1")) return Response.json({values:[RSVP_HEADERS]});
    if (init.method === "POST") {
      assert.match(target, /:append\?/);
      appended = { url: target, body: JSON.parse(init.body) };
      return Response.json({ updates: { updatedRows: 1 } });
    }
    if (target.includes("G2%3AG")) return Response.json({ values: [] });
    if (target.includes("A2%3AB")) return Response.json({ values: [["Nguyễn Văn A", "nguyen-van-a"]] });
    throw new Error(`Unexpected URL ${target}`);
  };
  Date.now = () => Date.parse("2026-09-29T12:00:00+07:00");
  try {
    const response = await rsvpRequest({
      request: request("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "wedding-invitation" },
        body: JSON.stringify({
          name: "Nguyễn Văn A",
          attendance: "attending",
          guestCount: 3,
          relationship: "friend",
          relationshipOther: "",
          invitationSide: "groom",
          invitationSlug: "nguyen-van-a",
          idempotencyKey: "123e4567-e89b-12d3-a456-426614174000",
          turnstileToken: "mock-verified-token",
          website: "",
        }),
      }),
      env: env(privateKey),
    });
    assert.equal(response.status, 201);
    assert.match(appended.url, /valueInputOption=RAW/);
    assert.match(appended.url, /insertDataOption=OVERWRITE/);
    assert.match(appended.url, /Nh%C3%A0%20trai/);
    assert.deepEqual(appended.body.values[0].slice(1), [
      "Nguyễn Văn A", "attending", 3, "friend", "", "123e4567-e89b-12d3-a456-426614174000", "groom", "nguyen-van-a", "Nguyễn Văn A",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
  }
});

test("RSVP API silently discards honeypot submissions before Google access", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("fetch must not run"); };
  try {
    const response = await rsvpRequest({
      request: request("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "wedding-invitation" },
        body: JSON.stringify({ website: "https://spam.example" }),
      }),
      env: {},
    });
    assert.equal(response.status, 201);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("API rejects cross-site form posts", async () => {
  const response = await rsvpRequest({
    request: new Request("https://wedding.example/api/rsvp", {
      method: "POST",
      headers: { Origin: "https://attacker.example", "Content-Type": "application/json", "X-Requested-With": "wedding-invitation" },
      body: "{}",
    }),
    env: {},
  });
  assert.equal(response.status, 403);
});

test("RSVP API refuses to write into a tab with unrelated headers", async () => {
  const privateKey = await createPrivateKeyPem();
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  const originalError = console.error;
  let writes = 0;
  const sheetRequests = [];
  globalThis.fetch = async (url, init = {}) => {
    const target = String(url);
    if (target.includes("oauth2.googleapis.com")) return Response.json({ access_token: "test-access-token", expires_in: 3600 });
    if (target.includes("challenges.cloudflare.com")) return Response.json({ success: true, hostname: "wedding.example", action: "wedding_rsvp" });
    if (target.includes("sheets.googleapis.com")) sheetRequests.push(target);
    if (init.method === "POST") writes++;
    return Response.json({ values: [["Tên", "Slug", "Link thiệp"]] });
  };
  Date.now = () => Date.parse("2026-09-29T12:00:00+07:00");
  console.error = () => {};
  try {
    const response = await rsvpRequest({
      request: request("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Requested-With": "wedding-invitation" },
        body: JSON.stringify({ name: "Khách thử", attendance: "attending", guestCount: 1, relationship: "friend", invitationSide: "bride", idempotencyKey: "123e4567-e89b-12d3-a456-426614174001", turnstileToken: "mock-verified-token" }),
      }),
      env: env(privateKey),
    });
    assert.equal(response.status, 503);
    assert.equal(writes, 0);
    assert.ok(sheetRequests.some((url) => url.includes("Nh%C3%A0%20g%C3%A1i")));
    assert.equal((await response.json()).code, "RSVP_SERVICE_UNAVAILABLE");
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
    console.error = originalError;
  }
});

test("RSVP tabs are separated from online invitation-list tabs", () => {
  assert.deepEqual(RSVP_TAB_NAMES, { groom: "Nhà trai", bride: "Nhà gái" });
});
