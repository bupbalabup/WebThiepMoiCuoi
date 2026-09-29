import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";

test("Workers entry routes invitation requests to the existing API", async () => {
  const response = await worker.fetch(
    new Request("https://wedding.example/api/invitation?side=unknown&slug=guest", {
      headers: { Origin: "https://wedding.example" },
    }),
    {},
  );
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, "INVALID_SIDE");
});

test("Workers entry returns JSON 404 for unknown API paths", async () => {
  const response = await worker.fetch(new Request("https://wedding.example/api/missing"), {});
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Content-Type"), "application/json; charset=utf-8");
});

test("Workers entry delegates non-API requests to static assets", async () => {
  let requestedUrl = "";
  const env = {
    ASSETS: {
      fetch(request) {
        requestedUrl = request.url;
        return new Response("asset");
      },
    },
  };
  const response = await worker.fetch(new Request("https://wedding.example/nha-gai"), env);
  assert.equal(await response.text(), "asset");
  assert.equal(requestedUrl, "https://wedding.example/nha-gai");
});
