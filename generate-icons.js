const fs = require('fs');
const path = require('path');

// Yüksek çözünürlüklü modern SVG logo şablonu
const svgLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Arka plan degradesi -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>

    <!-- Sol L/Çeviri kanadı (Cyan) -->
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>

    <!-- Çeviri Köprüsü Işıltısı -->
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="1"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Yuvarlatılmış Arka Plan Kartı -->
  <rect width="512" height="512" rx="120" fill="url(#bgGrad)"/>
  <rect x="3" y="3" width="506" height="506" rx="117" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>

  <!-- Arka Parıltı -->
  <circle cx="280" cy="260" r="160" fill="url(#glow)"/>

  <!-- Sol Kanat (Lumina - L) -->
  <path d="M 130 180 L 195 180 C 195 290 195 290 195 300 C 195 315 205 325 220 325 L 265 325 C 265 355 250 370 220 370 L 160 370 C 140 370 130 355 130 335 Z" fill="url(#cyanGrad)"/>

  <!-- Sağ Kanat (Translate - T) -->
  <path d="M 230 180 L 380 180 C 390 180 395 188 395 198 L 395 225 C 395 235 390 240 380 240 L 330 240 L 330 360 C 330 370 322 375 312 375 L 285 375 C 275 375 270 370 270 360 L 270 240 L 230 240 C 220 240 215 235 215 225 L 215 198 C 215 188 220 180 230 180 Z" fill="#ffffff"/>

  <!-- Kesişim Noktası (Çeviri Enerji Çekirdeği) -->
  <circle cx="270" cy="285" r="22" fill="#a855f7"/>
  <circle cx="270" cy="285" r="12" fill="#f8fafc"/>
</svg>
`;

// Klasörlerin varlığını kontrol et
const publicDir = path.join(__dirname, 'public');
const extDir = path.join(__dirname, 'chrome-extension');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(extDir)) fs.mkdirSync(extDir, { recursive: true });

// SVG logoyu kaydet
fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgLogo);
fs.writeFileSync(path.join(extDir, 'logo.svg'), svgLogo);

console.log('✔ SVG Logolar oluşturuldu!');
const fs = require('fs');
const path = require('path');

// Yüksek çözünürlüklü modern SVG logo şablonu
const svgLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Arka plan degradesi -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>

    <!-- Sol L/Çeviri kanadı (Cyan) -->
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>

    <!-- Çeviri Köprüsü Işıltısı -->
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="1"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Yuvarlatılmış Arka Plan Kartı -->
  <rect width="512" height="512" rx="120" fill="url(#bgGrad)"/>
  <rect x="3" y="3" width="506" height="506" rx="117" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>

  <!-- Arka Parıltı -->
  <circle cx="280" cy="260" r="160" fill="url(#glow)"/>

  <!-- Sol Kanat (Lumina - L) -->
  <path d="M 130 180 L 195 180 C 195 290 195 290 195 300 C 195 315 205 325 220 325 L 265 325 C 265 355 250 370 220 370 L 160 370 C 140 370 130 355 130 335 Z" fill="url(#cyanGrad)"/>

  <!-- Sağ Kanat (Translate - T) -->
  <path d="M 230 180 L 380 180 C 390 180 395 188 395 198 L 395 225 C 395 235 390 240 380 240 L 330 240 L 330 360 C 330 370 322 375 312 375 L 285 375 C 275 375 270 370 270 360 L 270 240 L 230 240 C 220 240 215 235 215 225 L 215 198 C 215 188 220 180 230 180 Z" fill="#ffffff"/>

  <!-- Kesişim Noktası (Çeviri Enerji Çekirdeği) -->
  <circle cx="270" cy="285" r="22" fill="#a855f7"/>
  <circle cx="270" cy="285" r="12" fill="#f8fafc"/>
</svg>
`;

// Klasörlerin varlığını kontrol et
const publicDir = path.join(__dirname, 'public');
const extDir = path.join(__dirname, 'chrome-extension');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(extDir)) fs.mkdirSync(extDir, { recursive: true });

// SVG logoyu kaydet
fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgLogo);
fs.writeFileSync(path.join(extDir, 'logo.svg'), svgLogo);

console.log('✔ SVG Logolar oluşturuldu!');
console.log('✔ PNG dönüştürmesi başlatılıyor...');