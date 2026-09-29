async function parseResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    error.code = body.code || "REQUEST_FAILED";
    error.status = response.status;
    throw error;
  }
  return body;
}

export async function fetchInvitation(side, slug, signal) {
  const params = new URLSearchParams({ side, slug });
  const response = await fetch(`/api/invitation?${params}`, {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
    signal,
  });
  return parseResponse(response);
}

export async function submitRsvp(payload, signal) {
  const response = await fetch("/api/rsvp", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "wedding-invitation",
    },
    credentials: "same-origin",
    body: JSON.stringify(payload),
    signal,
  });
  return parseResponse(response);
}
