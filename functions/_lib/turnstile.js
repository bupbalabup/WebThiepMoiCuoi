const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(env, token, remoteIp) {
  const isProduction = env.APP_ENV === "production";
  if (!isProduction && token === "development-bypass") return true;
  if (!env.TURNSTILE_SECRET_KEY || typeof token !== "string" || !token) return false;

  const payload = new FormData();
  payload.append("secret", env.TURNSTILE_SECRET_KEY);
  payload.append("response", token);
  if (remoteIp) payload.append("remoteip", remoteIp);

  const response = await fetch(VERIFY_URL, { method: "POST", body: payload });
  if (!response.ok) return false;
  const result = await response.json().catch(() => ({}));
  return result.success === true;
}
