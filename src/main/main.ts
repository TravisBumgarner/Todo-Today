import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import log from 'electron-log/main'
import started from 'electron-squirrel-startup'
import path from 'node:path'
import { updateElectronApp } from 'update-electron-app'
import { isDev, isMac } from './config'
import menu from './menu'
import './messages/messages'
import { getStore } from './store'

log.initialize()
Menu.setApplicationMenu(menu)

updateElectronApp({
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
// Set to true only when the user genuinely wants to exit, so the tray "close"
// interception below can distinguish a real quit from a hide-to-tray.
let isQuitting = false

app.on('before-quit', () => {
  isQuitting = true
})

// Reveal the window and (on macOS) the dock icon, tearing down the tray.
const showMainWindow = () => {
  if (mainWindow) {
    mainWindow.show()
    mainWindow.focus()
  }
  if (isMac) {
    void app.dock?.show()
  }
  if (tray) {
    tray.destroy()
    tray = null
  }
}

// Hide the window into the status bar (system tray) instead of closing.
const hideToTray = () => {
  if (mainWindow) {
    mainWindow.hide()
  }
  // Dropping the dock icon is what makes this a true "status bar only" mode.
  if (isMac) {
    void app.dock?.hide()
  }
  if (tray) {
    return
  }

  const trayIconPath = path.join(__dirname, '../../public/icons/icon.png')
  const trayImage = nativeImage.createFromPath(trayIconPath).resize({ width: 16, height: 16 })
  // Template images adapt to light/dark menu bars on macOS.
  if (isMac) {
    trayImage.setTemplateImage(true)
  }

  tray = new Tray(trayImage)
  tray.setToolTip('Todo Today')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Show Todo Today', click: showMainWindow },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          isQuitting = true
          app.quit()
        },
      },
    ]),
  )
  // Clicking the tray icon itself restores the window.
  tray.on('click', showMainWindow)
}

const createWindow = () => {
  // Platform-specific icon paths
  let iconPath: string
  if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, '../../public/icons/icon.icns')
  } else if (process.platform === 'win32') {
    iconPath = path.join(__dirname, '../../public/icons/icon.ico')
  } else {
    iconPath = path.join(__dirname, '../../public/icons/icon.png')
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // When "minimize to status bar" is enabled, closing the window hides it to
  // the tray instead of quitting. A real quit (menu → Quit, tray → Quit,
  // app.quit()) sets isQuitting and falls through to the default behavior.
  mainWindow.on('close', (event) => {
    if (!isQuitting && getStore().minimizeToTray) {
      event.preventDefault()
      hideToTray()
    }
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // With minimize-to-tray the window is hidden (not destroyed), so this only
  // fires on a genuine close. Keep the macOS convention of staying alive.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    showMainWindow()
  }
})
