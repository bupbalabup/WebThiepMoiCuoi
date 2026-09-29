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
  if (safeSlug && invite.status === "loading") return <InvitationLoading />;
  if (safeSlug && invite.status === "error") return <InvitationError error={invite.error} />;
  const names = side === "bride" ? [wedding.couple.bride, wedding.couple.groom] : [wedding.couple.groom, wedding.couple.bride];
  return <main className="rsvp-page">
    <header className="rsvp-topbar"><a className="topbar-brand" href="/">A <i>&</i> A</a><a className="text-link" href={config.path + (safeSlug ? "/" + safeSlug : "")}>Xem thiệp mời</a></header>
    <section className="rsvp-intro"><p className="eyebrow">Phúc đáp {config.label}</p><h1>{names[0]} <i>&</i> {names[1]}</h1>{invite.invitation?.name && <p>Thân gửi {invite.invitation.name}</p>}<p>11:00 · 21.10.2026</p><p>{wedding.event.hall} · {wedding.event.venueName}</p></section>
    <section className="rsvp-card"><RsvpForm side={side} invitedName={invite.invitation?.name || ""} invitationSlug={safeSlug} /></section>
  </main>;
}
