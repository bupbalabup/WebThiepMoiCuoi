const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
let cachedToken = null;

function base64Url(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function encodeJson(value) {
  return base64Url(new TextEncoder().encode(JSON.stringify(value)));
}

function pemToBytes(pem) {
  const normalized = pem.replace(/\\n/g, "\n");
  const body = normalized
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(body);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function createAssertion(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encodeJson({ alg: "RS256", typ: "JWT" })}.${encodeJson({
    iss: clientEmail,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBytes(privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  return `${unsigned}.${base64Url(new Uint8Array(signature))}`;
}

async function getAccessToken(env) {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.value;
  if (!env.GOOGLE_CLIENT_EMAIL || !env.GOOGLE_PRIVATE_KEY) throw new Error("GOOGLE_CREDENTIALS_MISSING");

  const assertion = await createAssertion(env.GOOGLE_CLIENT_EMAIL, env.GOOGLE_PRIVATE_KEY);
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.access_token) throw new Error("GOOGLE_AUTH_FAILED");

  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + Math.min(Number(body.expires_in || 3600), 3600) * 1000,
  };
  return cachedToken.value;
}

function sheetsUrl(env, range, suffix = "") {
  if (!env.GOOGLE_SHEET_ID) throw new Error("GOOGLE_SHEET_ID_MISSING");
  return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.GOOGLE_SHEET_ID)}/values/${encodeURIComponent(range)}${suffix}`;
}

async function sheetsRequest(env, url, init = {}) {
  const token = await getAccessToken(env);
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) cachedToken = null;
    throw new Error(`GOOGLE_SHEETS_${response.status}`);
  }
  return body;
}

export async function readSheetRows(env, range) {
  const body = await sheetsRequest(env, sheetsUrl(env, range));
  return Array.isArray(body.values) ? body.values : [];
}

export async function appendSheetRow(env, range, values) {
  // OVERWRITE appends into the next free row without inserting a new row into
  // the sheet. INSERT_ROWS shifts summary formulas that start at row 2.
  const suffix = ":append?valueInputOption=RAW&insertDataOption=OVERWRITE";
  return sheetsRequest(env, sheetsUrl(env, range, suffix), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ majorDimension: "ROWS", values: [values] }),
  });
}
