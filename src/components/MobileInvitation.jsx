import React from "react";
import { WeddingMonogram } from "./Ornaments.jsx";
import photos from "../config/photos.json";
import wedding from "../config/wedding.json";
import SaveTheDateCalendar from "./SaveTheDateCalendar.jsx";
import WeddingGallery from "./WeddingGallery.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import WishForm from "./WishForm.jsx";
import "../styles/mobile-invitation.css";

const embrace = photos.calendar;


export function MobileEnvelope({ first, second, guestName, onOpen }) {
  return <div className="mobile-envelope-screen">
    <p className="mi-kicker">TRÂN TRỌNG KÍNH MỜI</p>
    <h1 className="mi-script">{guestName}</h1>
    <button autoFocus type="button" className="mi-envelope" onClick={onOpen} aria-label="Mở thiệp mời">
      <span className="mi-envelope-letter">Save the date<br />21.10.2026</span>
      <span className="mi-envelope-fold" />
      <span className="mi-envelope-flap" />
      <span className="mi-envelope-seal"><WeddingMonogram size={72} /></span>
    </button>
    <p className="mi-open-hint">Chạm vào phong bì để mở thiệp</p>
    <div className="mi-envelope-signature"><p className="mi-script">{first} &amp; {second}</p><p>21 · 10 · 2026</p></div>
  </div>;
}

