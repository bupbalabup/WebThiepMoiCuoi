const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers || {}) },
  });
}

export function publicError(status, code, message) {
  return json({ ok: false, code, message }, { status });
}

export function isSameSiteRequest(request, allowedOrigins = "") {
  const urlOrigin = new URL(request.url).origin;
  const allowed = new Set(
    allowedOrigins
      .split(",")
      .map((value) => value.trim().replace(/\/$/, ""))
      .filter(Boolean),
  );
  allowed.add(urlOrigin);

  const origin = request.headers.get("Origin");
  if (origin) return allowed.has(origin.replace(/\/$/, ""));

  const fetchSite = request.headers.get("Sec-Fetch-Site");
  return !fetchSite || fetchSite === "same-origin" || fetchSite === "none";
}

export async function readSmallJson(request, maxBytes = 16_384) {
  const type = request.headers.get("Content-Type") || "";
  if (!type.toLowerCase().startsWith("application/json")) {
    const error = new Error("UNSUPPORTED_MEDIA_TYPE");
    error.status = 415;
    throw error;
  }

  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > maxBytes) {
    const error = new Error("PAYLOAD_TOO_LARGE");
    error.status = 413;
    throw error;
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) {
    const error = new Error("PAYLOAD_TOO_LARGE");
    error.status = 413;
    throw error;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("INVALID_JSON");
    error.status = 400;
    throw error;
  }
}
