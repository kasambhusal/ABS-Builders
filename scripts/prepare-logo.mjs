// One-off: turns the supplied square logo into transparent circular PNG/WebP + favicon sizes.
// usage: node scripts/prepare-logo.mjs <path-to-logo>
import sharp from "sharp";

const src = process.argv[2];
const cx = 975, cy = 995, r = 968; // measured from the supplied artwork
const size = r * 2;
const mask = Buffer.from(
  `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`,
);

const base = await sharp(src)
  .extract({ left: cx - r, top: cy - r, width: size, height: size })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

const out = (name, px, fmt = "png") =>
  sharp(base).resize(px, px)[fmt](fmt === "webp" ? { quality: 92 } : { compressionLevel: 9 }).toFile(`public/images/${name}`);

await Promise.all([
  out("logo.png", 512),
  out("logo.webp", 512, "webp"),
  out("logo-128.png", 128),
]);
await sharp(base).resize(256, 256).png({ compressionLevel: 9 }).toFile("src/app/icon.png");
await sharp(base).resize(180, 180).flatten({ background: "#ffffff" }).png().toFile("src/app/apple-icon.png");
console.log("logo ready");
