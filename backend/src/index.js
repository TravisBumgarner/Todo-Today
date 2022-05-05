const path = require("path");
const fs = require('fs')

const { app, BrowserWindow, ipcMain, Menu } = require('electron')

const isDev = process.env.NODE_ENV === 'local'
const isDebugProduction = true // Set to True to debug
const isMac = process.platform === 'darwin'
if (isDev) require('electron-reloader')(module)
let mainWindow

const template = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'quit' }
        ]
    }] : []),
    {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
    mainWindow = new BrowserWindow({
        width: isDev || isDebugProduction ? 1000 : 800,
        height: 600,
        x: 0,
        y: 0,
        title: "TODO TODAY",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            devTools: isDev || isDebugProduction,
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

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('backup', async(event, arg) => {
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