const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage, ipcMain, screen, clipboard, desktopCapturer } = require('electron');
const path = require('path');
const express = require('express');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

app.on('second-instance', () => {
  if (mainWindow) {
    centerWindowOnActiveDisplay();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.setLoginItemSettings({
  openAtLogin: true,
  path: process.execPath,
  args: [path.resolve(__dirname)]
});

const serverApp = express();
serverApp.use(express.json({ limit: '50mb' }));

serverApp.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

serverApp.use(express.static(path.join(__dirname, 'public')));

async function requestGoogleTranslate(text, sourceLang, targetLang) {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  try {
    const url1 = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res1 = await fetch(url1, { headers: { 'User-Agent': userAgent } });
    if (res1.ok) {
      const data = await res1.json();
      return data[0].map(item => item[0]).join('');
    }
  } catch (err) {}

  try {
    const url2 = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(text)}`;
    const res2 = await fetch(url2, { headers: { 'User-Agent': userAgent } });
    if (res2.ok) {
      const data = await res2.json();
      if (Array.isArray(data)) return data.join(' ');
      if (typeof data === 'string') return data;
      if (data && data.sentences) return data.sentences.map(s => s.trans).join('');
    }
  } catch (err) {}

  throw new Error('Çeviri yapılamadı.');
}

function applyTone(text, tone, targetLang) {
  if (!text || tone === 'standard') return text;

  if (targetLang === 'tr') {
    if (tone === 'formal') {
      return text
        .replace(/\bsen\b/gi, 'siz')
        .replace(/\bsana\b/gi, 'size')
        .replace(/\bsenin\b/gi, 'sizin')
        .replace(/\bsende\b/gi, 'sizde')
        .replace(/\bsenden\b/gi, 'sizden')
        .replace(/yap\b/gi, 'yapınız')
        .replace(/et\b/gi, 'ediniz')
        .replace(/bak\b/gi, 'inceleyiniz')
        .replace(/bilgi ver\b/gi, 'bilgilendirmenizi rica ederiz');
    } else if (tone === 'casual') {
      return text
        .replace(/\bsiz\b/gi, 'sen')
        .replace(/\bsize\b/gi, 'sana')
        .replace(/\bsizin\b/gi, 'senin')
        .replace(/\bediniz\b/gi, 'et')
        .replace(/\byapınız\b/gi, 'yap')
        .replace(/merhaba/gi, 'selam');
    }
  }
  return text;
}

serverApp.post('/api/translate', async (req, res) => {
  const { text, sourceLang = 'auto', targetLang = 'tr', tone = 'standard' } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Metin gereklidir.' });

  try {
    let rawTranslation = await requestGoogleTranslate(text, sourceLang, targetLang);
    const translatedText = applyTone(rawTranslation, tone, targetLang);
    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: 'Çeviri hatası oluştu.' });
  }
});

serverApp.post('/api/open-with-text', (req, res) => {
  const { text } = req.body;
  if (text && mainWindow) {
    centerWindowOnActiveDisplay();
    mainWindow.show();
    mainWindow.setAlwaysOnTop(true);
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);

    mainWindow.webContents.send('set-and-translate', text.trim());
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Metin alınamadı.' });
  }
});

serverApp.listen(3456, '127.0.0.1');

let mainWindow = null;
let overlayWindow = null;
let tray = null;
let lastKnownClipboard = '';

function centerWindowOnActiveDisplay() {
  if (!mainWindow) return;
  const cursorPoint = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
  const { x, y, width, height } = currentDisplay.bounds;
  const [winWidth, winHeight] = mainWindow.getSize();

  const centerX = Math.round(x + (width - winWidth) / 2);
  const centerY = Math.round(y + (height - winHeight) / 2);

  mainWindow.setPosition(centerX, centerY);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 820,
    height: 520,
    minWidth: 500,
    minHeight: 350,
    show: false,
    frame: false,
    transparent: true,
    resizable: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL('http://127.0.0.1:3456');

  mainWindow.on('blur', () => {
    if (!overlayWindow) {
      mainWindow.hide();
    }
  });
}

function toggleWindow() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    centerWindowOnActiveDisplay();
    mainWindow.show();
    mainWindow.focus();

    const clipText = clipboard.readText().trim();
    if (clipText && clipText !== lastKnownClipboard && clipText.length < 3000) {
      lastKnownClipboard = clipText;
      mainWindow.webContents.send('set-and-translate', clipText);
    } else {
      mainWindow.webContents.executeJavaScript(`
        const el = document.getElementById('sourceText');
        if (el) { el.focus(); el.select(); }
      `);
    }
  }
}

// Ekran yakalama: Doğrudan o anki monitörün fiziksel görüntüsünü alır
async function startSnipping() {
  if (mainWindow) mainWindow.hide();

  const cursorPoint = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint(cursorPoint);
  const { x, y, width, height } = currentDisplay.bounds;

  try {
    const scale = currentDisplay.scaleFactor || 1;
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: Math.round(width * scale),
        height: Math.round(height * scale)
      }
    });

    // Aktif ekranın indexini bul
    const allDisplays = screen.getAllDisplays();
    const displayIndex = allDisplays.findIndex(d => d.id === currentDisplay.id);
    const chosenSource = sources[displayIndex] || sources[0];
    const screenDataUrl = chosenSource.thumbnail.toDataURL();

    overlayWindow = new BrowserWindow({
      x: x,
      y: y,
      width: width,
      height: height,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      hasShadow: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    overlayWindow.loadFile(path.join(__dirname, 'public', 'snipper.html'));

    overlayWindow.webContents.on('did-finish-load', () => {
      overlayWindow.webContents.send('init-snip', screenDataUrl);
    });

    overlayWindow.on('closed', () => {
      overlayWindow = null;
    });
  } catch (err) {
    console.error('Ekran alma hatası:', err);
    if (mainWindow) {
      centerWindowOnActiveDisplay();
      mainWindow.show();
    }
  }
}

ipcMain.on('hide-window', () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.on('copy-and-close', (event, text) => {
  if (text) clipboard.writeText(text);
  if (mainWindow) mainWindow.hide();
});

ipcMain.on('start-snipping', () => {
  startSnipping();
});

ipcMain.on('cancel-snipping', () => {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }
  if (mainWindow) {
    centerWindowOnActiveDisplay();
    mainWindow.show();
  }
});

// Snipper kırpılmış temiz resmi direkt yollar
ipcMain.on('snipping-done', (event, croppedDataUrl) => {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }

  if (mainWindow) {
    centerWindowOnActiveDisplay();
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.send('process-ocr', croppedDataUrl);
  }
});

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('CommandOrControl+Alt+T', () => {
    toggleWindow();
  });

  const size = 16;
  const buffer = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      if (x >= 1 && x <= 14 && y >= 1 && y <= 14) {
        const isTBar = (y >= 3 && y <= 4 && x >= 4 && x <= 11);
        const isTStem = (y >= 5 && y <= 12 && x >= 7 && x <= 8);

        if (isTBar || isTStem) {
          buffer[idx] = 255;
          buffer[idx + 1] = 255;
          buffer[idx + 2] = 255;
          buffer[idx + 3] = 255;
        } else {
          buffer[idx] = 99;
          buffer[idx + 1] = 102;
          buffer[idx + 2] = 241;
          buffer[idx + 3] = 255;
        }
      } else {
        buffer[idx + 3] = 0;
      }
    }
  }

  const trayIcon = nativeImage.createFromBuffer(buffer, { width: size, height: size });
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Çeviriciyi Aç (Ctrl+Alt+T)', click: () => toggleWindow() },
    { type: 'separator' },
    { label: 'Çıkış', click: () => app.quit() }
  ]);

  tray.setToolTip('Lumina Translate (Ctrl+Alt+T)');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => toggleWindow());

  console.log('Lumina Translate aktif!');
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
