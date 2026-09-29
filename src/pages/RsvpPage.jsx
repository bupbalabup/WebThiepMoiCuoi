import React from "react";
import { SIDE_CONFIG } from "../lib/routes.js";
import useInvitation from "../hooks/useInvitation.js";
import RsvpForm from "../components/RsvpForm.jsx";
import { InvitationError, InvitationLoading } from "../components/InvitationLoading.jsx";

export default function RsvpPage({ side }) {
  const slug = new URLSearchParams(window.location.search).get("khach");
  const safeSlug = slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug !== "phuc-dap" ? slug : null;
  const invite = useInvitation(side, safeSlug);
  const config = SIDE_CONFIG[side];

  if (safeSlug && invite.status === "loading") return <InvitationLoading />;
  if (safeSlug && invite.status === "error") return <InvitationError error={invite.error} />;
  return (
    <main className={`rsvp-page side-${side}`}>
      <a className="topbar-brand rsvp-brand" href="/">T <span>&</span> N</a>
      <section className="rsvp-intro">
        <span className="eyebrow">Phúc đáp {config.label}</span>
        <h1>Tuấn Anh <i>&</i> Ngọc Anh</h1>
        {invite.invitation?.name && <p className="rsvp-guest">Thân gửi {invite.invitation.name}</p>}
        <p>11:00 · 21.10.2026</p>
        <p>Trống Đồng Palace · 72 Trần Đăng Ninh, Hà Nội</p>
      </section>
      <section className="rsvp-card"><RsvpForm side={side} invitedName={invite.invitation?.name || ""} invitationSlug={safeSlug} /></section>
      <a className="text-link back-invite" href={config.path}>← Xem thiệp mời {config.label}</a>
    </main>
  );
}
