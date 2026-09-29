import React, { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "cloudflare-turnstile-script";

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.turnstile), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function TurnstileWidget({ onToken, resetKey }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [widgetSize, setWidgetSize] = useState(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // Flexible Turnstile has a 300px minimum; measure the form, not the screen.
    const updateSize = () => {
      setWidgetSize(container.getBoundingClientRect().width < 300 ? "compact" : "flexible");
    };
    updateSize();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateSize);
      observer.observe(container);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!siteKey) {
      if (import.meta.env.DEV) onToken("development-bypass");
      else onToken("");
      return undefined;
    }
    if (!widgetSize) return undefined;

    let active = true;
    // A new widget must verify again; never submit the previous size's token.
    onToken("");
    loadTurnstile().then((turnstile) => {
      if (!active || !containerRef.current) return;
      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: "wedding_rsvp",
        theme: "light",
        size: widgetSize,
        callback: (token) => { if (active) onToken(token); },
        "expired-callback": () => { if (active) onToken(""); },
        "error-callback": () => { if (active) onToken(""); },
      });
    }).catch(() => { if (active) onToken(""); });

    return () => {
      active = false;
      if (window.turnstile && widgetIdRef.current != null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onToken, resetKey, widgetSize]);

  if (!siteKey && !import.meta.env.DEV) {
    return <p className="form-notice error">Biểu mẫu chống spam chưa được cấu hình. Vui lòng quay lại sau.</p>;
  }
  return <div ref={containerRef} className="turnstile-slot" aria-label="Xác minh chống spam" />;
}
