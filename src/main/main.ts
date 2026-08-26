import path from 'node:path'
import { app, BrowserWindow, Menu, nativeImage, shell, Tray } from 'electron'
import log from 'electron-log/main'
import started from 'electron-squirrel-startup'
import { UpdateSourceType, updateElectronApp } from 'update-electron-app'
import { isDev, isMac } from './config'
import menu from './menu'
import './messages/messages'
import store, { getStore } from './store'

log.initialize()
Menu.setApplicationMenu(menu)

updateElectronApp({
  // update.electronjs.org matches the owner/repo path case-sensitively and only
  // serves the all-lowercase form. Inferring the repo from package.json's
  // repository URL yields "TravisBumgarner/todo-today", which the service answers
  // with 204 (no update) — silently breaking auto-update. Pin the lowercase path.
  updateSource: {
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: 'travisbumgarner/todo-today',
  },
  logger: {
    log: log.log,
    info: log.info,
    warn: log.warn,
    error: log.error,
  },
})

// Something something Windows. Not currently supported, will just leave it.
if (started) {
  app.quit()
}

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
// Set while we're recreating the window to switch modes, so window-all-closed
// doesn't misread the brief windowless moment as the app being done.
let isSwitchingMode = false
// Timestamp of the last blur-triggered hide. When the user clicks the tray
// icon on a focused popover, the blur fires *first* and hides it; without this
// guard the click handler would immediately reopen it (flicker + no dismiss).
let lastBlurHideAt = 0

// Menu-bar popover mode is macOS-only; elsewhere the setting is a no-op and
// the app stays a normal window.
const isPopoverMode = () => isMac && getStore().showInMenuBar

// Where the icon PNGs live at runtime. In dev `__dirname` is `.vite/build`, so
// they're read straight out of the repo's `public/`. Packaged, `public/` isn't
// in the asar at all (the Vite plugin only packages `.vite/`), so they're copied
// in via forge's `extraResource` and read from the resources directory instead.
const iconsDir = () =>
  app.isPackaged ? path.join(process.resourcesPath, 'icons') : path.join(__dirname, '../../public/icons')

// A simple "TO" glyph sized for the menu bar. Electron picks up the matching
// @2x file automatically for retina displays.
const trayIconPath = () => path.join(iconsDir(), 'trayTemplate.png')

// Position the popover horizontally centred under the tray icon, just below
// the menu bar.
const positionPopover = () => {
  if (!mainWindow || !tray) return
  const trayBounds = tray.getBounds()
  const winBounds = mainWindow.getBounds()
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2)
  const y = Math.round(trayBounds.y + trayBounds.height)
  mainWindow.setPosition(x, y, false)
}

const showPopover = () => {
  if (!mainWindow) return
  positionPopover()
  mainWindow.show()
  mainWindow.focus()
}

// Tray-icon click: dismiss if open, otherwise open — with a guard so the blur
// that this same click triggered doesn't cause an immediate reopen.
const togglePopover = () => {
  if (!mainWindow) return
  if (mainWindow.isVisible()) {
    mainWindow.hide()
    return
  }
  if (Date.now() - lastBlurHideAt < 250) return
  showPopover()
}

const ensureTray = () => {
  if (tray) return
  const image = nativeImage.createFromPath(trayIconPath())
  // A missing file yields an empty image and an invisible-but-clickable tray
  // slot, which is near-impossible to spot in a built app. Say so in the log.
  if (image.isEmpty()) {
    log.error(`Tray icon missing or unreadable at ${trayIconPath()}`)
  }
  // On macOS a template image is drawn black on a light menu bar and white on
  // a dark one, so the OS handles both variants from the single black asset.
  if (isMac) {
    image.setTemplateImage(true)
  }
  tray = new Tray(image)
  tray.setToolTip('Todo Today')
  tray.on('click', togglePopover)
  // Right-click gives an escape hatch to quit, since popover mode has no
  // dock icon or window chrome.
  tray.on('right-click', () => {
    tray?.popUpContextMenu(
      Menu.buildFromTemplate([
        { label: 'Show Todo Today', click: showPopover },
        { type: 'separator' },
        {
          label: 'Quit',
          click: () => {
            app.quit()
          },
        },
      ]),
    )
  })
}

const destroyTray = () => {
  tray?.destroy()
  tray = null
}

const createWindow = () => {
  // Platform-specific icon paths
  let iconPath: string
  if (process.platform === 'darwin') {
    iconPath = path.join(iconsDir(), 'icon.icns')
  } else if (process.platform === 'win32') {
    iconPath = path.join(iconsDir(), 'icon.ico')
  } else {
    iconPath = path.join(iconsDir(), 'icon.png')
  }

  const popover = isPopoverMode()

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    // A popover is a frameless, non-taskbar window that starts hidden until
    // the tray icon is clicked and floats above other windows.
    show: !popover,
    frame: !popover,
    skipTaskbar: popover,
    resizable: !popover,
    alwaysOnTop: popover,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Open external links (e.g. from task details) in the default browser rather
  // than navigating the app window or spawning an Electron window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^(https?:\/\/|mailto:)/i.test(url)) {
      void shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  if (popover) {
    void app.dock?.hide()
    // Let the popover appear over full-screen apps and on every Space.
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    ensureTray()
    // Clicking anywhere outside the window hides it — the core "glance and go"
    // behavior. Keep it open while devtools are focused so debugging works.
    mainWindow.on('blur', () => {
      if (mainWindow?.webContents.isDevToolsOpened()) return
      mainWindow?.hide()
      lastBlurHideAt = Date.now()
    })
  } else {
    void app.dock?.show()
    destroyTray()
  }

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }
}

// Tear down the current window and rebuild it in the mode the setting now
// dictates. Renderer state lives in IndexedDB, so a reload loses nothing.
const rebuildWindowForMode = () => {
  isSwitchingMode = true
  const previous = mainWindow
  mainWindow = null
  previous?.destroy()
  createWindow()
  isSwitchingMode = false
}

app.on('ready', createWindow)

// Apply the popover/window choice immediately when it's toggled in Settings,
// without requiring a restart.
store.onDidChange('showInMenuBar', () => {
  if (!isMac) return
  rebuildWindowForMode()
})

app.on('window-all-closed', () => {
  // In popover mode the window is only ever hidden (not destroyed) during
  // normal use, and mode switches set isSwitchingMode, so a real
  // window-all-closed here means the user is done.
  if (isSwitchingMode) return
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else if (isPopoverMode()) {
    showPopover()
  } else {
    mainWindow?.show()
    mainWindow?.focus()
  }
})
