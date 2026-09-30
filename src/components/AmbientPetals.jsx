import React from "react";

// Pre-calculated organic positions and timings for smooth falling ambient petals
const PETAL_ITEMS = [
  { left: "8%", size: 18, sway: "18px", dur: "22s", delay: "-4s", color: "#bda182" },
  { left: "18%", size: 14, sway: "-14px", dur: "25s", delay: "-12s", color: "#9a836d" },
  { left: "28%", size: 20, sway: "22px", dur: "20s", delay: "-8s", color: "#cbb399" },
  { left: "38%", size: 16, sway: "-18px", dur: "24s", delay: "-16s", color: "#8b7460" },
  { left: "52%", size: 19, sway: "15px", dur: "23s", delay: "-2s", color: "#bca082" },
  { left: "64%", size: 15, sway: "-20px", dur: "26s", delay: "-10s", color: "#9c8570" },
  { left: "75%", size: 21, sway: "24px", dur: "21s", delay: "-14s", color: "#c5ad93" },
  { left: "84%", size: 17, sway: "-16px", dur: "24s", delay: "-6s", color: "#8d7663" },
  { left: "92%", size: 15, sway: "19px", dur: "23s", delay: "-18s", color: "#bfa487" },
];

export default function AmbientPetals() {
  return (
    <div className="ambient-petals-layer" aria-hidden="true">
      {PETAL_ITEMS.map((item, idx) => (
        <span
          key={idx}
          className="ambient-petal"
          style={{
            left: item.left,
            width: `${item.size}px`,
            height: `${item.size * 1.25}px`,
            color: item.color,
            "--sway": item.sway,
            animationDuration: item.dur,
            animationDelay: item.delay,
          }}
        >
          <svg viewBox="0 0 24 30" fill="currentColor">
            <path d="M12 0C7 6 0 14 0 21c0 5 5 9 12 9s12-4 12-9C24 14 17 6 12 0zm0 26c-4.5 0-8-2.5-8-6 0-4.5 5-11 8-15 3 4 8 10.5 8 15 0 3.5-3.5 6-8 6z" opacity="0.32" />
            <path d="M12 2C8 7 3 14 3 20c0 4 4 7 9 7s9-3 9-7C21 14 16 7 12 2z" opacity="0.55" />
          </svg>
        </span>
      ))}
    </div>
  );
}
