import React from "react";
import wedding from "../config/wedding.json";

export default function FamilyCeremony({ side = "groom" }) {
  const isGroom = side === "groom";
  const groomFamily = wedding.families.groom;
  const brideFamily = wedding.families.bride;

  return (
    <section className="family-ceremony-section">
      {/* Parents information matching the physical card layout */}
      <div className="parents-grid">
        {isGroom ? (
          <>
            <div className="family-col">
              <span className="family-heading">NHÀ TRAI</span>
              <p className="parent-line">{groomFamily.father}</p>
              <p className="parent-line">{groomFamily.mother}</p>
            </div>
            <div className="family-col">
              <span className="family-heading">NHÀ GÁI</span>
              <p className="parent-line">{brideFamily.father}</p>
              <p className="parent-line">{brideFamily.mother}</p>
            </div>
          </>
        ) : (
          <>
            <div className="family-col">
              <span className="family-heading">NHÀ GÁI</span>
              <p className="parent-line">{brideFamily.father}</p>
              <p className="parent-line">{brideFamily.mother}</p>
            </div>
            <div className="family-col">
              <span className="family-heading">NHÀ TRAI</span>
              <p className="parent-line">{groomFamily.father}</p>
              <p className="parent-line">{groomFamily.mother}</p>
            </div>
          </>
        )}
      </div>

      {/* For Groom side: Ceremony at groom private residence as in the physical card */}
      {isGroom && wedding.event.homeCeremony && (
        <div className="home-ceremony-card">
          <span className="ceremony-tag">LỄ THÀNH HÔN TẠI TƯ GIA</span>
          <p className="ceremony-time">
            Vào lúc <strong>{wedding.event.homeCeremony.time} — 21.10.2026</strong> tại <strong>TƯ GIA NHÀ TRAI</strong>
          </p>
          <p className="ceremony-address">{wedding.event.homeCeremony.address}</p>
          <p className="ceremony-lunar">{wedding.event.homeCeremony.lunarDate}</p>
        </div>
      )}
    </section>
  );
}
