import React, { useCallback, useEffect, useRef, useState } from "react";
import { submitWish } from "../lib/api.js";
import TurnstileWidget from "./TurnstileWidget.jsx";

export default function WishForm({ side, invitedName = "", invitationSlug = null }) {
  const [name, setName] = useState(invitedName);
  const [wish, setWish] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const id = useRef("");
  const dirty = useRef(false);
  const onToken = useCallback(value => setToken(value), []);
  useEffect(() => { if (!dirty.current) setName(invitedName); }, [invitedName]);
  async function send(event) {
    event.preventDefault();
    if (!name.trim() || !wish.trim()) { setNotice("Bạn hãy điền tên và lời chúc nhé."); return; }
    if (!token) { setNotice("Vui lòng đợi xác minh chống spam hoàn tất."); return; }
    if (!id.current) id.current = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, "0")).join("");
    setStatus("sending"); setNotice("");
    try {
      const result = await submitWish({ name, message: wish, invitationSide: side, invitationSlug, idempotencyKey: id.current, turnstileToken: token, website });
      setStatus("success"); setNotice(result.message);
    } catch (error) { setStatus("error"); setNotice(error.message); setToken(""); setResetKey(k => k + 1); }
  }
  return <section className="wish-section paper-section" id="loi-chuc">
    <p className="eyebrow">GỬI ĐẾN CHÚNG MÌNH</p><h2>Sổ lưu bút</h2>
    <p>Một lời chúc nhỏ, một kỷ niệm thật đẹp trong ngày chung đôi.</p>
    {status === "success" ? <div className="wish-success" role="status"><h3>Cảm ơn bạn thật nhiều!</h3><p>{notice}</p><blockquote>{wish}</blockquote><span>Tuấn Anh &amp; Ngọc Anh</span></div> : <form onSubmit={send} className="wish-form">
      <label htmlFor="wish-name">Tên của bạn <span className="req">*</span></label>
      <input id="wish-name" required maxLength={120} autoComplete="name" value={name} onChange={e=>{dirty.current=true;setName(e.target.value);}} placeholder="Nhập họ và tên" />
      <label htmlFor="wish-message">Lời chúc của bạn <span className="req">*</span></label>
      <textarea id="wish-message" required rows={5} maxLength={2000} value={wish} onChange={e=>setWish(e.target.value)} placeholder="Gửi những lời yêu thương đến Tuấn Anh và Ngọc Anh…" />
      <small>{wish.length}/2.000 ký tự • Lời chúc được gửi riêng đến hai gia đình.</small>
      <div className="honeypot" aria-hidden="true"><input aria-label="Để trống ô này" tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)} /></div>
      <TurnstileWidget onToken={onToken} resetKey={resetKey} action="wedding_wish" />
      {notice && <p role="alert" className="form-notice error">{notice}</p>}
      <button className="button button-primary" disabled={status === "sending" || !token}>{status === "sending" ? "Đang gửi…" : "Gửi lời chúc"}</button>
    </form>}
  </section>;
}
