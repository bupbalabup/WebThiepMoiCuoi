import React, { useEffect, useState } from "react";

import wedding from "../config/wedding.json";

const TARGET_TIME = new Date(wedding.event.startsAt).getTime();

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

export default function CountdownTimer({ title = "CÙNG ĐẾM NGƯỢC THỜI GIAN" }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isPast) {
    return <p className="countdown-started">Ngày hạnh phúc của chúng tôi đã đến!</p>;
  }

  const units = [
    { label: "NGÀY", value: timeLeft.days },
    { label: "GIỜ", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "PHÚT", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "GIÂY", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  return (
    <div className="lux-countdown-wrapper" aria-label="Đếm ngược đến ngày cưới">
      {title && <span className="lux-eyebrow">{title}</span>}
      <div className="lux-countdown-grid">
        {units.map((unit) => (
          <div className="lux-countdown-unit" key={unit.label}>
            <span className="unit-number">{unit.value}</span>
            <span className="unit-label">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
