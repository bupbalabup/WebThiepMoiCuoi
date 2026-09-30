import React, { useCallback, useEffect, useRef, useState } from "react";
import wedding from "../config/wedding.json";
import { SIDE_CONFIG } from "../lib/routes.js";
import useInvitation from "../hooks/useInvitation.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import Modal from "../components/Modal.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import GiftDialog from "../components/GiftDialog.jsx";
import WeddingGallery from "../components/WeddingGallery.jsx";
import WeddingTimeline from "../components/WeddingTimeline.jsx";
import WishForm from "../components/WishForm.jsx";
import SaveTheDateCalendar from "../components/SaveTheDateCalendar.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import AmbientPetals from "../components/AmbientPetals.jsx";
import { WaxSeal, CornerOrnament, SectionDivider } from "../components/Ornaments.jsx";
import { InvitationError, InvitationLoading } from "../components/InvitationLoading.jsx";

export default function InvitationPage({ side, slug }) {
  const invite = useInvitation(side, slug);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [coverOpening, setCoverOpening] = useState(false);
  const [musicTrigger, setMusicTrigger] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const canvasRef = useScrollReveal({ ready: !slug || invite.status === "success" });
  const navRef = useRef(null);

  const isGroom = side === "groom";
  const first = isGroom ? wedding.couple.groom : wedding.couple.bride;
  const second = isGroom ? wedding.couple.bride : wedding.couple.groom;
  const firstFull = isGroom ? wedding.couple.groomFullName : wedding.couple.brideFullName;
  const secondFull = isGroom ? wedding.couple.brideFullName : wedding.couple.groomFullName;
  const guestName = invite.invitation?.name || "Quý khách";
  const ceremonyTitle = isGroom ? "LỄ THÀNH HÔN" : "LỄ VU QUY";

  // Open envelope / cover
  const handleOpen = useCallback(() => {
    if (coverOpening) return;
    setCoverOpening(true);
    setMusicTrigger(true);
    setTimeout(() => {
      setOpened(true);
    }, 850);
  }, [coverOpening]);

  // Navbar scroll shadow
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    function handleScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 15);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [opened]);

  // Copy full venue address
  function copyAddress() {
    const fullAddr = `${wedding.event.venueName}, ${wedding.event.hall}, ${wedding.event.address}`;
    navigator.clipboard.writeText(fullAddr).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2400);
    }).catch(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2400);
    });
  }

  if (slug && invite.status === "loading") return <InvitationLoading />;
  if (slug && invite.status === "error") return <InvitationError error={invite.error} />;

  return (
    <div className={`lux-wedding-suite side-${side}`}>
      {/* Ambient Romantic Falling Leaves/Petals */}
      <AmbientPetals />

      {/* Floating Audio Player */}
      <AudioPlayer autoPlayTrigger={musicTrigger} />

      {/* Cinematic Wax Seal Envelope Intro Screen */}
      {!opened && (
        <div
          className={`lux-cover-overlay ${coverOpening ? "is-opening" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mở thiệp cưới"
        >
          <div className="lux-cover-card">
            <div className="seal-top-badge">
              <WaxSeal size={68} monogram="A & A" onClick={handleOpen} />
            </div>

            <span className="cover-wedding-label">THƯ MỜI THIỆP CƯỚI</span>

            <h1 className="cover-couple-title">
              <span className="hero-name-line">{first}</span>
              <span className="amp">&amp;</span>
              <span className="hero-name-line">{second}</span>
            </h1>

            <span className="cover-date-badge">THỨ TƯ · 21.10.2026</span>

            <div className="cover-guest-callout">
              <span className="salutation">{isGroom ? "Dear:" : "Kính mời:"}</span>
              <strong className="guest-name">{guestName}</strong>
            </div>

            <button
              type="button"
              autoFocus
              className="button button-primary cover-open-btn"
              onClick={handleOpen}
            >
              MỞ THIỆP MỜI
            </button>
          </div>
        </div>
      )}

      {/* Main Experience (Visible behind envelope) */}
      <div inert={!opened ? true : undefined}>
        {/* Sticky Glassmorphic Navbar */}
        <nav ref={navRef} className="lux-navbar" aria-label="Điều hướng thiệp cưới">
          <div className="lux-nav-container">
            <a href="/" className="lux-nav-brand">
              Tuấn Anh &amp; Ngọc Anh
            </a>
            <div className="lux-nav-menu">
              <a href="#dau-trang">Trang chủ</a>
              <a href="#le-cuoi">Lễ cưới</a>
              <a href="#lich-trinh">Lịch trình</a>
              <a href="#album-anh">Album ảnh</a>
              <a href="#dia-diem">Địa điểm</a>
              <a href="#so-luu-but">Sổ lưu bút</a>
            </div>
          </div>
        </nav>

        {/* Full-width Responsive Canvas */}
        <main ref={canvasRef}>
          {/* SECTION 1: HERO (SPLIT 2-COLUMN EDITORIAL ON DESKTOP) */}
          <section className="lux-section lux-hero-section" id="dau-trang">
            <div className="lux-container">
              <div className="lux-hero-grid">
                {/* Left Column: Typography & Content */}
                <div className="lux-hero-text-col" data-reveal="fade">
                  <div className="lux-hero-seal-row">
                    <WaxSeal size={52} monogram="A & A" />
                    <span className="hero-save-badge">SAVE THE DATE · 21.10.2026</span>
                  </div>

                  <span className="lux-eyebrow">{ceremonyTitle}</span>

                  <h1 className="lux-hero-names" data-reveal="blur" data-reveal-delay="100">
                    <span className="hero-name-line">{first}</span>
                    <span className="amp">&amp;</span>
                    <span className="hero-name-line">{second}</span>
                  </h1>

                  <p className="lux-hero-full-names" data-reveal data-reveal-delay="200">
                    <span className="hero-name-line">{firstFull}</span>
                    <span className="full-name-amp">&amp;</span>
                    <span className="hero-name-line">{secondFull}</span>
                  </p>

                  <div className="lux-hero-meta-bar" data-reveal data-reveal-delay="300">
                    <span className="hero-meta-item">11:00 — 21.10.2026</span>
                    <span className="hero-meta-sep">/</span>
                    <span className="hero-meta-item">{wedding.event.venueName}</span>
                    <span className="hero-meta-sep">/</span>
                    <span className="hero-meta-item">{wedding.event.hall}</span>
                  </div>

                  <blockquote className="lux-hero-quote" data-reveal data-reveal-delay="350">
                    “Trong vô vàn món quà, thương nhau chân thành là món quà quý giá nhất và trong vô vàn hạnh phúc, được hữu hiện bên nhau là hạnh phúc nhất.”
                  </blockquote>

                  <div className="lux-hero-actions" data-reveal data-reveal-delay="400">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => setRsvpOpen(true)}
                    >
                      XÁC NHẬN THAM DỰ
                    </button>
                    <button
                      type="button"
                      className="button button-gift"
                      onClick={() => setGiftOpen(true)}
                    >
                      GỬI MỪNG CƯỚI
                    </button>
                  </div>
                </div>

                {/* Right Column: Hero Portrait */}
                <div className="lux-hero-photo-col" data-reveal="scale" data-reveal-delay="250">
                  <div className="lux-hero-photo-card">
                    <CornerOrnament position="top-left" />
                    <CornerOrnament position="top-right" />
                    <CornerOrnament position="bottom-left" />
                    <CornerOrnament position="bottom-right" />
                    <div className="lux-hero-photo-inner">
                      <img
                        src="/images/anhcuoi/TOM01971-1600.jpg"
                        srcSet="/images/anhcuoi/TOM01971-800.jpg 800w, /images/anhcuoi/TOM01971-1600.jpg 1600w"
                        sizes="(max-width: 1023px) 90vw, 520px"
                        alt="Tuấn Anh & Ngọc Anh trong trang phục cưới"
                        fetchPriority="high"
                        width="1066"
                        height="1600"
                      />
                    </div>
                    <p className="lux-hero-caption">
                      Hạnh phúc là cùng nhau đi qua những ngày bình thường.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: CEREMONY & FAMILY (STATIONERY CARD DESIGN) */}
          <section className="lux-section bg-alt" id="le-cuoi">
            <div className="lux-container">
              <div className="lux-section-header" data-reveal>
                <span className="lux-eyebrow">NGHI THỨC TRỌNG ĐẠI</span>
                <h2 className="lux-section-title">Thông Tin Lễ Cưới</h2>
                <SectionDivider />
              </div>

              <div className="lux-ceremony-paper" data-reveal="scale">
                <CornerOrnament position="top-left" />
                <CornerOrnament position="top-right" />
                <CornerOrnament position="bottom-left" />
                <CornerOrnament position="bottom-right" />

                {/* Guest Callout Header */}
                <div className="lux-guest-banner">
                  <span className="lux-guest-badge">KÍNH MỜI</span>
                  <h3 className="lux-guest-display-name">{guestName}</h3>
                  <p className="lux-guest-lead">
                    Trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc và chứng kiến khoảnh khắc chung đôi của hai gia đình chúng tôi:
                  </p>
                </div>

                {/* Parents Grid (2 Columns) */}
                <div className="lux-parents-grid">
                  <div className="lux-family-col" data-reveal="left" data-reveal-delay="100">
                    <span className="lux-family-role">ĐẠI DIỆN NHÀ TRAI</span>
                    <p className="lux-parent-name">{wedding.families.groom.father}</p>
                    <p className="lux-parent-name">{wedding.families.groom.mother}</p>
                  </div>

                  <div className="lux-family-col" data-reveal="right" data-reveal-delay="100">
                    <span className="lux-family-role">ĐẠI DIỆN NHÀ GÁI</span>
                    <p className="lux-parent-name">{wedding.families.bride.father}</p>
                    <p className="lux-parent-name">{wedding.families.bride.mother}</p>
                  </div>
                </div>

                {/* Home Ceremony Note for Groom Side */}
                {isGroom && wedding.event.homeCeremony && (
                  <div className="lux-home-ceremony-box" data-reveal="scale" data-reveal-delay="200">
                    <span className="home-ceremony-tag">LỄ THÀNH HÔN TẠI TƯ GIA</span>
                    <p className="home-ceremony-main">
                      Vào lúc <strong>{wedding.event.homeCeremony.time} — 21.10.2026</strong> tại <strong>TƯ GIA NHÀ TRAI</strong>
                    </p>
                    <p className="home-ceremony-addr">{wedding.event.homeCeremony.address}</p>
                    <p className="home-ceremony-lunar">{wedding.event.homeCeremony.lunarDate}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3: RECEPTION & TIMELINE (SPLIT 2-COLUMN EDITORIAL ON DESKTOP) */}
          <section className="lux-section bg-warm" id="lich-trinh">
            <div className="lux-container">
              <div className="lux-section-header" data-reveal>
                <span className="lux-eyebrow">NGÀY CHUNG ĐÔI</span>
                <h2 className="lux-section-title">Tiệc Cưới &amp; Lịch Trình</h2>
                <p className="lux-section-subtitle">
                  Rất mong được đón tiếp bạn trong buổi tiệc thân mật và ấm cúng cùng chúng mình.
                </p>
                <SectionDivider />
              </div>

              <div className="lux-reception-grid">
                {/* Column 1: Reception Big Card */}
                <div className="lux-reception-card" data-reveal="left">
                  <div>
                    <span className="lux-eyebrow">TIỆC MỪNG CHÍNH</span>
                    <div className="lux-giant-date-block">
                      <span className="giant-hour">11:00 — THỨ TƯ</span>
                      <strong className="giant-number-21">21</strong>
                      <span className="giant-month-year">THÁNG 10 · NĂM 2026</span>
                      <span className="giant-lunar">Tức ngày 12 tháng 09 năm Bính Ngọ</span>
                    </div>

                    <div className="lux-venue-box">
                      <h3 className="lux-venue-name">{wedding.event.venueName}</h3>
                      <p className="lux-venue-hall">{wedding.event.hall}</p>
                      <p className="lux-venue-address">{wedding.event.address}</p>
                    </div>
                  </div>

                  <div>
                    <SaveTheDateCalendar />

                  </div>
                </div>

                {/* Column 2: Timeline & Live Countdown */}
                <div className="lux-timeline-card" data-reveal="right" data-reveal-delay="150">
                  <div>
                    <WeddingTimeline />
                  </div>

                  <div>
                    <CountdownTimer title="CÙNG ĐẾM NGƯỢC THỜI GIAN" />
                  </div>

                  <div className="lux-reception-rsvp">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => setRsvpOpen(true)}
                    >
                      XÁC NHẬN THAM DỰ
                    </button>
                    <p>Vui lòng phản hồi trước hết ngày 15.10.2026</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: ALBUM GALLERY (RESPONSIVE EDITORIAL MOSAIC) */}
          <section className="lux-section" id="album-anh">
            <div className="lux-container" data-reveal="fade">
              <WeddingGallery />
            </div>
          </section>

          {/* SECTION 5: VENUE LOCATION & DIRECTIONS (2-COLUMN ON DESKTOP) */}
          <section className="lux-section bg-alt" id="dia-diem">
            <div className="lux-container">
              <div className="lux-section-header" data-reveal>
                <span className="lux-eyebrow">ĐỊA ĐIỂM &amp; CHỈ ĐƯỜNG</span>
                <h2 className="lux-section-title">Hân Hạnh Đón Tiếp</h2>
                <SectionDivider />
              </div>

              <div className="lux-location-grid">
                {/* Details Column */}
                <div className="lux-location-info-card" data-reveal="left">
                  <div>
                    <span className="lux-eyebrow">TRUNG TÂM TIỆC CƯỚI</span>
                    <h3 className="location-palace-name">{wedding.event.venueName}</h3>
                    <span className="location-hall-badge">{wedding.event.hall}</span>
                    <p className="location-address-full">{wedding.event.address}</p>

                    <div className="location-parking-note">
                      <strong>Chỉ dẫn gửi xe:</strong> Bãi đỗ xe ô tô và xe máy thuận tiện tại tầng hầm Tòa nhà Hancorp Plaza. Quý khách vào từ cổng Trần Đăng Ninh.
                    </div>
                  </div>

                  <div className="location-btn-row">
                    <a
                      className="button button-primary"
                      href={wedding.event.maps.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      MỞ GOOGLE MAPS
                    </a>
                    <button
                      type="button"
                      className="button button-outline"
                      onClick={copyAddress}
                    >
                      {copiedAddress ? "ĐÃ SAO CHÉP ĐỊA ĐIỂM" : "SAO CHÉP ĐỊA CHỈ"}
                    </button>
                  </div>
                </div>

                {/* Map Iframe Column */}
                <div className="lux-map-frame-box" data-reveal="right" data-reveal-delay="150">
                  <iframe
                    title="Bản đồ Trống Đồng Palace Hancorp Plaza"
                    src={wedding.event.maps.embedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: GUESTBOOK (SỔ LƯU BÚT) */}
          <section className="lux-section bg-warm" id="so-luu-but">
            <div className="lux-container">
              <div className="lux-section-header" data-reveal>
                <span className="lux-eyebrow">LƯU BÚT YÊU THƯƠNG</span>
                <h2 className="lux-section-title">Gửi Lời Chúc Mừng</h2>
                <p className="lux-section-subtitle">
                  Từng dòng nhắn nhủ của bạn sẽ là kỷ niệm vô giá theo chúng mình suốt chặng đường đời.
                </p>
                <SectionDivider />
              </div>

              <div className="lux-wishes-paper" data-reveal="scale">
                <CornerOrnament position="top-left" />
                <CornerOrnament position="top-right" />
                <CornerOrnament position="bottom-left" />
                <CornerOrnament position="bottom-right" />

                <WishForm
                  side={side}
                  invitedName={invite.invitation?.name || ""}
                  invitationSlug={slug}
                  hideHeader={true}
                />
              </div>
            </div>
          </section>

          {/* SECTION 7: GIFT BOX (HỘP MỪNG CƯỚI) */}
          <section className="lux-section" id="mung-cuoi">
            <div className="lux-container">
              <div className="lux-section-header" data-reveal>
                <span className="lux-eyebrow">HỘP MỪNG CƯỚI</span>
                <h2 className="lux-section-title">Gửi Trao Chúc Phúc</h2>
                <p className="lux-section-subtitle">
                  Sự hiện diện của bạn là niềm vui trọn vẹn nhất đối với chúng mình. Nếu muốn gửi quà mừng từ xa, bạn có thể gửi tại đây nhé!
                </p>
                <SectionDivider />
              </div>

              <div className="lux-gift-card" data-reveal="scale">
                <blockquote style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.1rem", color: "var(--lux-body)", marginBottom: "20px" }}>
                  “Những lời chúc tốt đẹp nhất của Quý vị sẽ là món quà vô cùng quý giá đối với hai gia đình chúng tôi trong ngày trọng đại này.”
                </blockquote>

                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setGiftOpen(true)}
                >
                  MỞ HỘP MỪNG CƯỚI {SIDE_CONFIG[side].label.toUpperCase()}
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 8: CLOSING THANK YOU BANNER */}
          <footer className="lux-closing-section">
            <div className="lux-closing-photo-wrap" data-reveal="blur">
              <img
                src="/images/anhcuoi/TOM02608-1600.jpg"
                alt="Tuấn Anh & Ngọc Anh mỉm cười hạnh phúc"
                loading="lazy"
                width="1600"
                height="1066"
              />
            </div>

            <div className="lux-container" data-reveal="fade">
              <h2 className="lux-closing-title">Cảm Ơn Bạn Thật Nhiều!</h2>
              <p className="lux-closing-sub">
                Cảm ơn bạn đã luôn đồng hành, yêu thương và chúc phúc cho hành trình của chúng mình. Hẹn gặp bạn trong ngày vui!
              </p>
              <span className="lux-closing-signature">Tuấn Anh &amp; Ngọc Anh</span>
            </div>

            <div className="lux-site-footer">
              <p>LƯƠNG TUẤN ANH &amp; ĐẶNG NGỌC ANH · 21.10.2026</p>
              <p style={{ marginTop: "4px", fontSize: "0.74rem", opacity: 0.7 }}>
                TRỐNG ĐỒNG PALACE · 72 TRẦN ĐĂNG NINH, NGHĨA ĐÔ, CẦU GIẤY, HÀ NỘI
              </p>
            </div>
          </footer>
        </main>

        {/* Mobile Sticky Bottom Bar */}
        <div className="lux-mobile-bar" aria-label="Thao tác nhanh">
          <button
            type="button"
            className="bar-btn-rsvp"
            onClick={() => setRsvpOpen(true)}
          >
            Phúc đáp
          </button>
          <a className="bar-btn-wish" href="#so-luu-but">
            Lời chúc
          </a>
          <button
            type="button"
            className="bar-btn-gift"
            onClick={() => setGiftOpen(true)}
          >
            Mừng cưới
          </button>
        </div>
      </div>

      {/* RSVP Modal */}
      <Modal
        title={`Phúc đáp · ${SIDE_CONFIG[side].label}`}
        open={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        className="rsvp-modal"
      >
        <RsvpForm
          side={side}
          invitedName={invite.invitation?.name || ""}
          invitationSlug={slug}
          compact
        />
      </Modal>

      {/* Gift Dialog */}
      <GiftDialog
        side={side}
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
      />
    </div>
  );
}
