import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "1800 Cash For Cars. Cash for scrap cars. Any car, any condition.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetches a Nunito weight as TTF (Google Fonts serves TTF to non-browser clients), for next/og.
async function nunito(weight: number) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Nunito:wght@${weight}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error("Nunito font URL not found");
  return (await fetch(url)).arrayBuffer();
}

export default async function OgImage() {
  // Static export of <Roo pouchCar /> (regenerate if the character changes).
  const svg = readFileSync(join(process.cwd(), "src/assets/roo-pouch.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 80px", background: "#FBF3E6", color: "#1D2433", fontFamily: "Nunito" }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#1f7a4d", letterSpacing: 4 }}>1800 CASH FOR CARS</div>
          <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.02, marginTop: 20 }}>Cash for scrap cars.</div>
          <div style={{ fontSize: 84, fontWeight: 900, lineHeight: 1.02, color: "#A55A27" }}>Any car. Any condition.</div>
          <div style={{ fontSize: 32, fontWeight: 600, marginTop: 28, color: "#4B5263" }}>Free towing. Paid on pickup. Brisbane, Gold Coast and SEQ.</div>
        </div>
        <img src={src} width={380} height={518} alt="" />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Nunito", data: await nunito(900), weight: 900, style: "normal" },
        { name: "Nunito", data: await nunito(600), weight: 600, style: "normal" },
      ],
    },
  );
}
