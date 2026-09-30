import React, { useState } from "react";
import wedding from "../config/wedding.json";
import { SIDE_CONFIG } from "../lib/routes.js";
import useInvitation from "../hooks/useInvitation.js";
import Modal from "../components/Modal.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import GiftDialog from "../components/GiftDialog.jsx";
import WeddingGallery from "../components/WeddingGallery.jsx";
import WishForm from "../components/WishForm.jsx";
import { InvitationError, InvitationLoading } from "../components/InvitationLoading.jsx";
import SaveTheDateCalendar from "../components/SaveTheDateCalendar.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";
import FamilyCeremony from "../components/FamilyCeremony.jsx";

export default function InvitationPage({ side, slug }) {
  const invite = useInvitation(side, slug);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const first = side === "groom" ? wedding.couple.groom : wedding.couple.bride;
  const second = side === "groom" ? wedding.couple.bride : wedding.couple.groom;
  const guestName = invite.invitation?.name || "Quý khách";
  if (slug && invite.status === "loading") return <InvitationLoading />;
  if (slug && invite.status === "error") return <InvitationError error={invite.error} />;
  return <main className="minimal-wedding">
    {!opened && <div className="invitation-cover" role="dialog" aria-modal="true" aria-label="Mở thiệp cưới"><section className="cover-paper"><span className="cover-monogram">A &amp; A</span><p className="eyebrow">TRÂN TRỌNG KÍNH MỜI</p><h1>{first}<span>&amp;</span>{second}</h1><p className="cover-date">21 tháng 10, 2026</p><p className="cover-guest">{guestName}</p><button autoFocus className="button button-primary" onClick={()=>setOpened(true)}>Mở thiệp</button></section></div>}
    <div inert={!opened ? true : undefined}>
    <nav className="wedding-nav" aria-label="Điều hướng thiệp"><a href="/" className="nav-monogram">A &amp; A</a><div><a href="#thong-tin">Lễ cưới</a><a href="#anh-cuoi">Album</a><a href="#dia-diem">Địa điểm</a><a href="#loi-chuc">Lời chúc</a><button onClick={()=>setRsvpOpen(true)}>Phúc đáp</button></div></nav>
    <div className="wedding-canvas">
      <header className="wedding-hero" id="dau-trang"><p className="eyebrow">NGÀY CHÚNG MÌNH CHUNG ĐÔI</p><h1>{first}<span>&amp;</span>{second}</h1><p className="hero-date">21 . 10 . 2026</p><figure className="hero-photo"><img src="/images/anhcuoi/TOM01971-1600.jpg" srcSet="/images/anhcuoi/TOM01971-800.jpg 800w, /images/anhcuoi/TOM01971-1600.jpg 1600w" sizes="(max-width: 600px) 88vw, 580px" alt="Tuấn Anh và Ngọc Anh trong ngày chụp ảnh cưới" width="1066" height="1600" fetchPriority="high"/><figcaption>Hạnh phúc là cùng nhau đi qua những ngày bình thường.</figcaption></figure></header>
      <section className="paper-section ceremony-section" id="thong-tin"><p className="eyebrow">THÔNG TIN LỄ CƯỚI</p><FamilyCeremony side={side}/><p className="ceremony-announcement">Trân trọng kính mời <strong>{guestName}</strong><br/>đến chung vui trong {side === "groom" ? "lễ thành hôn" : "lễ vu quy"} của</p><h2 className="couple-full-names">{side === "groom" ? wedding.couple.groomFullName : wedding.couple.brideFullName}<span>&amp;</span>{side === "groom" ? wedding.couple.brideFullName : wedding.couple.groomFullName}</h2><p>Sự hiện diện của bạn là niềm vui và vinh hạnh của hai gia đình.</p></section>
      <div id="anh-cuoi"><WeddingGallery/></div>
      <section className="paper-section reception-section" id="tiec-cuoi"><p className="eyebrow">HẸN GẶP BẠN TRONG NGÀY VUI</p><h2>Thông tin tiệc cưới</h2><div className="reception-date"><strong>11:00</strong><p>THỨ TƯ</p><span>21</span><p>THÁNG 10 · 2026</p><small>Tức ngày 12 tháng 09 năm Bính Ngọ</small></div><h3>{wedding.event.venueName}</h3><p>{wedding.event.hall}</p><p>{wedding.event.address}</p><div className="wedding-timeline">{wedding.event.timeline.map(item=><div key={item.time}><strong>{item.time}</strong><span>{item.title}</span></div>)}</div><SaveTheDateCalendar/><button className="button button-primary" onClick={()=>setRsvpOpen(true)}>Xác nhận tham dự</button><p className="deadline-note">Vui lòng phúc đáp trước hết ngày 15.10.2026</p></section>
      <section className="paper-section location-section" id="dia-diem"><p className="eyebrow">NƠI NIỀM VUI GẶP GỠ</p><h2>Địa điểm tiệc cưới</h2><h3>{wedding.event.venueName}</h3><p>{wedding.event.address}</p><div className="wedding-map"><iframe title="Bản đồ Trống Đồng Palace tại Hancorp Plaza" src={wedding.event.maps.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/></div><a className="button button-outline" href={wedding.event.maps.directionsUrl} target="_blank" rel="noopener noreferrer">Chỉ đường trên Google Maps</a></section>
      <section className="wedding-countdown"><p className="eyebrow">CÙNG ĐẾM NGÀY HẠNH PHÚC</p><CountdownTimer/></section>
      <WishForm side={side} invitedName={invite.invitation?.name || ""} invitationSlug={slug}/>
      <section className="paper-section wedding-gift"><p className="eyebrow">MỘT CHÚT YÊU THƯƠNG</p><h2>Gửi mừng cưới</h2><p>Sự có mặt và những lời chúc của bạn là món quà quý giá nhất với chúng mình.</p><button className="button button-primary" onClick={()=>setGiftOpen(true)}>Mở hộp mừng cưới</button></section>
      <footer className="wedding-closing"><img src="/images/anhcuoi/TOM02608-800.jpg" alt="Tuấn Anh và Ngọc Anh cùng mỉm cười" loading="lazy" width="800" height="533"/><h2>Cảm ơn bạn!</h2><p>Hẹn gặp bạn trong ngày chúng mình chung đôi.</p><span>Tuấn Anh &amp; Ngọc Anh</span></footer>
    </div>
    <div className="wedding-mobile-actions"><button onClick={()=>setRsvpOpen(true)}>Phúc đáp</button><a href="#loi-chuc">Gửi lời chúc</a><button onClick={()=>setGiftOpen(true)}>Mừng cưới</button></div>
    </div>
    <Modal title={`Phúc đáp · ${SIDE_CONFIG[side].label}`} open={rsvpOpen} onClose={()=>setRsvpOpen(false)} className="rsvp-modal"><RsvpForm side={side} invitedName={invite.invitation?.name || ""} invitationSlug={slug} compact/></Modal>
    <GiftDialog side={side} open={giftOpen} onClose={()=>setGiftOpen(false)}/>
  </main>;
}
