<<<<<<< HEAD
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Saf PNG Oluşturucu (Harici kütüphane gerektirmez)
function createSolidPNG(width, height, r, g, b, innerLetter = true) {
  // RGBA buffer
  const rowSize = width * 4 + 1; // +1 filter byte
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    rawData[rowStart] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + (x * 4);

      // Zemin: Mor (#6366f1)
      let pr = r, pg = g, pb = b, pa = 255;

      // İçine beyaz "T" veya "LT" benzeri kontrast çizim
      if (innerLetter) {
        const isTBar = (y >= Math.floor(height * 0.22) && y <= Math.floor(height * 0.35) &&
                        x >= Math.floor(width * 0.25) && x <= Math.floor(width * 0.75));
        const isTStem = (y >= Math.floor(height * 0.35) && y <= Math.floor(height * 0.78) &&
                         x >= Math.floor(width * 0.42) && x <= Math.floor(width * 0.58));

        if (isTBar || isTStem) {
          pr = 255; pg = 255; pb = 255; // Beyaz
        }
      }

      rawData[px] = pr;
      rawData[px + 1] = pg;
      rawData[px + 2] = pb;
      rawData[px + 3] = pa;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Çerçevesi
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0);
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr[16] = 8; // 8 bit
  ihdr[17] = 6; // RGBA
  ihdr[18] = 0;
  ihdr[19] = 0;
  ihdr[20] = 0;
  const ihdrCrc = crc32(ihdr.subarray(4, 21));
  ihdr.writeInt32BE(ihdrCrc, 21);

  // IDAT
  const idatHeader = Buffer.alloc(8);
  idatHeader.writeUInt32BE(compressed.length, 0);
  idatHeader.write('IDAT', 4);
  const idatCrcVal = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatFooter = Buffer.alloc(4);
  idatFooter.writeInt32BE(idatCrcVal, 0);

  // IEND
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idatHeader, compressed, idatFooter, iend]);
}

// CRC32 Tablosu
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return crc ^ -1;
}

const table = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1);
  }
  table[i] = c;
}

// Dosyaları chrome-extension klasörüne yaz
const extDir = path.join(__dirname, 'chrome-extension');
if (!fs.existsSync(extDir)) fs.mkdirSync(extDir, { recursive: true });

fs.writeFileSync(path.join(extDir, 'icon16.png'), createSolidPNG(16, 16, 99, 102, 241));
fs.writeFileSync(path.join(extDir, 'icon48.png'), createSolidPNG(48, 48, 99, 102, 241));
fs.writeFileSync(path.join(extDir, 'icon128.png'), createSolidPNG(128, 128, 99, 102, 241));

=======
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Saf PNG Oluşturucu (Harici kütüphane gerektirmez)
function createSolidPNG(width, height, r, g, b, innerLetter = true) {
  // RGBA buffer
  const rowSize = width * 4 + 1; // +1 filter byte
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    rawData[rowStart] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + (x * 4);

      // Zemin: Mor (#6366f1)
      let pr = r, pg = g, pb = b, pa = 255;

      // İçine beyaz "T" veya "LT" benzeri kontrast çizim
      if (innerLetter) {
        const isTBar = (y >= Math.floor(height * 0.22) && y <= Math.floor(height * 0.35) &&
                        x >= Math.floor(width * 0.25) && x <= Math.floor(width * 0.75));
        const isTStem = (y >= Math.floor(height * 0.35) && y <= Math.floor(height * 0.78) &&
                         x >= Math.floor(width * 0.42) && x <= Math.floor(width * 0.58));

        if (isTBar || isTStem) {
          pr = 255; pg = 255; pb = 255; // Beyaz
        }
      }

      rawData[px] = pr;
      rawData[px + 1] = pg;
      rawData[px + 2] = pb;
      rawData[px + 3] = pa;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Çerçevesi
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0);
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr[16] = 8; // 8 bit
  ihdr[17] = 6; // RGBA
  ihdr[18] = 0;
  ihdr[19] = 0;
  ihdr[20] = 0;
  const ihdrCrc = crc32(ihdr.subarray(4, 21));
  ihdr.writeInt32BE(ihdrCrc, 21);

  // IDAT
  const idatHeader = Buffer.alloc(8);
  idatHeader.writeUInt32BE(compressed.length, 0);
  idatHeader.write('IDAT', 4);
  const idatCrcVal = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idatFooter = Buffer.alloc(4);
  idatFooter.writeInt32BE(idatCrcVal, 0);

  // IEND
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idatHeader, compressed, idatFooter, iend]);
}

// CRC32 Tablosu
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return crc ^ -1;
}

const table = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1);
  }
  table[i] = c;
}

// Dosyaları chrome-extension klasörüne yaz
const extDir = path.join(__dirname, 'chrome-extension');
if (!fs.existsSync(extDir)) fs.mkdirSync(extDir, { recursive: true });

fs.writeFileSync(path.join(extDir, 'icon16.png'), createSolidPNG(16, 16, 99, 102, 241));
fs.writeFileSync(path.join(extDir, 'icon48.png'), createSolidPNG(48, 48, 99, 102, 241));
fs.writeFileSync(path.join(extDir, 'icon128.png'), createSolidPNG(128, 128, 99, 102, 241));

>>>>>>> e4103121aaa96aaed50a8b4e878a145d33f1e1ba
console.log('✔ icon16.png, icon48.png, icon128.png başarıyla oluşturuldu!');