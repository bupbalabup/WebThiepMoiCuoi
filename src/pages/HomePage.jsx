import React from "react";
import wedding from "../config/wedding.json";
import AmbientPetals from "../components/AmbientPetals.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import { WaxSeal, CornerOrnament } from "../components/Ornaments.jsx";

export default function HomePage() {
  return (
    <div className="lux-home-portal">
      <AmbientPetals />
      <AudioPlayer />

      <div className="lux-portal-card">
        <CornerOrnament position="top-left" />
        <CornerOrnament position="top-right" />
        <CornerOrnament position="bottom-left" />
        <CornerOrnament position="bottom-right" />

        {/* Left Side: Wedding Portrait */}
        <div className="lux-portal-photo">
          <img
            src="/images/anhcuoi/TOM02721-800.jpg"
            alt="Ảnh cưới Tuấn Anh & Ngọc Anh"
            width="533"
            height="800"
            fetchPriority="high"
          />
        </div>

        {/* Right Side: Invitation Information & Side Selection */}
        <div className="lux-portal-content">
          <WaxSeal size={64} monogram="A & A" />

          <span className="lux-eyebrow" style={{ marginTop: "16px" }}>
            TRÂN TRỌNG BÁO HỶ &amp; KÍNH MỜI
          </span>

          <h1 className="cover-couple-title" style={{ margin: "8px 0" }}>
            <span className="hero-name-line">{wedding.couple.groom}</span>
            <span className="amp">&amp;</span>
            <span className="hero-name-line">{wedding.couple.bride}</span>
          </h1>

          <p style={{ fontSize: "0.86rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lux-muted)", margin: "0 0 16px" }}>
            {wedding.couple.groomFullName} &amp; {wedding.couple.brideFullName}
          </p>

          <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--lux-espresso)", margin: "0 0 4px" }}>
            11:00 — THỨ TƯ, 21.10.2026
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--lux-body)", margin: "0 0 20px" }}>
            {wedding.event.venueName} — {wedding.event.hall}
          </p>

          <p className="portal-prompt">
            Vui lòng chọn để xem thông tin thiệp mời:
          </p>

          <div className="portal-btn-grid">
            <a className="portal-side-btn" href="/nha-trai">
              <span className="side-role">NHÀ TRAI</span>
              <span className="side-sub">Chú rể {wedding.couple.groom}</span>
            </a>

            <a className="portal-side-btn" href="/nha-gai">
              <span className="side-role">NHÀ GÁI</span>
              <span className="side-sub">Cô dâu {wedding.couple.bride}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
