import React from "react";

const commonProps = {
  viewBox: "0 0 120 120",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function WelcomeGateIcon() {
  return <svg {...commonProps}>
    <path d="M22 103c3-26 2-54 5-76 20-17 46-17 66 0 3 22 2 50 5 76" />
    <path d="M29 27c11 8 20 11 31 10 11 1 20-2 31-10M60 14v23" />
    <path d="M29 29c2 21 8 36 18 44M91 29c-2 21-8 36-18 44" />
    <path d="M39 20c-1 21 1 36 8 53M81 20c1 21-1 36-8 53" />
    <path d="M47 16c1 16 5 28 13 38M73 16c-1 16-5 28-13 38" />
    <path d="M47 73c-5 11-8 22-8 33l-15-3c5-12 7-23 5-34M73 73c5 11 8 22 8 33l15-3c-5-12-7-23-5-34" />
    <path d="M29 42c-10-7-18-4-20 5 9-2 16 1 19 8-4-10-12-15-21-14M91 42c10-7 18-4 20 5-9-2-16 1-19 8 4-10 12-15 21-14" />
    <path d="M24 50c-7 4-10 10-8 17 7-6 13-7 19-3M96 50c7 4 10 10 8 17-7-6-13-7-19-3" />
    <circle cx="13" cy="27" r="1.5" /><circle cx="18" cy="35" r="1.2" />
    <circle cx="107" cy="27" r="1.5" /><circle cx="102" cy="35" r="1.2" />
  </svg>;
}

export function WeddingRingsIcon() {
  return <svg {...commonProps}>
    <circle cx="43" cy="72" r="27" /><circle cx="72" cy="61" r="27" />
    <path d="M27 54c9-10 24-13 36-5M57 81c8 6 19 7 28 2" />
    <path d="m72 24 9-12 12 2 5 12-10 10Z" />
    <path d="m81 12 7 24M98 26l-26-2M87 14l6 12" />
    <path d="M101 10v-6M98 7h6M18 39l-4-5M12 45H5M103 48l6-3M15 91l-6 4" />
    <circle cx="13" cy="65" r="1.3" /><circle cx="103" cy="71" r="1.3" />
    <circle cx="92" cy="95" r="1.2" /><circle cx="24" cy="105" r="1.2" />
  </svg>;
}

export function BanquetIcon() {
  return <svg {...commonProps}>
    <circle cx="61" cy="62" r="31" /><circle cx="61" cy="62" r="23" />
    <path d="M18 24v34M13 24v22c0 7 10 7 10 0V24M18 58v39" />
    <path d="M95 21c-8 13-7 26 2 38l-3 39M97 21l7 77" />
    <path d="M31 32c7-6 16-10 25-11M88 86c-7 7-15 11-25 13" />
    <path d="M104 31l5-4M106 41h7M103 51l5 3M27 87l-5 4M26 76h-7" />
    <circle cx="111" cy="63" r="1.3" /><circle cx="12" cy="69" r="1.3" />
  </svg>;
}

export const TIMELINE_ICONS = [WelcomeGateIcon, WeddingRingsIcon, BanquetIcon];
