import { ImageResponse } from "next/og";

export const alt = "1800 Cash For Cars — top cash for any car, free pickup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0d1b34", color: "white" }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#ff8a3d", letterSpacing: 6 }}>1800 CASH FOR CARS</div>
        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.05, marginTop: 24 }}>Top cash for your car.</div>
        <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.05, color: "#ff8a3d" }}>Free pickup. Paid today.</div>
        <div style={{ fontSize: 34, marginTop: 36, color: "rgba(255,255,255,.8)" }}>Any make · Any model · Any condition</div>
      </div>
    ),
    size,
  );
}
