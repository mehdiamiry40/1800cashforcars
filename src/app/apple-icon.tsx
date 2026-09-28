import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#c2410c", color: "#fff" }}>
        <div style={{ fontSize: 70, fontWeight: 900, letterSpacing: -2, lineHeight: 1 }}>1800</div>
        <div style={{ marginTop: 10, fontSize: 21, fontWeight: 800, letterSpacing: 1 }}>CASH FOR CARS</div>
      </div>
    ),
    size,
  );
}
