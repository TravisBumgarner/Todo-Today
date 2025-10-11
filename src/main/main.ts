import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Notification,
  shell,
} from 'electron'
import log from 'electron-log/main'
import started from 'electron-squirrel-startup'
import moment from 'moment'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path, { join, resolve } from 'node:path'
import { updateElectronApp } from 'update-electron-app'
import './messages/messages'
import {
  EAsyncMessageIPCFromMain,
  EAsyncMessageIPCFromRenderer,
  ESyncMessageIPC,
  type AppStartIPCFromMain,
  type AsyncBackupIPCFromMain,
  type AsyncBackupIPCFromRenderer,
  type AsyncNotificationIPCFromRenderer,
} from '../shared/types'
import { DATE_BACKUP_DATE } from '../shared/utilities'
import { isDebugProduction, isDev } from './config'
import menu from './menu'

log.initialize()

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

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: isDev ? 'DEV MODE' : 'Todo Today',
    // icon: join(process.env.VITE_PUBLIC, 'icon.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    )
  }

  mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

Menu.setApplicationMenu(menu)

const BACKUPS_DIR = resolve(app.getPath('documents'), app.name, 'backups')
if (!existsSync(BACKUPS_DIR)) {
  mkdirSync(BACKUPS_DIR, { recursive: true })
}

ipcMain.handle(
  ESyncMessageIPC.AppStart,
  async (): Promise<AppStartIPCFromMain['body']> => {
    return {
      backupDir: BACKUPS_DIR,
    }
  },
)

// ipcMain.on(
//   EAsyncMessageIPCFromRenderer.CreateBackup,
//   async (event, arg: AsyncBackupIPCFromRenderer["body"]) => {
//     if (win) {
//       try {
//         writeFileSync(resolve(BACKUPS_DIR, arg.filename), arg.data, "utf8");
//         const message: AsyncBackupIPCFromMain["body"] = {
//           success: true,
//           timestamp: moment().format(DATE_BACKUP_DATE),
//         };
//         win.webContents.send(EAsyncMessageIPCFromMain.BackupCompleted, message);
//       } catch (e) {
//         const message: AsyncBackupIPCFromMain["body"] = { success: false };
//         win.webContents.send(EAsyncMessageIPCFromMain.BackupCompleted, message);
//       }
//     } else {
//       log.error(
//         EAsyncMessageIPCFromMain.BackupCompleted,
//         "No window available"
//       );
//     }
//   }
// );
