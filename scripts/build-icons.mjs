// Builds raster icons, favicon.ico and the social image from the vector brand files.
// Run: node scripts/build-icons.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const fav = readFileSync("public/brand/app-icon.svg");
const small = readFileSync("public/favicon.svg");
const png = (size) => sharp(fav, { density: 384 }).resize(size, size).png().toBuffer();

for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180]]) {
  writeFileSync(`public/${name}`, await png(size));
}

// favicon.ico with embedded PNG frames (16, 32, 48)
const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map((s) => sharp(small, { density: 576 }).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e); header.writeUInt8(s, e + 1); header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(frames[i].length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += frames[i].length;
});
writeFileSync("public/favicon.ico", Buffer.concat([header, ...frames]));

// Social sharing image 1200x630
const logo = await sharp(readFileSync("public/brand/lumen-logo-reverse.svg"), { density: 300 }).resize({ width: 640 }).png().toBuffer();
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><radialGradient id="g" cx="80%" cy="20%" r="80%"><stop offset="0" stop-color="#1C6767" stop-opacity=".55"/><stop offset="1" stop-color="#1D2F49" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="#14223A"/><rect width="1200" height="630" fill="url(#g)"/>
<rect x="0" y="0" width="10" height="630" fill="#BBA682"/>
<text x="600" y="470" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="8" fill="#D1C9B9" text-anchor="middle">DUBAI · UNITED ARAB EMIRATES</text>
</svg>`);
await sharp(bg).composite([{ input: logo, top: 175, left: 280 }]).jpeg({ quality: 88 }).toFile("public/og-image.jpg");
console.log("icons built");
