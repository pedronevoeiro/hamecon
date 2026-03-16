import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import sharp from "sharp";

const OUTPUT_DIR = path.resolve("public/images");
const LOGOS_DIR = path.resolve("scripts/logos");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(LOGOS_DIR, { recursive: true });

// Company brand colors and info
const brands = {
  picpay: { name: "PicPay", color: "#21C25E", textColor: "#fff", bg: "#21C25E" },
  sicoob: { name: "Sicoob", color: "#003641", textColor: "#fff", bg: "#003641" },
  bradesco: { name: "Bradesco", color: "#CC092F", textColor: "#fff", bg: "#CC092F" },
  xp: { name: "XP", color: "#000000", textColor: "#D4AF37", bg: "#000" },
  gol: { name: "GOL", color: "#FF6600", textColor: "#fff", bg: "#FF6600" },
  nubank: { name: "Nubank", color: "#820AD1", textColor: "#fff", bg: "#820AD1" },
  natura: { name: "Natura", color: "#FF6B00", textColor: "#fff", bg: "#FF6B00" },
  itau: { name: "Itaú", color: "#003399", textColor: "#FF6600", bg: "#003399" },
};

// Unsplash photos (direct source URLs for product photography)
const productPhotos = {
  caneca: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop&q=80",
  camiseta: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&q=80",
  caderno: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop&q=80",
  caneta: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&h=800&fit=crop&q=80",
  mochila: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&q=80",
  garrafa: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop&q=80",
  pendrive: "https://images.unsplash.com/photo-1597673030062-0a0f1a801a31?w=800&h=800&fit=crop&q=80",
  ecobag: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop&q=80",
  sustentavel: "https://images.unsplash.com/photo-1611735341450-0d0aeee75974?w=800&h=800&fit=crop&q=80",
  powerbank: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop&q=80",
  fones: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=800&fit=crop&q=80",
  guardachuva: "https://images.unsplash.com/photo-1534309466160-70b22cc6254d?w=800&h=800&fit=crop&q=80",
  // Demo lifestyle images
  demo_caneca: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&h=800&fit=crop&q=80",
  demo_polo: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop&q=80",
  demo_caderno: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=800&fit=crop&q=80",
  demo_garrafa: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=800&fit=crop&q=80",
  // Hero
  hero: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1400&h=700&fit=crop&q=80",
};

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const doRequest = (reqUrl, redirects = 0) => {
      if (redirects > 10) return reject(new Error("Too many redirects"));
      const client = reqUrl.startsWith("https") ? https : http;
      const req = client.get(reqUrl, { timeout: 30000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doRequest(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`));
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          fs.writeFileSync(filepath, Buffer.concat(chunks));
          resolve();
        });
        res.on("error", reject);
      });
      req.on("error", reject);
      req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    };
    doRequest(url);
  });
}

function createLogoBadge(brand, size = 200) {
  const b = brands[brand];
  return Buffer.from(`
    <svg width="${size}" height="${size * 0.5}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="${size}" height="${size * 0.5}" rx="${size * 0.08}" fill="${b.bg}" filter="url(#shadow)" opacity="0.92"/>
      <text x="${size / 2}" y="${size * 0.32}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${size * 0.22}" fill="${b.textColor}">${b.name}</text>
    </svg>
  `);
}

function createBrandedOverlay(brand, width, height) {
  const b = brands[brand];
  const logoW = Math.round(width * 0.35);
  const logoH = Math.round(logoW * 0.45);
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="6" flood-opacity="0.4"/>
        </filter>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="white" stop-opacity="0.15"/>
          <stop offset="50%" stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="white" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <rect x="${(width - logoW) / 2}" y="${(height - logoH) / 2}" width="${logoW}" height="${logoH}" rx="${logoH * 0.15}" fill="${b.bg}" filter="url(#shadow2)" opacity="0.88"/>
      <rect x="${(width - logoW) / 2}" y="${(height - logoH) / 2}" width="${logoW}" height="${logoH}" rx="${logoH * 0.15}" fill="url(#shine)"/>
      <text x="${width / 2}" y="${height / 2 + logoH * 0.15}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${logoH * 0.45}" fill="${b.textColor}" letter-spacing="2">${b.name}</text>
    </svg>
  `);
}

function createCornerBadge(brand, size = 120) {
  const b = brands[brand];
  return Buffer.from(`
    <svg width="${size}" height="${size * 0.4}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size * 0.4}" rx="6" fill="${b.bg}" opacity="0.95"/>
      <text x="${size / 2}" y="${size * 0.27}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${size * 0.18}" fill="${b.textColor}">${b.name}</text>
    </svg>
  `);
}

// Product definitions
const productImages = [
  { name: "caneca-picpay", photo: "caneca", brand: "picpay" },
  { name: "camiseta-sicoob", photo: "camiseta", brand: "sicoob" },
  { name: "caderno-bradesco", photo: "caderno", brand: "bradesco" },
  { name: "caneta-xp", photo: "caneta", brand: "xp" },
  { name: "mochila-gol", photo: "mochila", brand: "gol" },
  { name: "garrafa-nubank", photo: "garrafa", brand: "nubank" },
  { name: "pendrive-bradesco", photo: "pendrive", brand: "bradesco" },
  { name: "ecobag-sicoob", photo: "ecobag", brand: "sicoob" },
  { name: "sustentavel-natura", photo: "sustentavel", brand: "natura" },
  { name: "powerbank-picpay", photo: "powerbank", brand: "picpay" },
  { name: "fones-xp", photo: "fones", brand: "xp" },
  { name: "guardachuva-gol", photo: "guardachuva", brand: "gol" },
];

const demoImages = [
  { name: "demo-caneca-bradesco", photo: "demo_caneca", brand: "bradesco" },
  { name: "demo-polo-sicoob", photo: "demo_polo", brand: "sicoob" },
  { name: "demo-caderno-xp", photo: "demo_caderno", brand: "xp" },
  { name: "demo-garrafa-picpay", photo: "demo_garrafa", brand: "picpay" },
];

async function downloadPhoto(key) {
  const cacheFile = path.join(LOGOS_DIR, `photo_${key}.jpg`);
  if (fs.existsSync(cacheFile) && fs.statSync(cacheFile).size > 10000) {
    return cacheFile;
  }
  const url = productPhotos[key];
  if (!url) throw new Error(`No photo URL for ${key}`);
  console.log(`  Downloading photo: ${key}...`);
  await downloadFile(url, cacheFile);
  console.log(`  Downloaded: ${key} (${(fs.statSync(cacheFile).size / 1024).toFixed(0)}KB)`);
  return cacheFile;
}

async function createProductImage(item) {
  const outFile = path.join(OUTPUT_DIR, `${item.name}.jpg`);
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`SKIP ${item.name} (exists)`);
    return;
  }

  console.log(`Creating ${item.name}...`);

  const photoFile = await downloadPhoto(item.photo);
  const overlay = createBrandedOverlay(item.brand, 800, 800);

  await sharp(photoFile)
    .resize(800, 800, { fit: "cover" })
    .composite([
      { input: overlay, blend: "over" },
    ])
    .jpeg({ quality: 85 })
    .toFile(outFile);

  console.log(`OK ${item.name} (${(fs.statSync(outFile).size / 1024).toFixed(0)}KB)`);
}

async function createDemoImage(item) {
  const outFile = path.join(OUTPUT_DIR, `${item.name}.jpg`);
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log(`SKIP ${item.name} (exists)`);
    return;
  }

  console.log(`Creating ${item.name}...`);

  const photoFile = await downloadPhoto(item.photo);
  const overlay = createBrandedOverlay(item.brand, 800, 800);
  const badge = createCornerBadge(item.brand, 160);

  await sharp(photoFile)
    .resize(800, 800, { fit: "cover" })
    .composite([
      { input: overlay, blend: "over" },
      { input: badge, gravity: "southeast", blend: "over" },
    ])
    .jpeg({ quality: 88 })
    .toFile(outFile);

  console.log(`OK ${item.name} (${(fs.statSync(outFile).size / 1024).toFixed(0)}KB)`);
}

