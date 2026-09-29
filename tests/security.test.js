import test from "node:test";
import assert from "node:assert/strict";
import { verifyTurnstile } from "../functions/_lib/turnstile.js";
import { onRequest } from "../functions/api/rsvp.js";
import { matchRoute } from "../src/lib/routes.js";

test("bypass is confined to explicit local development", async () => {
  assert.equal(await verifyTurnstile({}, "development-bypass", "", "wedding.example"), false);
  assert.equal(await verifyTurnstile({APP_ENV:"development"}, "development-bypass", "", "wedding.example"), false);
  assert.equal(await verifyTurnstile({APP_ENV:"production"}, "development-bypass", "", "localhost"), false);
  assert.equal(await verifyTurnstile({APP_ENV:"development"}, "development-bypass", "", "localhost"), true);
});

test("Turnstile requires the expected action and hostname", async () => {
  const originalFetch = globalThis.fetch;
  let result = {success:true,action:"wedding_rsvp",hostname:"wedding.example"};
  globalThis.fetch = async () => Response.json(result);
  try {
    const env = {TURNSTILE_SECRET_KEY:"fake-secret"};
    assert.equal(await verifyTurnstile(env,"token","","wedding.example"),true);
    result = {...result,hostname:"attacker.example"};
    assert.equal(await verifyTurnstile(env,"token","","wedding.example"),false);
    result = {...result,hostname:"wedding.example",action:"other"};
    assert.equal(await verifyTurnstile(env,"token","","wedding.example"),false);
  } finally { globalThis.fetch=originalFetch; }
});

test("null JSON is rejected instead of crashing the API", async () => {
  const response=await onRequest({request:new Request("https://wedding.example/api/rsvp", {
    method:"POST", headers:{"Content-Type":"application/json","X-Requested-With":"wedding-invitation"}, body:"null"
  }), env:{}});
  assert.equal(response.status,400);
});

test("malformed URL encoding does not crash React routing", () => {
  assert.equal(matchRoute("/nha-gai/%E0%A4").page, "not-found");
});
