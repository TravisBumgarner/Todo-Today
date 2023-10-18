import { Menu, app, BrowserWindow, shell, ipcMain, Notification } from 'electron'
import { release } from 'node:os'
import { join, resolve } from 'node:path'
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

import { update } from './update'
import menu from './menu'
import { isDev, isDebugProduction } from './config'
import { type BackupIPCFromRenderer, EMessageIPCFromRenderer, type NotificationIPCFromRenderer } from '../../shared/types'

Menu.setApplicationMenu(menu)

log.info('backend logs intialized')
log.transports.file.level = 'info'
autoUpdater.logger = log

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    title: isDev ? 'DEV MODE' : 'Todo Today',
    icon: join(process.env.VITE_PUBLIC, 'icon.icns'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (url) { // electron-vite-vue#298
    await win.loadURL(url)
    // Open devTool if the app is not` packaged
    win.webContents.openDevTools()
  } else {
    if (isDebugProduction) {
      win.webContents.openDevTools()
    }
    await win.loadFile(indexHtml)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) void shell.openExternal(url)
    return { action: 'deny' }
  })

  win.once('ready-to-show', () => {
    void autoUpdater.checkForUpdatesAndNotify()
  })

  // Apply electron-updater
  update(win)
}

void app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    void createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    void childWindow.loadURL(`${url}#${arg}`)
  } else {
    void childWindow.loadFile(indexHtml, { hash: arg })
  }
})

const BACKUPS_DIR = resolve(app.getPath('documents'), app.name, 'backups')
if (!existsSync(BACKUPS_DIR)) {
  mkdirSync(BACKUPS_DIR, { recursive: true })
}

ipcMain.handle(EMessageIPCFromRenderer.AppStart, async () => {
  return {
    backupDir: BACKUPS_DIR
  }
})

ipcMain.handle(EMessageIPCFromRenderer.Backup, async (event, arg: BackupIPCFromRenderer['body']) => {
  try {
    writeFileSync(resolve(BACKUPS_DIR, arg.filename), arg.data, 'utf8')
    return { isSuccess: true, moreData: 'hi' }
  } catch (e) {
    return { isSuccess: false, message: JSON.stringify(e) }
  }
})

ipcMain.handle(EMessageIPCFromRenderer.Notification, async (event: any, arg: NotificationIPCFromRenderer['body']) => {
  new Notification(arg).show()
})

autoUpdater.on('update-available', () => {
  log.info('update-available')
  if (win) {
    win.webContents.send('update_available')
    void autoUpdater.downloadUpdate()
  } else {
    log.error('update-available - No window available')
  }
})

autoUpdater.on('update-downloaded', () => {
  log.info('update-downloaded')
  if (win) {
    win.webContents.send('update_downloaded')
  } else {
    log.error('update-downloaded - No window available')
  }
})

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall()
})
