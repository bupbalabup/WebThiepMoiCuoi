import React from "react";

function ReferenceIcon({ name }) {
  return <img src={`/images/timeline/${name}.png`} alt="" aria-hidden="true" width="120" height="140" />;
}
export function WelcomeGateIcon() { return <ReferenceIcon name="welcome" />; }
export function WeddingRingsIcon() { return <ReferenceIcon name="rings" />; }
export function BanquetIcon() { return <ReferenceIcon name="banquet" />; }
export const TIMELINE_ICONS = [WelcomeGateIcon, WeddingRingsIcon, BanquetIcon];
