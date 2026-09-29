// Regenerates the static SVG used by the social share image: npx tsx scripts/export-roo.tsx
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { HeroScene } from "../src/components/HeroScene";
const svg = renderToStaticMarkup(<HeroScene />).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
writeFileSync(new URL("../src/assets/roo-scene.svg", import.meta.url), svg);
console.log("wrote", svg.length, "bytes");
