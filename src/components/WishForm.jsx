import React, { useCallback, useEffect, useRef, useState } from "react";
import { submitWish } from "../lib/api.js";
import TurnstileWidget from "./TurnstileWidget.jsx";

export default function WishForm({ side, invitedName = "", invitationSlug = null, hideHeader = false }) {
  const [name, setName] = useState(invitedName);
  const [wish, setWish] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const id = useRef("");
  const dirty = useRef(false);
  const onToken = useCallback((value) => setToken(value), []);

  useEffect(() => {
    if (!dirty.current) setName(invitedName);
  }, [invitedName]);

  async function send(event) {
    event.preventDefault();
    if (!name.trim() || !wish.trim()) {
      setNotice("Bạn hãy điền tên và lời chúc nhé.");
      return;
    }
    if (!id.current) {
      id.current =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Array.from(crypto.getRandomValues(new Uint8Array(16)), (value) =>
              value.toString(16).padStart(2, "0"),
            ).join("");
    }
    setStatus("sending");
    setNotice("");
    try {
      const result = await submitWish({
        name,
        message: wish,
        invitationSide: side,
        invitationSlug,
        idempotencyKey: id.current,
        turnstileToken: token,
        website,
      });
      setStatus("success");
      setNotice(result.message);
    } catch (error) {
      setStatus("error");
      setNotice(error.message);
      setToken("");
      setResetKey((k) => k + 1);
    }
  }

  const content = (
    <>
      {!hideHeader && (
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p className="lux-eyebrow">GỬI ĐẾN CHÚNG MÌNH</p>
          <h2 className="lux-section-title">Sổ Lưu Bút</h2>
          <p className="lux-section-subtitle">
            Một lời chúc nhỏ, một kỷ niệm thật đẹp trong ngày chung đôi.
          </p>
        </div>
      )}

      {status === "success" ? (
        <div className="wish-success" role="status">
          <h3>Cảm ơn bạn thật nhiều!</h3>
          <p>{notice}</p>
          <blockquote>{wish}</blockquote>
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.15rem", color: "var(--lux-espresso)" }}>
            Tuấn Anh &amp; Ngọc Anh
          </span>
        </div>
      ) : (
        <form onSubmit={send} className="wish-form">
          <div>
            <label htmlFor="wish-name">
              Tên của bạn <span style={{ color: "#a62b2b" }}>*</span>
            </label>
            <input
              id="wish-name"
              required
              maxLength={120}
              autoComplete="name"
              value={name}
              onChange={(e) => {
                dirty.current = true;
                setName(e.target.value);
              }}
              placeholder="Nhập họ và tên của bạn..."
            />
          </div>

          <div>
            <label htmlFor="wish-message">
              Lời chúc của bạn <span style={{ color: "#a62b2b" }}>*</span>
            </label>
            <textarea
              id="wish-message"
              required
              rows={4}
              maxLength={2000}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Gửi gắm những lời yêu thương và chúc phúc đến Tuấn Anh & Ngọc Anh…"
            />
            <small>
              {wish.length}/2.000 ký tự • Lời chúc được gửi riêng đến hai gia đình.
            </small>
          </div>

          <div className="honeypot" aria-hidden="true" style={{ display: "none" }}>
            <input
              aria-label="Để trống ô này"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {notice && (
            <p role="alert" className="form-notice error" style={{ color: "#a62b2b", background: "#fdf0f0", padding: "10px", margin: 0 }}>
              {notice}
            </p>
          )}

          <button
            className="button button-primary"
            type="submit"
            disabled={status === "sending"}
            style={{ width: "100%", minHeight: "48px" }}
          >
            {status === "sending" ? "ĐANG GỬI LỜI CHÚC..." : "GỬI LỜI CHÚC PHÚC"}
          </button>
        </form>
      )}
    </>
  );

  if (hideHeader) {
    return content;
  }

  return (
    <section className="wish-section paper-section" id="loi-chuc">
      {content}
    </section>
  );
}