async function createHeroImage() {
  const outFile = path.join(OUTPUT_DIR, "hero-brindes.jpg");
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log("SKIP hero-brindes (exists)");
    return;
  }

  console.log("Creating hero-brindes...");
  const photoFile = await downloadPhoto("hero");

  const heroOverlay = Buffer.from(`
    <svg width="1400" height="700" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e4c36" stop-opacity="0.7"/>
          <stop offset="60%" stop-color="#1e4c36" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#1e4c36" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      <rect width="1400" height="700" fill="url(#heroGrad)"/>
      <text x="700" y="300" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="64" fill="white" opacity="0.95">Brindes Corporativos</text>
      <text x="700" y="380" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="white" opacity="0.8">Personalizados com a sua marca</text>

      <rect x="200" y="460" width="130" height="50" rx="8" fill="#CC092F" opacity="0.9"/>
      <text x="265" y="492" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="white">Bradesco</text>

      <rect x="370" y="460" width="130" height="50" rx="8" fill="#21C25E" opacity="0.9"/>
      <text x="435" y="492" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="white">PicPay</text>

      <rect x="540" y="460" width="130" height="50" rx="8" fill="#003641" opacity="0.9"/>
      <text x="605" y="492" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="white">Sicoob</text>

      <rect x="710" y="460" width="130" height="50" rx="8" fill="#FF6600" opacity="0.9"/>
      <text x="775" y="492" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="16" fill="white">GOL</text>

      <rect x="880" y="460" width="130" height="50" rx="8" fill="#820AD1" opacity="0.9"/>
      <text x="945" y="492" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="white">Nubank</text>

      <rect x="1050" y="460" width="130" height="50" rx="8" fill="#000" opacity="0.9"/>
      <text x="1115" y="492" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="18" fill="#D4AF37">XP</text>
    </svg>
  `);

  await sharp(photoFile)
    .resize(1400, 700, { fit: "cover" })
    .composite([{ input: heroOverlay, blend: "over" }])
    .jpeg({ quality: 88 })
    .toFile(outFile);

  console.log(`OK hero-brindes (${(fs.statSync(outFile).size / 1024).toFixed(0)}KB)`);
}

