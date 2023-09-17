import path from "path"
import fs from 'fs'

import { isDev, isDebugProduction } from './config'
import { app, BrowserWindow, Menu, ipcMain} from 'electron';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

import menu from './menu'
import { NotificationIPC, BackupIPC, AppStartIPC } from './sharedTypes'

const BACKUPS_DIR = path.resolve(app.getPath('documents'), app.name, 'backups')
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

Menu.setApplicationMenu(menu)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: isDev || isDebugProduction ? 1000 : 800,
    height: isDev || isDebugProduction ? 1000 : 600,
    x: 0,
    y: 0,
    title: isDev ? "DEV MODE" : "Todo Today",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: isDev || isDebugProduction,
      spellcheck: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('app-start', async () => {
  return {
    backupDir: BACKUPS_DIR
  } as AppStartIPC
})

ipcMain.handle('backup', async (event, arg: BackupIPC) => {
  try {
    fs.writeFileSync(path.resolve(BACKUPS_DIR, arg.filename), arg.data, 'utf8');
    return { isSuccess: true, moreData: 'hi' }
  } catch (e) {
    return { isSuccess: false, message: JSON.stringify(e) }
  }
})
