const path = require("path");

const { app, BrowserWindow, ipcMain, Menu } = require('electron')

const isDev = process.env.NODE_ENV === 'local'
const isDebugProduction = true // Set to True to debug
const isMac = process.platform === 'darwin'
if (isDev) require('electron-reloader')(module)
let mainWindow

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(app.getPath('appData'), app.name, 'db.sqlite')
    },
    migrations: {
        directory: './migrations'
    },
    seeds: {
        directory: './seeds'
    },
    useNullAsDefault: true
}
const knex = require('knex')(knexConfig)

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
        width: isDev || isDebugProduction ? 1000 : 800,
        height: 600,
        x: 0,
        y: 0,
        title: "TODO TODAY",
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            devTools: isDev || isDebugProduction,
            webSecurity: false
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

ipcMain.handle('hydrate-app', async(event, arg) => {
    const data = await knex.raw('select * from jsondump')
    return data[0] && data[0].jsondump ? data[0].jsondump : null
})

ipcMain.on('state-change', async(event, arg) => {
    console.log("state-change", arg)
    await knex.raw("delete from jsondump;")
    await knex.raw(` insert into jsondump (jsondump) values ('${arg.payload}');`)
    console.log('state-change')
})