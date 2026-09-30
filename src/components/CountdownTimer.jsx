import React, { useEffect, useState } from "react";

const TARGET_TIME = new Date("2026-10-21T11:00:00+07:00").getTime();

function calculateTimeLeft() {
  const difference = TARGET_TIME - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isPast: false,
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isPast) {
    return null;
  }

  const units = [
    { label: "NGÀY", value: timeLeft.days },
    { label: "GIỜ", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "PHÚT", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "GIÂY", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  return (
    <div className="countdown-stationery-wrap" aria-label="Đếm ngược đến ngày cưới">
      <span className="sub-title-caps">CÙNG ĐẾM NGƯỢC THỜI GIAN</span>
      <div className="countdown-minimal-grid">
        {units.map((unit) => (
          <div className="countdown-minimal-card" key={unit.label}>
            <span className="cd-val">{unit.value}</span>
            <span className="cd-lbl">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
