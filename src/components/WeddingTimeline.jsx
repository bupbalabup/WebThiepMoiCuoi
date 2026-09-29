import React from "react";
import wedding from "../config/wedding.json";

export default function WeddingTimeline({ side }) {
  return <section id="lich-trinh" className="section timeline-section">
    <div className="section-heading"><p className="eyebrow">Ngày chung đôi</p><h2>Lịch trình tiệc cưới</h2></div>
    <ol className="timeline">{wedding.event.timeline.map(step => <li key={step.time}><time>{step.time}</time><h3>{step.title}</h3></li>)}</ol>
    {side === "groom" && <div className="home-ceremony"><div><p className="eyebrow">Lễ thành hôn tại tư gia nhà trai</p><strong>{wedding.event.homeCeremony.time} · 21.10.2026</strong></div><p>{wedding.event.homeCeremony.address}<br /><span>{wedding.event.homeCeremony.lunarDate}</span></p></div>}
  </section>;
}
