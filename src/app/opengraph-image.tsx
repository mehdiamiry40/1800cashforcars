import { ImageResponse } from "next/og";

export const alt = "1800 Cash For Cars. We buy cars in any condition, with free pickup.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#f4f2ee", color: "#111827" }}>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 900 }}>
          <div style={{ display: "flex", background: "#e8590c", color: "#fff", padding: "10px 18px" }}>1800</div>
          <div style={{ display: "flex", border: "6px solid #0f1d33", borderLeft: "none", padding: "4px 18px", color: "#0f1d33" }}>CASH FOR CARS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05 }}>We buy cars for cash.</div>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05, color: "#c2410c" }}>Any condition, free towing.</div>
        </div>
        <div style={{ fontSize: 34, color: "#3f4652" }}>Gold Coast · Brisbane · Logan · Ipswich · Sunshine Coast · Tweed</div>
      </div>
    ),
    size,
  );
}
