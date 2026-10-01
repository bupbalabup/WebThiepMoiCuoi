import React from "react";

export function WeddingMonogram({ size = 80, className = "" }) {
  return <img className={`wedding-monogram ${className}`} src="/images/wedding-monogram.svg" width={size} height={size} alt="Chữ lồng A và A" />;
}

export function WaxSeal({ size = 64, onClick, className = "" }) {
  return onClick ? <button type="button" className="monogram-button" onClick={onClick} aria-label="Mở thiệp mời"><WeddingMonogram size={size} className={className} /></button> : <WeddingMonogram size={size} className={className} />;
}

/**
 * CornerOrnament: Delicate stationery filigree corner accent
 */
export function CornerOrnament({ position = "top-left" }) {
  const isRight = position.includes("right");
  const isBottom = position.includes("bottom");
  const transform = `${isRight ? "scaleX(-1) " : ""}${isBottom ? "scaleY(-1)" : ""}`.trim();

  return (
    <div className={`lux-corner-flourish ${position}`} aria-hidden="true" style={{ transform: transform || undefined }}>
      <svg viewBox="0 0 50 50" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M2 48 V 16 C 2 8 8 2 16 2 H 48" opacity="0.6" />
        <path d="M6 48 V 20 C 6 12 12 6 20 6 H 48" opacity="0.3" strokeDasharray="2 2" />
        <circle cx="16" cy="16" r="2.5" fill="currentColor" opacity="0.5" />
        <path d="M16 16 L 2 2" opacity="0.4" />
      </svg>
    </div>
  );
}

/**
 * SectionDivider: Refined botanical divider rule
 */
export function SectionDivider({ className = "" }) {
  return (
    <div className={`lux-section-divider ${className}`} aria-hidden="true">
      <span className="divider-line" />
      <svg className="divider-motif" viewBox="0 0 40 18" width="36" height="16" fill="currentColor">
        <path d="M20 2 C18 6 13 9 7 9 C13 9 18 12 20 16 C22 12 27 9 33 9 C27 9 22 6 20 2 Z" opacity="0.8" />
        <circle cx="2" cy="9" r="1.5" opacity="0.5" />
        <circle cx="38" cy="9" r="1.5" opacity="0.5" />
      </svg>
      <span className="divider-line" />
    </div>
  );
}
