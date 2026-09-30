import React from "react";
import wedding from "../config/wedding.json";

export default function SaveTheDateCalendar() {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlanks = 3; // Oct 1, 2026 is Thursday (Mon, Tue, Wed are blank)

  const gcalTitle = encodeURIComponent(`Lễ thành hôn: ${wedding.couple.groom} & ${wedding.couple.bride}`);
  const gcalDetails = encodeURIComponent(
    `Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của Tuấn Anh & Ngọc Anh.\nThời gian: 11:00 ngày 21.10.2026\nĐịa điểm: ${wedding.event.venueName} - ${wedding.event.hall} - ${wedding.event.address}`
  );
  const gcalLocation = encodeURIComponent(`${wedding.event.venueName}, ${wedding.event.address}`);
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=20261021T040000Z/20261021T070000Z&details=${gcalDetails}&location=${gcalLocation}`;

  function downloadIcs() {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//TuanAnhNgocAnh//Wedding Invitation//VI",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:wedding-tuananh-ngocanh-20261021@wedding.local",
      "DTSTAMP:20260101T000000Z",
      "DTSTART:20261021T040000Z",
      "DTEND:20261021T070000Z",
      `SUMMARY:Lễ thành hôn: ${wedding.couple.groom} & ${wedding.couple.bride}`,
      `DESCRIPTION:Kính mời bạn tới dự tiệc cưới tại ${wedding.event.venueName}`,
      `LOCATION:${wedding.event.venueName}\\, ${wedding.event.address}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dam-cuoi-tuan-anh-ngoc-anh.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <section className="save-date-stationery-card">
      <div className="calendar-box">
        <span className="calendar-month-title">THÁNG 10 · 2026</span>
        <div className="calendar-table">
          <div className="calendar-row header-row">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
              <span key={day} className="cal-header-cell">{day}</span>
            ))}
          </div>

          <div className="calendar-days-grid">
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <span key={`blank-${i}`} className="cal-day-cell blank" />
            ))}

            {daysInMonth.map((day) => {
              const isWeddingDay = day === 21;
              return (
                <span
                  key={day}
                  className={`cal-day-cell ${isWeddingDay ? "is-wedding-day" : ""}`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>

        <div className="calendar-button-group">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cal-action-btn"
          >
            Thêm vào lịch Google
          </a>
          <button
            type="button"
            onClick={downloadIcs}
            className="cal-action-btn"
          >
            Tải lịch về thiết bị
          </button>
        </div>
      </div>
    </section>
  );
}
