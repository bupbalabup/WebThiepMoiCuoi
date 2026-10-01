import React from "react";
import { calendarEvent, googleCalendarLink } from "../lib/calendar.js";
import wedding from "../config/wedding.json";

export default function SaveTheDateCalendar() {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const leadingBlanks = 3; // Oct 1, 2026 is Thursday (Mon, Tue, Wed are blank)

  const googleCalendarUrl = googleCalendarLink(calendarEvent(wedding));
  const calendarPath = "/dam-cuoi-tuan-anh-ngoc-anh.ics";
  const appleCalendarUrl = `webcal://${window.location.host}${calendarPath}`;

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
              // Vietnamese lunar dates for October 2026: 10/10 is 01/09.
              const lunarDay = day < 10 ? day + 20 : day - 9;
              const lunarMonth = day < 10 ? 8 : 9;
              return (
                <span
                  key={day}
                  className={`cal-day-cell ${isWeddingDay ? "is-wedding-day" : ""}`}
                  aria-label={`${day} tháng 10, âm lịch ${lunarDay} tháng ${lunarMonth}${isWeddingDay ? ", ngày cưới" : ""}`}
                >
                  {isWeddingDay && <svg className="calendar-heart" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 59C23 50 3 37 3 20C3 2 25 -1 32 13C39 -1 61 2 61 20C61 37 41 50 32 59Z" /></svg>}
                  <span className="cal-solar-day">{day}</span>
                  <span className="cal-lunar-day">{lunarDay === 1 || day === 1 ? `${lunarDay}/${lunarMonth}` : lunarDay}</span>
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
            Google Calendar
          </a>
          <a href={appleCalendarUrl} className="cal-action-btn">Apple Calendar</a>
        </div>
      </div>
    </section>
  );
}
