import React, { useCallback, useMemo, useRef, useState } from "react";
import { submitRsvp } from "../lib/api.js";
import { isRsvpClosed } from "../lib/date.js";
import TurnstileWidget from "./TurnstileWidget.jsx";

const ATTENDANCE = [
  { value: "attending", label: "Có, mình sẽ tham dự", sub: "Hẹn gặp bạn trong ngày vui" },
  { value: "considering", label: "Đang cân nhắc sắp xếp", sub: "Sẽ xác nhận trước ngày 16.10" },
  { value: "declined", label: "Tiếc quá, mình không tham gia được", sub: "Gửi lời chúc phúc từ xa" },
];

const RELATIONSHIPS = [
  { value: "family", label: "Gia đình / Người thân" },
  { value: "friend", label: "Bạn bè" },
  { value: "coworker", label: "Đồng nghiệp" },
  { value: "other", label: "Mối quan hệ khác" },
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
  if (values.relationship === "other" && !values.relationshipOther.trim()) errors.relationshipOther = "Vui lòng cho chúng tôi biết thêm thông tin.";
  return errors;
}

function createSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

export default function RsvpForm({ side, invitationSlug = null, compact = false }) {
  const submissionIdRef = useRef("");
  const [values, setValues] = useState({
    name: "",
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

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, ...(key === "attendance" ? { guestCount: undefined } : {}) }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setMessage("Vui lòng kiểm tra lại các câu trả lời được đánh dấu.");
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
      <div className="rsvp-stationery-closed">
        <span className="rsvp-watermark">PHÚC ĐÁP</span>
        <strong className="closed-title">ĐÃ KẾT THÚC THỜI GIAN PHÚC ĐÁP</strong>
        <p className="closed-desc">
          Cảm ơn bạn đã quan tâm. Xin vui lòng liên hệ trực tiếp với gia đình nếu cần thay đổi hoặc cập nhật thông tin.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rsvp-stationery-success" role="status">
        <span className="rsvp-watermark">CẢM ƠN BẠN</span>
        <strong className="success-heading">{message}</strong>
        <p className="success-paragraph">
          {values.attendance === "declined"
            ? "Cảm ơn bạn đã dành thời gian phúc đáp. Chúng mình trân trọng tình cảm của bạn và hy vọng sớm gặp lại!"
            : values.attendance === "considering"
              ? "Chúng mình đã ghi nhận bạn đang cân nhắc. Bạn hãy liên hệ hai gia đình khi chốt được lịch nhé!"
              : "Hẹn gặp bạn tại buổi tiệc vào 11:00 ngày 21.10.2026. Sự hiện diện của bạn là niềm vui của hai gia đình!"}
        </p>
        <span className="signature-couple">Tuấn Anh & Ngọc Anh</span>
      </div>
    );
  }

  return (
    <form className={`rsvp-stationery-form ${compact ? "compact" : ""}`} onSubmit={onSubmit} noValidate>
      <div className="rsvp-form-header">
        <span className="rsvp-form-kicker">MỘT LỜI HẸN CHO NGÀY VUI</span>
        <h2 className="rsvp-form-title">Hẹn gặp bạn nhé!</h2>
        <p className="rsvp-notice-text">
          Bạn dành chút thời gian để chúng tôi chuẩn bị đón tiếp thật chu đáo nhé.
        </p>
        <span className="rsvp-deadline-badge">Phúc đáp trước ngày <strong>16.10.2026</strong></span>
      </div>

      {/* Field 1: Name */}
      <div className="rsvp-field">
        <label htmlFor="rsvp-name" className="rsvp-label">
          1. Tên anh/chị/bạn là gì? <span className="req">*</span>
        </label>
        <input
          id="rsvp-name"
          type="text"
          className="rsvp-input-text"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="Nhập họ và tên..."
          autoComplete="name"
          maxLength="120"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
      </div>

      {/* Field 2: Attendance */}
      <fieldset className="rsvp-field">
        <legend className="rsvp-label">
          2. Bạn có tham dự tiệc cưới của chúng tôi không? <span className="req">*</span>
        </legend>
        <div className="rsvp-options-vertical">
          {ATTENDANCE.map((item) => (
            <label
              className={`rsvp-radio-card ${values.attendance === item.value ? "checked" : ""}`}
              key={item.value}
            >
              <input
                type="radio"
                name="attendance"
                value={item.value}
                checked={values.attendance === item.value}
                onChange={() => update("attendance", item.value)}
              />
              <div className="radio-text-col">
                <span className="option-title">{item.label}</span>
                <span className="option-sub">{item.sub}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.attendance && <span className="field-error">{errors.attendance}</span>}
      </fieldset>

      {/* Field 3: Guest count */}
      {values.attendance !== "declined" && (
        <fieldset className="rsvp-field">
          <legend className="rsvp-label">
            3. Bạn sẽ tham dự cùng bao nhiêu người (tính cả bạn nhé)? <span className="req">*</span>
          </legend>
          <div className="rsvp-options-grid-three">
            {[
              { val: "1", title: "1 người", sub: "Đi một mình" },
              { val: "2", title: "2 người", sub: "Đi cùng người thân" },
              { val: "other", title: "Số khác", sub: "Đi theo nhóm" },
            ].map((item) => (
              <label
                className={`rsvp-radio-card count-style ${values.guestChoice === item.val ? "checked" : ""}`}
                key={item.val}
              >
                <input
                  type="radio"
                  name="guest-count"
                  value={item.val}
                  checked={values.guestChoice === item.val}
                  onChange={() => update("guestChoice", item.val)}
                />
                <span className="count-number">{item.title}</span>
                <span className="count-desc">{item.sub}</span>
              </label>
            ))}
          </div>

          {values.guestChoice === "other" && (
            <div className="other-input-block">
              <label htmlFor="rsvp-guest-other" className="sub-label">Nhập tổng số người tham dự:</label>
              <input
                id="rsvp-guest-other"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                className="rsvp-input-text"
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
      <fieldset className="rsvp-field">
        <legend className="rsvp-label">
          4. Bạn biết cô dâu/chú rể từ đâu? <span className="req">*</span>
        </legend>
        <div className="rsvp-options-grid-two">
          {RELATIONSHIPS.map((item) => (
            <label
              className={`rsvp-radio-card ${values.relationship === item.value ? "checked" : ""}`}
              key={item.value}
            >
              <input
                type="radio"
                name="relationship"
                value={item.value}
                checked={values.relationship === item.value}
                onChange={() => update("relationship", item.value)}
              />
              <span className="option-title">{item.label}</span>
            </label>
          ))}
        </div>
        {values.relationship === "other" && (
          <div className="other-input-block">
            <input
              type="text"
              className="rsvp-input-text"
              aria-label="Mối quan hệ khác"
              value={values.relationshipOther}
              onChange={(event) => update("relationshipOther", event.target.value)}
              placeholder="Vui lòng cho chúng tôi biết thêm..."
              maxLength="120"
            />
          </div>
        )}
        {errors.relationship && <span className="field-error">{errors.relationship}</span>}
        {errors.relationshipOther && <span className="field-error">{errors.relationshipOther}</span>}
      </fieldset>

      {/* Honeypot for spam bots */}
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

      {message && <p className="form-notice error" role="alert">{message}</p>}

      <button
        className="button button-primary rsvp-submit-btn"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "ĐANG GỬI XÁC NHẬN..." : "GỬI PHÚC ĐÁP"}
      </button>

      <p className="rsvp-privacy-note">
        Thông tin phản hồi được dùng để gia đình chuẩn bị đón tiếp chu đáo nhất.
      </p>
    </form>
  );
}
