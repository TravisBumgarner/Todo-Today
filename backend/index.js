// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('dotenv').config({ path: `.env` })

const isProd = process.env.NODE_ENV === 'production'

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: isProd ? 800 : 1000,
        height: 600,
        x: 0,
        y: 0,
        title: "TODO TODAY",
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    })

    if (isProd) {
        mainWindow.loadFile('./public/index.html')
    } else {
        mainWindow.loadURL('http://localhost:3003')
    }
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('alive', (event, arg) => {
    console.log('alive?', arg) // prints "ping"
})