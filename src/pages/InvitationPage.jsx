import React, { useState } from "react";
import wedding from "../config/wedding.json";
import { buildRsvpUrl } from "../lib/routes.js";
import useInvitation from "../hooks/useInvitation.js";
import Modal from "../components/Modal.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import GiftDialog from "../components/GiftDialog.jsx";
import WeddingGallery from "../components/WeddingGallery.jsx";
import WeddingTimeline from "../components/WeddingTimeline.jsx";
import { InvitationError, InvitationLoading } from "../components/InvitationLoading.jsx";

export default function InvitationPage({ side, slug }) {
  const invite = useInvitation(side, slug);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const guestName = invite.invitation?.name || "Quý khách";
  const brideFirst = side === "bride";
  const names = brideFirst ? [wedding.couple.bride, wedding.couple.groom] : [wedding.couple.groom, wedding.couple.bride];
  const families = brideFirst ? [wedding.families.bride, wedding.families.groom] : [wedding.families.groom, wedding.families.bride];
  const hero = wedding.gallery.slots.find(photo => photo.id === "hero" && photo.src);
  if (slug && invite.status === "loading") return <InvitationLoading />;
  if (slug && invite.status === "error") return <InvitationError error={invite.error} />;
  return <main className={`invitation-page side-${side}`}>
    <nav className="topbar" aria-label="Điều hướng chính">
      <a className="topbar-brand" href="/" aria-label="A & A — Trang chủ">A <i>&</i> A</a>
      <div className="topbar-links"><a href="#lich-trinh">Lịch trình</a><a href="#dia-diem">Địa điểm</a><a href={buildRsvpUrl(side, slug)}>Phúc đáp</a></div>
    </nav>
    <section className={`invitation-hero ${hero ? "with-photo" : ""}`}>
      <div className="invitation-paper">
        <p className="eyebrow">Trân trọng kính mời</p>
        <p className="guest-name">{guestName}</p>
        <p className="invitation-intro">Tới dự tiệc mừng {brideFirst ? "Lễ Vu Quy" : "Lễ Thành Hôn"}<br />cùng gia đình chúng tôi</p>
        <h1 className="couple-names"><span>{names[0]}</span><i>&</i><span>{names[1]}</span></h1>
        <p className="wedding-date">21 <span>/</span> 10 <span>/</span> 2026</p>
        <p className="hero-time">Thứ Tư, lúc 11:00</p>
        <div className="hero-venue"><strong>{wedding.event.venueName}</strong><p>{wedding.event.hall}</p><p>{wedding.event.address}</p></div>
        <div className="hero-actions"><button className="button button-primary" onClick={() => setRsvpOpen(true)}>Tham dự</button><button className="button button-outline" onClick={() => setGiftOpen(true)}>Gửi mừng cưới</button></div>
      </div>
      {hero && <div className="hero-photo"><img src={hero.src} alt="Ảnh cưới Tuấn Anh và Ngọc Anh" fetchPriority="high" /></div>}
    </section>
    <section className="section family-section" aria-label="Hai gia đình">
      <div className="families">{families.map(family => <div key={family.label}><p className="eyebrow">{family.label}</p><p>{family.father}</p><p>{family.mother}</p></div>)}</div>
      <blockquote>Trong vô vàn món quà,<br />thương nhau chân thành là món quà quý giá nhất.<br />Và trong vô vàn hạnh phúc,<br />được hiểu nhau, bên nhau là hạnh phúc nhất.</blockquote>
    </section>
    <WeddingTimeline side={side} />
    <WeddingGallery />
    <section id="dia-diem" className="section venue-section">
      <div className="venue-copy"><p className="eyebrow">Hẹn gặp bạn tại</p><h2>{wedding.event.venueName}</h2><p className="hall-name">{wedding.event.hall}</p><p>{wedding.event.address}</p><a className="button button-outline" href={wedding.event.maps.directionsUrl} target="_blank" rel="noreferrer">Mở Google Maps</a></div>
      <iframe title={`Bản đồ ${wedding.event.venueName}`} src={wedding.event.maps.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    </section>
    <footer className="site-footer"><p className="footer-thanks">Trân trọng cảm ơn</p><p>Những lời chúc tốt đẹp nhất của Quý vị sẽ là món quà vô cùng quý giá<br />đối với hai gia đình chúng tôi trong ngày trọng đại này.</p></footer>
    <Modal title="Phúc đáp" open={rsvpOpen} onClose={() => setRsvpOpen(false)} className="rsvp-modal"><RsvpForm side={side} invitedName={invite.invitation?.name || ""} invitationSlug={slug} compact /></Modal>
    <GiftDialog side={side} open={giftOpen} onClose={() => setGiftOpen(false)} />
  </main>;
}
