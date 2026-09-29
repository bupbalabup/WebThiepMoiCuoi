import React from "react";
import wedding from "../config/wedding.json";

export default function HomePage() {
  return <main className="home-page">
    <section className="home-card">
      <p className="eyebrow">The wedding of</p>
      <div className="monogram">A <i>&</i> A</div>
      <h1>{wedding.couple.groom} <i>&</i> {wedding.couple.bride}</h1>
      <p className="home-date">21 . 10 . 2026</p>
      <div className="home-selection">
        <h2>Bạn là khách của bên nào?</h2>
        <div className="side-picker">
          <a href="/nha-trai" className="side-choice groom-choice"><span>Nhà trai</span><strong>{wedding.couple.groomFullName}</strong><small>Mở thiệp mời</small></a>
          <a href="/nha-gai" className="side-choice bride-choice"><span>Nhà gái</span><strong>{wedding.couple.brideFullName}</strong><small>Mở thiệp mời</small></a>
        </div>
      </div>
    </section>
  </main>;
}
