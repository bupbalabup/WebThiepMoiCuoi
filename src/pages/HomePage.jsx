import React from "react";
import wedding from "../config/wedding.json";
export default function HomePage() {
  return <main className="wedding-home"><section className="home-paper"><div className="home-portrait"><img src="/images/anhcuoi/TOM02721-800.jpg" alt="Ảnh cưới Tuấn Anh và Ngọc Anh" width="533" height="800" fetchPriority="high"/></div><div className="home-invitation"><span className="cover-monogram">A &amp; A</span><p className="eyebrow">TRÂN TRỌNG KÍNH MỜI</p><h1>{wedding.couple.groom}<span>&amp;</span>{wedding.couple.bride}</h1><p className="cover-date">11:00 · 21 tháng 10, 2026</p><p>{wedding.event.venueName}</p><p className="home-selection-prompt">Bạn là khách của gia đình nào?</p><div className="home-selection-buttons"><a className="button button-primary" href="/nha-trai">Khách của Nhà trai</a><a className="button button-outline" href="/nha-gai">Khách của Nhà gái</a></div></div></section></main>;
}
