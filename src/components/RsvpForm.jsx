import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { submitRsvp } from "../lib/api.js";
import { isRsvpClosed } from "../lib/date.js";
import TurnstileWidget from "./TurnstileWidget.jsx";

const ATTENDANCE = [
  { value: "attending", label: "Có mình sẽ tham gia", desc: "Hẹn gặp bạn trong ngày vui!" },
  { value: "considering", label: "Mình đang cân nhắc", desc: "Sẽ báo lại trước ngày 15.10" },
  { value: "declined", label: "Tiếc quá mình không tham gia được rồi", desc: "Gửi lời chúc phúc từ xa" },
];

const RELATIONSHIPS = [
  { value: "family", label: "Gia đình / Người thân" },
  { value: "friend", label: "Bạn bè" },
  { value: "coworker", label: "Đồng nghiệp" },
  { value: "mutual_friend", label: "Bạn chung của cả hai" },
  { value: "other", label: "Mục khác" },
];

function validate(values) {
  const errors = {};
  const name = values.name.trim().replace(/\s+/g, " ");
  if (!name) errors.name = "Vui lòng nhập tên của bạn.";
  else if (name.length > 120) errors.name = "Tên không được dài quá 120 ký tự.";
  if (!ATTENDANCE.some((item) => item.value === values.attendance)) errors.attendance = "Vui lòng chọn một phương án tham dự.";
  if (values.attendance && values.attendance !== "declined") {
    const count = values.guestChoice === "other" ? Number(values.guestOther) : Number(values.guestChoice);
    if (!Number.isSafeInteger(count) || count < 1) errors.guestCount = "Vui lòng nhập số người từ 1 trở lên.";
  }
  if (!RELATIONSHIPS.some((item) => item.value === values.relationship)) errors.relationship = "Vui lòng chọn một phương án.";
  if (values.relationship === "other" && !values.relationshipOther.trim()) errors.relationshipOther = "Vui lòng cho chúng mình biết thêm thông tin.";
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
    if (status === "submitting") return;
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setMessage("Vui lòng kiểm tra lại các câu trả lời được đánh dấu bên dưới.");
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
    return (
      <div className="closed-card">
        <strong>Đã kết thúc thời gian nhận phúc đáp</strong>
        <p>Cảm ơn tình cảm của bạn. Nếu cần thay đổi hoặc thông báo gấp, xin vui lòng liên hệ trực tiếp cùng cô dâu, chú rể hoặc gia đình.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="success-card" role="status">
        <strong className="success-title">{message}</strong>
        <p className="success-desc">
          Chúng mình đã nhận được câu trả lời của bạn và sẽ chuẩn bị theo thông tin đã gửi.
        </p>
        <div className="success-ribbon">
          <span>Tuấn Anh & Ngọc Anh trân trọng cảm ơn!</span>
        </div>
      </div>
    );
  }

  return (
    <form className={`rsvp-form ${compact ? "compact" : ""}`} onSubmit={onSubmit} noValidate>
      <div className="deadline-banner">
        <p>Vui lòng gửi phúc đáp chậm nhất ngày <strong>15.10.2026</strong> để chúng mình chu đáo đón tiếp bạn nhé!</p>
      </div>

      {/* Field 1: Name */}
      <div className="form-field">
        <label htmlFor="rsvp-name" className="field-label">
          <span className="field-num">1</span>
          <span>Tên anh/chị/bạn là gì? <strong className="req-star">*</strong></span>
        </label>
        <div className="input-wrap">
          <input
            id="rsvp-name"
            type="text"
            className="input-text"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Ví dụ: Nguyễn Văn A"
            autoComplete="name"
            maxLength="120"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </div>
        {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
      </div>

      {/* Field 2: Attendance */}
      <fieldset className="form-field choice-group">
        <legend className="field-label">
          <span className="field-num">2</span>
          <span>Bạn có tham dự tiệc cưới của chúng mình không? <strong className="req-star">*</strong></span>
        </legend>
        <div className="choices-stack">
          {ATTENDANCE.map((item) => (
            <label
              className={`choice-card ${values.attendance === item.value ? "is-selected" : ""}`}
              key={item.value}
            >
              <input
                type="radio"
                name="attendance"
                value={item.value}
                checked={values.attendance === item.value}
                onChange={() => update("attendance", item.value)}
              />
              <div className="choice-text">
                <span className="choice-main">{item.label}</span>
                <span className="choice-hint">{item.desc}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.attendance && <span className="field-error">{errors.attendance}</span>}
      </fieldset>

      {/* Field 3: Guest count */}
      {values.attendance !== "declined" && (
        <fieldset className="form-field choice-group">
          <legend className="field-label">
            <span className="field-num">3</span>
            <span>Bạn sẽ tham dự cùng bao nhiêu người (tính cả bạn nhé)? <strong className="req-star">*</strong></span>
          </legend>
          <div className="count-choices-grid">
            {[
              { val: "1", title: "1 người", sub: "Đi một mình" },
              { val: "2", title: "2 người", sub: "Tính cả bạn" },
              { val: "other", title: "Mục khác", sub: "Đi theo nhóm" },
            ].map((item) => (
              <label
                className={`choice-card count-card ${values.guestChoice === item.val ? "is-selected" : ""}`}
                key={item.val}
              >
                <input
                  type="radio"
                  name="guest-count"
                  value={item.val}
                  checked={values.guestChoice === item.val}
                  onChange={() => update("guestChoice", item.val)}
                />
                <span className="count-title">{item.title}</span>
                <span className="count-sub">{item.sub}</span>
              </label>
            ))}
          </div>

          {values.guestChoice === "other" && (
            <div className="other-count-input-wrap">
              <label htmlFor="rsvp-guest-other" className="subfield-label">Nhập tổng số người tham dự:</label>
              <input
                id="rsvp-guest-other"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                className="input-text"
                value={values.guestOther}
                onChange={(event) => update("guestOther", event.target.value)}
                placeholder="Ví dụ: 3"
                aria-label="Tổng số người tham dự"
              />
            </div>
          )}
          {errors.guestCount && <span className="field-error">{errors.guestCount}</span>}
        </fieldset>
      )}

      {/* Field 4: Relationship */}
      <fieldset className="form-field choice-group">
        <legend className="field-label">
          <span className="field-num">4</span>
          <span>Bạn biết cô dâu / chú rể từ đâu? <strong className="req-star">*</strong></span>
        </legend>
        <div className="relationship-modern-grid">
          {RELATIONSHIPS.map((item) => (
            <label
              className={`choice-card rel-card ${values.relationship === item.value ? "is-selected" : ""}`}
              key={item.value}
            >
              <input
                type="radio"
                name="relationship"
                value={item.value}
                checked={values.relationship === item.value}
                onChange={() => update("relationship", item.value)}
              />
              <span className="choice-main">{item.label}</span>
            </label>
          ))}
        </div>
        {values.relationship === "other" && (
          <div className="other-rel-input-wrap">
            <input
              type="text"
              className="input-text"
              value={values.relationshipOther}
              aria-label="Mối quan hệ khác" onChange={(event) => update("relationshipOther", event.target.value)}
              placeholder="Vui lòng cho chúng mình biết mối quan hệ..."
              maxLength="120"
            />
          </div>
        )}
        {errors.relationship && <span className="field-error">{errors.relationship}</span>}
        {errors.relationshipOther && <span className="field-error">{errors.relationshipOther}</span>}
      </fieldset>

      {/* Honeypot for spam bot detection */}
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input
            tabIndex="-1"
            autoComplete="off"
            value={values.website}
            onChange={(event) => update("website", event.target.value)}
          />
        </label>
      </div>

      {/* Turnstile captcha widget */}
      <TurnstileWidget onToken={onToken} resetKey={turnstileResetKey} />

      {message && <p className="form-notice error" role="alert">{message}</p>}

      <button
        className="button button-primary submit-button"
        type="submit"
        disabled={status === "submitting" || (!turnstileToken && !import.meta.env.DEV)}
      >
        {status === "submitting" ? (
          <span className="btn-loading-wrap">
            Đang gửi xác nhận…
          </span>
        ) : (
          <span>Gửi phúc đáp</span>
        )}
      </button>

      <p className="privacy-note">
        Thông tin chỉ dùng để chuẩn bị tiệc cưới và không hiển thị công khai.
      </p>
    </form>
  );
}
