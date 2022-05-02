const path = require("path");
const url = require('url');
const fs = require('fs')

const { app, BrowserWindow, ipcMain, Menu } = require('electron')

require('dotenv').config({ path: `.env` })

const dataStore = require('./dataStore.json')
const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'

let mainWindow

const template = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'quit' }
        ]
    }] : []),
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
    mainWindow = new BrowserWindow({
        width: isDev ? 1000 : 800,
        height: 600,
        x: 0,
        y: 0,
        title: "TODO TODAY",
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            devTools: true
        }
    })


    mainWindow.loadFile(path.join(__dirname, './index.html'))
    mainWindow.webContents.openDevTools();

    // if (isDev) {
    //     mainWindow.loadURL('http://localhost:3003')
    // } else {}
    // if (isDev) {}
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

ipcMain.handle('hydrate-app', (event, arg) => {
    return JSON.stringify(dataStore)
})

ipcMain.on('state-change', (event, arg) => {
    console.log('state-change')
        // fs.writeFileSync('./dataStore.json', JSON.stringify(arg.payload))
})