import React, { useState } from "react";
import wedding from "../config/wedding.json";

export default function EnvelopeIntro({ side = "groom", guestName = "Quý khách", onOpen }) {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);

  const isGroom = side === "groom";
  const title = isGroom
    ? `The wedding of ${wedding.couple.groomFullName} & ${wedding.couple.brideFullName}`
    : `The wedding of ${wedding.couple.brideFullName} & ${wedding.couple.groomFullName}`;

  const salutation = isGroom ? "Dear:" : "Kính mời:";

  function handleOpen() {
    if (opening || opened) return;
    setOpening(true);
    if (onOpen) onOpen();
    setTimeout(() => {
      setOpened(true);
    }, 750);
  }

  if (opened) return null;

  return (
    <div className={`envelope-overlay ${opening ? "envelope-opening" : ""}`}>
      <div className="envelope-backdrop" onClick={handleOpen} />

      <div className="envelope-wrapper">
        <div className="envelope-paper-card">
          {/* Top Flap line styling */}
          <div className="envelope-top-crease" aria-hidden="true" />

          <div className="envelope-body">
            <span className="envelope-script-title">{title}</span>
            <span className="envelope-date-line">21.10.2026</span>

            <div className="envelope-guest-section">
              <span className="envelope-salutation">{salutation}</span>
              <span className="envelope-guest-name">{guestName}</span>
              <div className="envelope-dotted-line" aria-hidden="true" />
            </div>

            <button
              type="button"
              className="envelope-open-button"
              onClick={handleOpen}
            >
              MỞ THIỆP MỜI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
