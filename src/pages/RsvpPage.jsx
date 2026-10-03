import React from "react";
import { SIDE_CONFIG } from "../lib/routes.js";
import useInvitation from "../hooks/useInvitation.js";
import RsvpForm from "../components/RsvpForm.jsx";
import { InvitationError, InvitationLoading } from "../components/InvitationLoading.jsx";
import wedding from "../config/wedding.json";

export default function RsvpPage({ side }) {
  const slug = new URLSearchParams(window.location.search).get("khach");
  const safeSlug = slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug !== "phuc-dap" ? slug : null;
  const invite = useInvitation(side, safeSlug);
  const config = SIDE_CONFIG[side];
  const names = side === "groom" ? [wedding.couple.groom, wedding.couple.bride] : [wedding.couple.bride, wedding.couple.groom];

  if (safeSlug && invite.status === "loading") return <InvitationLoading />;
  if (safeSlug && invite.status === "error") return <InvitationError error={invite.error} />;

  return (
    <main className={`rsvp-standalone-page side-${side}`}>
      <header className="rsvp-page-header">
        <a className="rsvp-nav-brand" href="/">
          {names.join(" & ")}
        </a>
        <a className="rsvp-back-link" href={safeSlug ? `${config.path}/${safeSlug}` : config.path}>
          Xem thiệp mời
        </a>
      </header>

      <div className="rsvp-page-layout">
      <section className="rsvp-hero-card">
        <span className="rsvp-super-title">NGÀY VUI CỦA CHÚNG MÌNH</span>
        <h1 className="rsvp-main-heading">
          <span className="hero-name-line">{names[0]}</span>
          <span className="amp">&amp;</span>
          <span className="hero-name-line">{names[1]}</span>
        </h1>

        {invite.invitation?.name ? (
          <div className="rsvp-guest-tag">
            <span className="tag-prefix">Kính gửi:</span>
            <strong className="tag-name">{invite.invitation.name}</strong>
          </div>
        ) : (
          <p className="rsvp-card-sub">
            Trân trọng kính mời quý khách xác nhận thông tin tham dự tiệc cưới cùng chúng mình.
          </p>
        )}

        <div className="rsvp-meta-info">
          <span>11:00 — 21.10.2026</span>
          <span className="meta-sep">|</span>
          <span>{wedding.event.venueName}</span>
          <span className="meta-sep">|</span>
          <span>{wedding.event.hall}</span>
        </div>
        <p className="rsvp-side-tag">Khách mời {config.label}</p>
      </section>

      <div className="rsvp-card-container">
        <RsvpForm
          side={side}
          invitedName={invite.invitation?.name || ""}
          invitationSlug={safeSlug}
        />
      </div>
      </div>

      <div className="rsvp-footer-action">
        <a className="button button-outline" href={safeSlug ? `${config.path}/${safeSlug}` : config.path}>
          QUAY LẠI THIỆP MỜI {config.label.toUpperCase()}
        </a>
      </div>
    </main>
  );
}
