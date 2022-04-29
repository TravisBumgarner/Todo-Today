// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('dotenv').config({ path: `.env` })

const dataStore = {
    "projects": {
        "1": {
            "id": "1",
            "title": "PTO",
            "status": "IN_PROGRESS",
            "startDate": null,
            "endDate": null
        },
        "2": {
            "id": "2",
            "title": "Sick Time",
            "status": "IN_PROGRESS",
            "startDate": null,
            "endDate": null
        }
    },
    "tasks": {
        "1": {
            "id": "1",
            "title": "Create a web app!!!!",
            "status": "NEW",
            "projectId": "1"
        },
        "2": {
            "id": "2",
            "title": "Fix the previous project",
            "status": "IN_PROGRESS",
            "projectId": "1"
        },
        "3": {
            "id": "3",
            "title": "Covid",
            "status": "IN_PROGRESS",
            "projectId": "2"
        }
    },
    "todoList": {
        "2022-04-27": [{
                "duration": 0,
                "projectId": "1",
                "taskId": "1"
            },
            {
                "duration": 15,
                "projectId": "1",
                "taskId": "2"
            }, {
                "duration": 3,
                "projectId": "1",
                "taskId": "2"
            },
            {
                "duration": 5,
                "projectId": "1",
                "taskId": "5"
            }
        ],
        "2022-04-28": [{
            "duration": 100,
            "projectId": "1",
            "taskId": "1"
        }],
        "2022-04-29": [{
            "duration": 5,
            "projectId": "1",
            "taskId": "1"
        }],
        "2022-04-30": [{
            "duration": 2,
            "projectId": "1",
            "taskId": "1"
        }]
    },
    "settings": {
        "dateFormat": "D",
        "weekStart": "MONDAY",
        "colorTheme": "SUNSET"
    }
}

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

ipcMain.handle('hydrate-app', (event, arg) => {
    return JSON.stringify(dataStore)
})