export default function MobileInvitation({ side, guestName, invitedName, slug, onRsvp, onGift }) {
  const first = side === "groom" ? wedding.couple.groom : wedding.couple.bride;
  const second = side === "groom" ? wedding.couple.bride : wedding.couple.groom;
  const sideOrder = side === "groom" ? ["groom", "bride"] : ["bride", "groom"];
  return <div className="mobile-invitation">
    <section className="mi-hero" id="dau-trang" aria-label="Thiệp cưới Tuấn Anh và Ngọc Anh">
      <picture className="mi-hero-picture"><source media="(min-width: 768px)" srcSet={photos.heroDesktop} /><img src={photos.heroMobile} alt={`${first} và ${second} trong ngày cưới`} fetchPriority="high" /></picture>
      <div className="mi-hero-copy"><p className="mi-script mi-wedding">Wedding</p><h1><span className="mi-first-name">{wedding.couple.groom.split(" ").map((word, i) => <span key={i}>{word}{" "}</span>)}</span><i>&amp;</i><span className="mi-second-name">{wedding.couple.bride.split(" ").map((word, i) => <span key={i}>{word}{" "}</span>)}</span></h1><p className="mi-hero-date">21 . 10 . 2026</p></div>
    </section>

    <section className="mi-section mi-date" aria-label="Lịch ngày cưới">
      <div className="mi-date-grid"><figure className="mi-polaroid"><img src={embrace} alt="Save the date" loading="lazy" /><figcaption className="mi-script">Save the date</figcaption></figure><SaveTheDateCalendar /></div>
      <p className="mi-lunar-note">11:00 · Thứ Tư, ngày 21 tháng 10 năm 2026<br />Tức ngày 12 tháng 9 năm Bính Ngọ</p>
    </section>

    <section className="mi-section mi-families" id="le-cuoi">
      <div className="mi-family-paper"><div className="mi-double-happiness"><svg viewBox="0 0 160 120" role="img" aria-label="Song hỉ" fill="none" stroke="currentColor" strokeWidth="6"><g id="happiness-left"><path d="M12 18H72M42 7V30M17 32H67M17 67H67M23 59L28 67M61 59L56 67"/><path d="M22 43H62V55H22ZM19 81H65V105H19Z"/></g><g transform="translate(76 0)"><path d="M12 18H72M42 7V30M17 32H67M17 67H67M23 59L28 67M61 59L56 67"/><path d="M22 43H62V55H22ZM19 81H65V105H19Z"/></g></svg></div>
      <div className="mi-family-grid">{sideOrder.map(key => <div key={key}><h2 className="mi-script">{wedding.families[key].label}</h2><p>{wedding.families[key].father}</p><p>{wedding.families[key].mother}</p></div>)}</div></div>
      <p className="mi-kicker">TRÂN TRỌNG KÍNH MỜI</p><h2 className="mi-script mi-guest">{guestName}</h2><p>Đến dự tiệc chung vui cùng gia đình chúng tôi.</p>
    </section>

    <section className="mi-couple" aria-label="Cô dâu và chú rể">
      <div className="mi-couple-cards">{sideOrder.map(key => <figure className={`mi-person mi-person-${key}`} key={key}><div className="mi-person-crop"><img src={photos[key]} alt={key === "bride" ? "Cô dâu Ngọc Anh" : "Chú rể Tuấn Anh"} loading="lazy" /></div><figcaption><span className="mi-script">{key === "bride" ? "Cô dâu" : "Chú rể"}</span><strong>{wedding.couple[key]}</strong></figcaption></figure>)}</div>
    </section>

    <section className="mi-section mi-events" id="dia-diem">
      <h2 className="mi-script mi-heading">Sự kiện cưới</h2>
      <article className="mi-event-card"><img className="mi-event-photo" src={embrace} alt="Tuấn Anh và Ngọc Anh" loading="lazy" /><div className="mi-event-body"><h3>LỄ THÀNH HÔN</h3><p>11:00 · THỨ TƯ</p><div className="mi-event-date"><span>THÁNG 10</span><strong>21</strong><span>NĂM 2026</span></div><p className="mi-event-lunar">Ngày 12 tháng 9 năm Bính Ngọ</p><h4>{wedding.event.venueName}</h4><p>{wedding.event.hall}</p><p>{wedding.event.address}</p><a className="mi-pill" href={wedding.event.maps.directionsUrl} target="_blank" rel="noopener noreferrer">XEM CHỈ ĐƯỜNG</a><details className="mi-map"><summary>Xem bản đồ địa điểm</summary><iframe title="Bản đồ Trống Đồng Palace" src={wedding.event.maps.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></details></div></article>
    </section>

    <section className="mi-section mi-schedule" id="lich-trinh"><h2 className="mi-script mi-heading">Lịch trình</h2><ol>{wedding.event.timeline.map(item => <li key={item.time}><time>{item.time}</time><strong>{item.title}</strong></li>)}</ol><div className="mi-rsvp"><button type="button" className="mi-pill" onClick={onRsvp}>XÁC NHẬN THAM DỰ</button><p>Vui lòng phản hồi trước hết ngày 15.10.2026</p></div></section>

    <section className="mi-section mi-album" id="album-anh"><WeddingGallery /></section>

    <section className="mi-section mi-wishes" id="so-luu-but"><h2 className="mi-script mi-heading">Gửi Lời Chúc</h2><p>Những lời nhắn yêu thương và sự hiện diện của bạn là món quà quý giá với chúng tôi.</p><div className="mi-form-paper"><WishForm side={side} invitedName={invitedName} invitationSlug={slug} hideHeader /></div></section>

    <section className="mi-section mi-gifts" id="mung-cuoi"><h2 className="mi-script mi-heading">Hộp Mừng Cưới</h2><p>Cảm ơn những yêu thương<br />bạn dành cho chúng tôi.</p><button type="button" className="mi-gift-envelope" onClick={onGift}><span className="mi-gift-monogram"><WeddingMonogram size={90} /></span><span className="mi-pill">Chạm để mở</span></button></section>

    <section className="mi-countdown" id="dem-nguoc" aria-labelledby="countdown-heading">
      <img className="mi-countdown-photo" src={photos.countdown} alt="Tuấn Anh và Ngọc Anh cùng đón ngày cưới" loading="lazy" />
      <div className="mi-countdown-content">
        <h2 className="mi-script" id="countdown-heading">Đếm ngược<br />đến ngày cưới</h2>
        <CountdownTimer title="" />
        <p className="mi-countdown-date">11:00 · Thứ Tư<br />Ngày 21 tháng 10 năm 2026</p>
        <p className="mi-countdown-zone">Giờ Việt Nam</p>
      </div>
    </section>
    <footer className="mi-section mi-thanks"><h2 className="mi-script">Lời cảm ơn</h2><p className="mi-thanks-names">{wedding.couple.bride} &amp; {wedding.couple.groom}</p><p>Cảm ơn bạn đã yêu thương và chúc phúc.<br />Hẹn gặp bạn trong ngày vui của gia đình chúng tôi!</p><p className="mi-kicker">21 · 10 · 2026</p></footer>
  </div>;
}
