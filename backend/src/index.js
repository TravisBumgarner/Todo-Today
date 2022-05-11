const path = require("path");
const fs = require('fs')

const contextMenu = require('electron-context-menu');
const { app, BrowserWindow, ipcMain, Menu } = require('electron')

const menu = require('./menu')

const isDev = process.env.NODE_ENV === 'local'
const isDebugProduction = false // Set to True to debug
if (isDev) require('electron-reloader')(module)
let mainWindow

contextMenu({showInspectElement: isDev});

Menu.setApplicationMenu(menu)

function createWindow() {
    mainWindow = new BrowserWindow({
        width: isDev || isDebugProduction ? 1000 : 800,
        height: 600,
        x: 0,
        y: 0,
        title: isDev ? "DEV MODE" : "Todo Today",
        webPreferences: {
            nodeIntegration: true,
            // enableRemoteModule: true,
            contextIsolation: false,
            devTools: isDev || isDebugProduction,
            spellcheck: true
        }
    })

    if (isDev) {
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL('http://localhost:3003')
    } else {
        if (isDebugProduction) mainWindow.webContents.openDevTools();
        mainWindow.loadFile(path.resolve(__dirname, 'react-dist', 'index.html'))

    }
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('backup', async (event, arg) => {
    try {
        const dirname = path.resolve(app.getPath('appData'), app.name, 'backups')
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }
        fs.writeFileSync(path.resolve(dirname, arg.filename), arg.data, 'utf8');
        return { isSuccess: true }
    } catch (e) {
        return { isSuccess: false, message: JSON.stringify(e) }
    }
})