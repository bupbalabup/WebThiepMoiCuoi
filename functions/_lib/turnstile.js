const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(env, token, remoteIp, expectedHostname, expectedAction = "wedding_rsvp") {
  const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(expectedHostname);
  if (env.APP_ENV === "development" && localHost && token === "development-bypass") return true;
  if (token === "development-bypass") return false;
  if (!env.TURNSTILE_SECRET_KEY || typeof token !== "string" || !token) return false;

  const payload = new FormData();
  payload.append("secret", env.TURNSTILE_SECRET_KEY);
  payload.append("response", token);
  if (remoteIp) payload.append("remoteip", remoteIp);

  const response = await fetch(VERIFY_URL, { method: "POST", body: payload });
  if (!response.ok) return false;
  const result = await response.json().catch(() => ({}));
  return result.success === true
    && result.action === expectedAction
    && (!expectedHostname || result.hostname === expectedHostname);
}