async function createOGImage() {
  const outFile = path.join(OUTPUT_DIR, "og-image.jpg");
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 10000) {
    console.log("SKIP og-image (exists)");
    return;
  }

  console.log("Creating og-image...");

  const ogSvg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ogBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e4c36"/>
          <stop offset="100%" stop-color="#0d2a1e"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#ogBg)"/>

      <!-- Decorative circles -->
      <circle cx="950" cy="200" r="200" fill="white" opacity="0.03"/>
      <circle cx="1050" cy="400" r="150" fill="white" opacity="0.05"/>

      <!-- Brand name -->
      <text x="80" y="180" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="72" fill="white">HAMECON</text>
      <text x="80" y="260" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="white" opacity="0.8">Brindes Corporativos</text>
      <text x="80" y="310" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="white" opacity="0.8">Personalizados</text>

      <!-- Tagline -->
      <text x="80" y="400" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="white" opacity="0.6">Fortaleça sua marca com brindes de qualidade</text>

      <!-- Brand logos showcase -->
      <rect x="80" y="460" width="100" height="40" rx="6" fill="#CC092F" opacity="0.9"/>
      <text x="130" y="486" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="white">Bradesco</text>

      <rect x="200" y="460" width="100" height="40" rx="6" fill="#21C25E" opacity="0.9"/>
      <text x="250" y="486" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="white">PicPay</text>

      <rect x="320" y="460" width="100" height="40" rx="6" fill="#003641" opacity="0.9"/>
      <text x="370" y="486" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="white">Sicoob</text>

      <rect x="440" y="460" width="100" height="40" rx="6" fill="#FF6600" opacity="0.9"/>
      <text x="490" y="486" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="white">GOL</text>

      <rect x="560" y="460" width="100" height="40" rx="6" fill="#820AD1" opacity="0.9"/>
      <text x="610" y="486" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="white">Nubank</text>

      <rect x="680" y="460" width="100" height="40" rx="6" fill="#000" opacity="0.9"/>
      <text x="730" y="486" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="14" fill="#D4AF37">XP</text>

      <!-- Product icons grid on right -->
      <rect x="800" y="80" width="160" height="160" rx="16" fill="white" opacity="0.08"/>
      <text x="880" y="175" text-anchor="middle" font-family="Arial" font-size="50" fill="white" opacity="0.4">☕</text>

      <rect x="990" y="80" width="160" height="160" rx="16" fill="white" opacity="0.08"/>
      <text x="1070" y="175" text-anchor="middle" font-family="Arial" font-size="50" fill="white" opacity="0.4">👕</text>

      <rect x="800" y="270" width="160" height="160" rx="16" fill="white" opacity="0.08"/>
      <text x="880" y="365" text-anchor="middle" font-family="Arial" font-size="50" fill="white" opacity="0.4">📓</text>

      <rect x="990" y="270" width="160" height="160" rx="16" fill="white" opacity="0.08"/>
      <text x="1070" y="365" text-anchor="middle" font-family="Arial" font-size="50" fill="white" opacity="0.4">🎒</text>

      <!-- URL -->
      <text x="80" y="580" font-family="Arial" font-size="18" fill="white" opacity="0.5">hamecon.com.br</text>
    </svg>
  `);

  await sharp(ogSvg).jpeg({ quality: 90 }).toFile(outFile);
  console.log(`OK og-image (${(fs.statSync(outFile).size / 1024).toFixed(0)}KB)`);
}

async function createFavicon() {
  const outFile32 = path.join(OUTPUT_DIR, "../favicon.ico");
  console.log("Creating favicon...");

  const faviconSvg = Buffer.from(`
    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#1e4c36"/>
      <text x="32" y="45" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="36" fill="white">H</text>
    </svg>
  `);

  await sharp(faviconSvg).resize(32, 32).png().toFile(path.join(OUTPUT_DIR, "../favicon.png"));

  // Also create apple-touch-icon
  await sharp(faviconSvg).resize(180, 180).png().toFile(path.join(OUTPUT_DIR, "apple-touch-icon.png"));

  console.log("OK favicon");
}

async function main() {
  console.log("=== Hamecon Image Generator ===\n");

  // Create OG image and favicon (no downloads needed)
  console.log("--- Creating OG Image & Favicon ---");
  await createOGImage();
  await createFavicon();

  // Download photos and create product images
  console.log("\n--- Creating Product Images ---");
  for (const item of productImages) {
    try {
      await createProductImage(item);
    } catch (err) {
      console.error(`FAIL ${item.name}: ${err.message}`);
    }
  }

  // Create demo images
  console.log("\n--- Creating Demo Showcase Images ---");
  for (const item of demoImages) {
    try {
      await createDemoImage(item);
    } catch (err) {
      console.error(`FAIL ${item.name}: ${err.message}`);
    }
  }

  // Create hero
  console.log("\n--- Creating Hero Image ---");
  try {
    await createHeroImage();
  } catch (err) {
    console.error(`FAIL hero: ${err.message}`);
  }

  // Summary
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".jpg") || f.endsWith(".png"));
  console.log(`\n=== Done! ${files.length} images created in public/images/ ===`);
  for (const f of files) {
    const s = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f} (${(s.size / 1024).toFixed(0)}KB)`);
  }
}

main().catch(console.error);
