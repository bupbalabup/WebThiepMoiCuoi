import React from "react";
import wedding from "../config/wedding.json";

export default function HomePage() {
  return (
    <main className="home-page">
      <div className="home-orb orb-one" aria-hidden="true" />
      <div className="home-orb orb-two" aria-hidden="true" />
      <section className="home-card">
        <span className="eyebrow">Save the date · 21.10.2026</span>
        <div className="home-monogram" aria-hidden="true">T<span>&</span>N</div>
        <h1><span>{wedding.couple.groom}</span><i>&</i><span>{wedding.couple.bride}</span></h1>
        <p className="home-time">11:00 · Thứ Tư, ngày 21 tháng 10 năm 2026</p>
        <div className="floral-divider" aria-hidden="true"><span />♡<span /></div>
        <h2>Bạn là khách của bên nào?</h2>
        <p className="home-note">Chọn bên mời để xem đúng thiệp và thông tin mừng cưới.</p>
        <div className="side-picker">
          <a className="side-card groom" href="/nha-trai"><span>Khách</span><strong>Nhà trai</strong><small>Thiệp của Tuấn Anh</small></a>
          <a className="side-card bride" href="/nha-gai"><span>Khách</span><strong>Nhà gái</strong><small>Thiệp của Ngọc Anh</small></a>
        </div>
      </section>
    </main>
  );
}
