import React from "react";
import wedding from "../config/wedding.json";

export default function WeddingTimeline() {
  const schedule = wedding.event.timeline || [
    { time: "11:00", title: "Đón khách & Chụp ảnh lưu niệm" },
    { time: "11:30", title: "Nghi lễ Thành Hôn" },
    { time: "11:45", title: "Khai tiệc & Chúc mừng hạnh phúc" },
  ];

  return (
    <div className="lux-timeline-card">
      <div className="lux-timeline-header">
        <span className="lux-eyebrow">CHƯƠNG TRÌNH TIỆC CƯỚI</span>
        <h3 className="lux-card-heading">Lịch Trình Hôn Lễ</h3>
      </div>

      <div className="lux-timeline-track">
        {schedule.map((item, index) => (
          <div className="lux-timeline-item" key={item.time}>
            <div className="timeline-node">
              <span className="node-number">0{index + 1}</span>
            </div>
            <div className="timeline-info">
              <span className="timeline-hour">{item.time}</span>
              <strong className="timeline-title">{item.title}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
