import { useEffect, useState } from "react";
import { fetchInvitation } from "../lib/api.js";

export default function useInvitation(side, slug) {
  const [state, setState] = useState(() => ({
    status: slug ? "loading" : "idle",
    invitation: null,
    error: null,
  }));

  useEffect(() => {
    if (!slug) {
      setState({ status: "idle", invitation: null, error: null });
      return undefined;
    }

    const controller = new AbortController();
    setState({ status: "loading", invitation: null, error: null });
    fetchInvitation(side, slug, controller.signal)
      .then((invitation) => setState({ status: "success", invitation, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ status: "error", invitation: null, error });
      });
    return () => controller.abort();
  }, [side, slug]);

  return state;
}
