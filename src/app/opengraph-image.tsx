import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { shareImage } from "@/lib/site";

export const alt = shareImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The site's own colours (globals.css) and typeface, so a shared link looks like the page it opens.
const NAVY = "#1e25a4";
const BRAND = "#e16633";
const LOGO = "#c14a22";

// Fetches a Barlow weight as TTF (Google Fonts serves TTF to non-browser clients), for next/og.
async function barlow(weight: number) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Barlow:wght@${weight}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error("Barlow font URL not found");
  return (await fetch(url)).arrayBuffer();
}

export default async function OgImage() {
  // Static export of <HeroScene /> (regenerate with scripts/export-roo.tsx if the art changes).
  const svg = readFileSync(join(process.cwd(), "src/assets/roo-scene.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#ffffff", color: NAVY, fontFamily: "Barlow" }}>
        <div style={{ display: "flex", height: 16, background: BRAND }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 590 }}>
            {/* The header logo: "1800" on the orange block, the rest in a navy outline. */}
            <div style={{ display: "flex", alignItems: "stretch", fontSize: 32, fontWeight: 700, lineHeight: 1 }}>
              <div style={{ display: "flex", alignItems: "center", background: LOGO, color: "#ffffff", padding: "10px 14px" }}>1800</div>
              <div style={{ display: "flex", alignItems: "center", borderTop: `4px solid ${NAVY}`, borderBottom: `4px solid ${NAVY}`, borderRight: `4px solid ${NAVY}`, padding: "6px 14px", letterSpacing: 0.5 }}>
                CASH FOR CARS
              </div>
            </div>
            <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1, marginTop: 34, letterSpacing: -1.5 }}>Cash for cars.</div>
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.08, marginTop: 10, color: BRAND, letterSpacing: -0.5 }}>Any car. Any condition.</div>
            <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.3, marginTop: 30 }}>Free towing. Paid on pickup. Brisbane, Gold Coast and South East QLD.</div>
          </div>
          <img src={src} width={460} height={324} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Barlow", data: await barlow(700), weight: 700, style: "normal" },
        { name: "Barlow", data: await barlow(600), weight: 600, style: "normal" },
      ],
    },
  );
}
