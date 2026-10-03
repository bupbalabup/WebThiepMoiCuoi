import React, { useCallback, useEffect, useRef, useState } from "react";
import wedding from "../config/wedding.json";
import { SIDE_CONFIG } from "../lib/routes.js";
import useInvitation from "../hooks/useInvitation.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import MobileInvitation, { MobileEnvelope } from "../components/MobileInvitation.jsx";
import Modal from "../components/Modal.jsx";
import RsvpForm from "../components/RsvpForm.jsx";
import GiftDialog from "../components/GiftDialog.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import AmbientPetals from "../components/AmbientPetals.jsx";
import { InvitationError, InvitationLoading } from "../components/InvitationLoading.jsx";

export default function InvitationPage({ side, slug }) {
  const invite = useInvitation(side, slug);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [coverOpening, setCoverOpening] = useState(false);
  const [musicTrigger, setMusicTrigger] = useState(false);

  const canvasRef = useScrollReveal({ ready: !slug || invite.status === "success" });
  const navRef = useRef(null);

  const isGroom = side === "groom";
  const first = isGroom ? wedding.couple.groom : wedding.couple.bride;
  const second = isGroom ? wedding.couple.bride : wedding.couple.groom;
  const guestName = invite.invitation?.name || "Bạn";

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
          <MobileEnvelope first={first} second={second} guestName={guestName} onOpen={handleOpen} />
        </div>
      )}

      {/* Main Experience (Visible behind envelope) */}
      <div inert={!opened ? true : undefined}>
        {/* Sticky Glassmorphic Navbar */}
        <nav ref={navRef} className="lux-navbar" aria-label="Điều hướng thiệp cưới">
          <div className="lux-nav-container">
            <a href="/" className="lux-nav-brand">
              {first} &amp; {second}
            </a>
            <div className="lux-nav-menu">
              <a href="#dau-trang">Trang chủ</a>
              <a href="#le-cuoi">Lễ cưới</a>
              <a href="#dia-diem">Địa điểm</a>
              <a href="#lich-trinh">Lịch trình</a>
              <a href="#album-anh">Album ảnh</a>
              <a href="#so-luu-but">Sổ lưu bút</a>
            </div>
          </div>
        </nav>

        {/* Full-width Responsive Canvas */}
        <main ref={canvasRef}>
          <MobileInvitation side={side} guestName={guestName} invitedName={invite.invitation?.name || ""} slug={slug} onRsvp={() => setRsvpOpen(true)} onGift={() => setGiftOpen(true)} />
        </main>

        {/* Mobile Sticky Bottom Bar */}
        <div className="lux-mobile-bar" aria-label="Thao tác nhanh">
          <button
            type="button"
            className="bar-btn-rsvp"
            onClick={() => setRsvpOpen(true)}
          >
            Tham dự
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
