import { onRequest as invitationRequest } from "../functions/api/invitation.js";
import { onRequest as rsvpRequest } from "../functions/api/rsvp.js";
import { onRequest as wishRequest } from "../functions/api/wishes.js";

const API_NOT_FOUND = JSON.stringify({
  ok: false,
  code: "NOT_FOUND",
  message: "API không tồn tại.",
});

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/invitation") {
      return invitationRequest({ request, env });
    }

    if (pathname === "/api/rsvp") {
      return rsvpRequest({ request, env });
    }
    if (pathname === "/api/wishes") return wishRequest({ request, env });

    if (pathname.startsWith("/api/")) {
      return new Response(API_NOT_FOUND, {
        status: 404,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
