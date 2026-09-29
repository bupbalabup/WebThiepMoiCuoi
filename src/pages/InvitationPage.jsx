import React, { useState } from "react";
import wedding from "../config/wedding.json";
import { buildRsvpUrl, SIDE_CONFIG } from "../lib/routes.js";
import useInvitation from "../hooks/useInvitation.js";
import Modal from "../components/Modal.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import GiftDialog from "../components/GiftDialog.jsx";
import WeddingGallery from "../components/WeddingGallery.jsx";
import { InvitationError, InvitationLoading } from "../components/InvitationLoading.jsx";

export default function InvitationPage({ side, slug }) {
  const invite = useInvitation(side, slug);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const sideConfig = SIDE_CONFIG[side];
  const name = invite.invitation?.name || "Quý khách";

  if (slug && invite.status === "loading") return <InvitationLoading />;
  if (slug && invite.status === "error") return <InvitationError error={invite.error} />;

  return (
    <main className={`invitation-page side-${side}`}>
      <nav className="topbar" aria-label="Điều hướng chính">
        <a className="topbar-brand" href="/">T <span>&</span> N</a>
        <div><a href="#thong-tin">Thông tin</a><a href="#ban-do">Bản đồ</a><a href={buildRsvpUrl(side, slug)}>Phúc đáp</a></div>
      </nav>

      <section className="hero-section">
        <div className="hero-decoration" aria-hidden="true"><span className="petal p1" /><span className="petal p2" /><span className="petal p3" /></div>
        <div className="hero-copy">
          <span className="eyebrow">Trân trọng kính mời</span>
          <p className="guest-name">{name}</p>
          <p className="invite-copy">đến chung vui trong ngày hạnh phúc của</p>
          <h1><span>{wedding.couple.groom}</span><i>&</i><span>{wedding.couple.bride}</span></h1>
          <p className="hero-date"><strong>11:00</strong><span>Thứ Tư</span><strong>21.10.2026</strong></p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => setRsvpOpen(true)}>Tham dự</button>
            <button className="button button-gift" type="button" onClick={() => setGiftOpen(true)}>Gửi mừng cưới</button>
          </div>
          <p className="side-badge">Thiệp mời {sideConfig.label}</p>
        </div>
        <div className="hero-visual" aria-label="Khung ảnh cưới chính">
          {wedding.gallery.slots.find((photo) => photo.id === "hero")?.src ? (
            <img src={wedding.gallery.slots.find((photo) => photo.id === "hero").src} alt="Tuấn Anh và Ngọc Anh" fetchPriority="high" />
          ) : (
            <div className="hero-art" aria-hidden="true"><span className="art-ring ring-one" /><span className="art-ring ring-two" /><div className="art-heart">♡</div><p>Tuấn Anh<br /><small>&</small><br />Ngọc Anh</p></div>
          )}
        </div>
      </section>

      <section className="section welcome-section">
        <div className="section-heading"><span className="eyebrow">Lời ngỏ</span><h2>Chúng mình sắp về chung một nhà</h2></div>
        <p className="lead-copy">Sự hiện diện của bạn là niềm vui và là món quà ý nghĩa trong ngày đặc biệt của chúng mình. Hãy cùng lưu lại một buổi trưa thật nhiều tiếng cười và kỷ niệm đẹp.</p>
        <div className="date-ribbon"><span>Tháng 10</span><strong>21</strong><span>Năm 2026</span></div>
      </section>

      <section id="thong-tin" className="section event-section">
        <div className="section-heading"><span className="eyebrow">Wedding day</span><h2>Thông tin tiệc cưới</h2></div>
        <div className="event-grid">
          <article className="event-card"><span className="event-icon" aria-hidden="true">◷</span><h3>Thời gian</h3><strong>11:00 · 21.10.2026</strong><p>Thứ Tư</p></article>
          <article className="event-card featured"><span className="event-icon" aria-hidden="true">⌖</span><h3>Địa điểm</h3><strong>{wedding.event.venueName}</strong><p>{wedding.event.address}</p></article>
          <article className="event-card"><span className="event-icon" aria-hidden="true">♡</span><h3>Phúc đáp</h3><strong>Trước 15.10.2026</strong><p>Giúp chúng mình chuẩn bị đón tiếp bạn chu đáo hơn.</p></article>
        </div>
      </section>

      <WeddingGallery />

      <section id="ban-do" className="section map-section">
        <div className="map-copy"><span className="eyebrow">Hẹn gặp bạn tại</span><h2>{wedding.event.venueName}</h2><p>{wedding.event.address}</p><a className="button button-outline" href={wedding.event.maps.directionsUrl} target="_blank" rel="noreferrer">Mở Google Maps</a></div>
        <iframe title={`Bản đồ ${wedding.event.venueName}`} src={wedding.event.maps.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </section>

      <section className="section closing-section">
        <div><span aria-hidden="true">♡</span><h2>Hẹn gặp bạn trong ngày vui của chúng mình</h2><p>Tuấn Anh & Ngọc Anh</p></div>
        <div className="closing-actions"><button className="button button-primary" type="button" onClick={() => setRsvpOpen(true)}>Phúc đáp ngay</button><button className="button button-gift" type="button" onClick={() => setGiftOpen(true)}>Gửi mừng cưới</button></div>
      </section>

      <footer className="site-footer"><p>Tuấn Anh <span>&</span> Ngọc Anh</p><small>21 · 10 · 2026</small></footer>

      <Modal title={`Phúc đáp ${sideConfig.label}`} open={rsvpOpen} onClose={() => setRsvpOpen(false)} className="rsvp-modal">
        <RsvpForm side={side} invitedName={invite.invitation?.name || ""} invitationSlug={slug} compact />
      </Modal>
      <GiftDialog side={side} open={giftOpen} onClose={() => setGiftOpen(false)} />
    </main>
  );
}
