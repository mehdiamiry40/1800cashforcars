// Regenerates src/assets/roo-pouch.svg (used by the social share image): npx tsx scripts/export-roo.tsx
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { Roo } from "../src/components/Roo";
const svg = renderToStaticMarkup(<Roo pouchCar />).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
writeFileSync(new URL("../src/assets/roo-pouch.svg", import.meta.url), svg);
console.log("wrote", svg.length, "bytes");
