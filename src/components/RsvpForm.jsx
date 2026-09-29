import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { submitRsvp } from "../lib/api.js";
import { isRsvpClosed } from "../lib/date.js";
import TurnstileWidget from "./TurnstileWidget.jsx";

const ATTENDANCE = [
  ["attending", "Có mình sẽ tham gia"],
  ["considering", "Mình đang cân nhắc"],
  ["declined", "Tiếc quá mình không tham gia được rồi"],
];
const RELATIONSHIPS = [
  ["family", "Gia đình/người thân"],
  ["friend", "Bạn bè"],
  ["coworker", "Đồng nghiệp"],
  ["mutual_friend", "Bạn chung"],
  ["other", "Mục khác"],
];

function validate(values) {
  const errors = {};
  const name = values.name.trim().replace(/\s+/g, " ");
  if (!name) errors.name = "Vui lòng nhập tên của bạn.";
  else if (name.length > 120) errors.name = "Tên không được dài quá 120 ký tự.";
  if (!ATTENDANCE.some(([value]) => value === values.attendance)) errors.attendance = "Vui lòng chọn một phương án.";
  if (values.attendance && values.attendance !== "declined") {
    const count = values.guestChoice === "other" ? Number(values.guestOther) : Number(values.guestChoice);
    if (!Number.isSafeInteger(count) || count < 1) errors.guestCount = "Vui lòng nhập số nguyên từ 1 trở lên.";
  }
  if (!RELATIONSHIPS.some(([value]) => value === values.relationship)) errors.relationship = "Vui lòng chọn một phương án.";
  if (values.relationship === "other" && !values.relationshipOther.trim()) errors.relationshipOther = "Vui lòng cho chúng mình biết thêm.";
  return errors;
}

function createSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

export default function RsvpForm({ side, invitedName = "", invitationSlug = null, compact = false }) {
  const dirtyNameRef = useRef(false);
  const submissionIdRef = useRef("");
  const [values, setValues] = useState({
    name: invitedName,
    attendance: "",
    guestChoice: "1",
    guestOther: "",
    relationship: "",
    relationshipOther: "",
    website: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const closed = useMemo(() => isRsvpClosed(), []);
  const onToken = useCallback((token) => setTurnstileToken(token), []);

  useEffect(() => {
    if (invitedName && !dirtyNameRef.current) setValues((current) => ({ ...current, name: invitedName }));
  }, [invitedName]);

  function update(key, value) {
    if (key === "name") dirtyNameRef.current = true;
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, ...(key === "attendance" ? { guestCount: undefined } : {}) }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setMessage("Vui lòng kiểm tra các câu trả lời được đánh dấu.");
      return;
    }
    if (!turnstileToken) {
      setMessage("Vui lòng hoàn tất bước xác minh chống spam.");
      return;
    }

    const guestCount = values.attendance === "declined"
      ? 0
      : Number(values.guestChoice === "other" ? values.guestOther : values.guestChoice);
    const payload = {
      name: values.name.trim().replace(/\s+/g, " "),
      attendance: values.attendance,
      guestCount,
      relationship: values.relationship,
      relationshipOther: values.relationship === "other" ? values.relationshipOther.trim().replace(/\s+/g, " ") : "",
      invitationSide: side,
      invitationSlug,
      turnstileToken,
      idempotencyKey: submissionIdRef.current || createSubmissionId(),
      website: values.website,
    };

    setStatus("submitting");
    setMessage("");
    submissionIdRef.current = payload.idempotencyKey;
    try {
      await submitRsvp(payload);
      setStatus("success");
      submissionIdRef.current = "";
      setMessage("Cảm ơn bạn! Phúc đáp đã được lưu thành công.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    }
  }

  if (closed) {
    return <div className="closed-card"><strong>Đã kết thúc thời gian phúc đáp</strong><p>Cảm ơn bạn đã quan tâm. Vui lòng liên hệ trực tiếp với gia đình nếu cần thay đổi thông tin.</p></div>;
  }
  if (status === "success") {
    return <div className="success-card" role="status"><span aria-hidden="true">♥</span><strong>{message}</strong><p>Hẹn gặp bạn trong ngày vui của Tuấn Anh và Ngọc Anh.</p></div>;
  }

  return (
    <form className={`rsvp-form ${compact ? "compact" : ""}`} onSubmit={onSubmit} noValidate>
      <p className="deadline-note">Vui lòng phúc đáp trước khi kết thúc ngày <strong>15.10.2026</strong>.</p>
      <div className="form-field">
        <label htmlFor="rsvp-name">1. Tên anh/chị/bạn là gì? <span aria-hidden="true">*</span></label>
        <input id="rsvp-name" type="text" value={values.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" maxLength="120" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
        {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
      </div>

      <fieldset className="form-field choice-group">
        <legend>2. Bạn có tham dự tiệc cưới của chúng mình không? <span aria-hidden="true">*</span></legend>
        {ATTENDANCE.map(([value, label]) => <label className="choice-card" key={value}><input type="radio" name="attendance" value={value} checked={values.attendance === value} onChange={() => update("attendance", value)} /><span>{label}</span></label>)}
        {errors.attendance && <span className="field-error">{errors.attendance}</span>}
      </fieldset>

      {values.attendance !== "declined" && (
        <fieldset className="form-field choice-group inline-choices">
          <legend>3. Bạn sẽ tham dự cùng bao nhiêu người (tính cả bạn nhé)? <span aria-hidden="true">*</span></legend>
          {["1", "2", "other"].map((value) => <label className="choice-card" key={value}><input type="radio" name="guest-count" value={value} checked={values.guestChoice === value} onChange={() => update("guestChoice", value)} /><span>{value === "other" ? "Mục khác" : `${value} người`}</span></label>)}
          {values.guestChoice === "other" && <input type="number" inputMode="numeric" min="1" step="1" value={values.guestOther} onChange={(event) => update("guestOther", event.target.value)} placeholder="Nhập tổng số người" aria-label="Tổng số người tham dự" />}
          {errors.guestCount && <span className="field-error">{errors.guestCount}</span>}
        </fieldset>
      )}

      <fieldset className="form-field choice-group">
        <legend>4. Bạn biết cô dâu/chú rể từ đâu? <span aria-hidden="true">*</span></legend>
        <div className="relationship-grid">
          {RELATIONSHIPS.map(([value, label]) => <label className="choice-card" key={value}><input type="radio" name="relationship" value={value} checked={values.relationship === value} onChange={() => update("relationship", value)} /><span>{label}</span></label>)}
        </div>
        {values.relationship === "other" && <input value={values.relationshipOther} onChange={(event) => update("relationshipOther", event.target.value)} placeholder="Bạn biết chúng mình từ đâu?" maxLength="120" />}
        {errors.relationship && <span className="field-error">{errors.relationship}</span>}
        {errors.relationshipOther && <span className="field-error">{errors.relationshipOther}</span>}
      </fieldset>

      <div className="honeypot" aria-hidden="true"><label>Website<input tabIndex="-1" autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} /></label></div>
      <TurnstileWidget onToken={onToken} resetKey={turnstileResetKey} />
      {message && <p className="form-notice error" role="alert">{message}</p>}
      <button className="button button-primary submit-button" type="submit" disabled={status === "submitting" || (!turnstileToken && !import.meta.env.DEV)}>
        {status === "submitting" ? "Đang gửi…" : "Gửi phúc đáp"}
      </button>
      <p className="privacy-note">Thông tin chỉ được dùng để chuẩn bị tiệc cưới và không hiển thị công khai.</p>
    </form>
  );
}
