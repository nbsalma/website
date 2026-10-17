import { ImageResponse } from "next/og";

export const alt = "NB Brokerage & Supply Services — Building materials from Egypt to Africa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The preview card shown when the site is shared on LinkedIn, WhatsApp, etc. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0A0B0C", color: "#F4F1EA", padding: "72px 80px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, background: "#c2410c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, color: "#fff" }}>NB</div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>NB Brokerage & Supply Services</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>Building materials from Egypt to Africa.</div>
          <div style={{ fontSize: 30, color: "#B9BDC2" }}>Cement · Sand · Marble · Clinker · Silica sand</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8D9298" }}>
          <span>nbsalma.com</span>
          <span>Request a quote →</span>
        </div>
      </div>
    ),
    size,
  );
}
