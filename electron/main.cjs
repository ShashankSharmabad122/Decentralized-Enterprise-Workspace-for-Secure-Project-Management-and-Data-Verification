const { app, BrowserWindow, shell, nativeTheme, screen } = require('electron');
const path = require('path');

// Force dark theme to match dOS aesthetic
nativeTheme.themeSource = 'dark';

let mainWindow;

function createWindow() {
  // Get primary display size for smart default sizing
  const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;

  const winW = Math.min(1440, Math.round(screenW * 0.92));
  const winH = Math.min(900,  Math.round(screenH * 0.92));

  mainWindow = new BrowserWindow({
    width:     winW,
    height:    winH,
    minWidth:  480,      // allow mobile-like width testing
    minHeight: 480,
    x: Math.round((screenW - winW) / 2),
    y: Math.round((screenH - winH) / 2),
    title:     'dOS — Decentralized Enterprise Workspace',
    backgroundColor: '#040d14',
    autoHideMenuBar: true,
    frame:     true,
    // Transparent title bar for modern look on macOS / Windows 11
    titleBarStyle:   process.platform === 'darwin' ? 'hiddenInset' : 'default',
    titleBarOverlay: process.platform === 'win32' ? {
      color:        '#040d14',
      symbolColor:  '#4a9ab5',
      height:       40,
    } : undefined,
    icon: path.join(__dirname, '../public/icon.png').replace(/\\/g, '/'),
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      webSecurity:      true,
      preload:          path.join(__dirname, 'preload.cjs'),
      // Allow WebGL (required for Three.js ice crystal scene)
      experimentalFeatures: true,
    },
    show: false,   // show after ready-to-show to avoid white flash
  });

  // ── Graceful show (no white flash) ──────────────────────────
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // ── Open external links in system browser ───────────────────
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // ── Load app ────────────────────────────────────────────────
  const isDev  = process.env.NODE_ENV === 'development' || !app.isPackaged;
  // Support VITE_DEV_SERVER_URL override, fall back to 3000 (tsx server.ts default)
  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';

  if (isDev) {
    mainWindow.loadURL(devUrl);
    // DevTools in a detached window so it doesn't shrink the app
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
