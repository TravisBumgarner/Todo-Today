import { updateElectronApp } from "update-electron-app";
import { app, BrowserWindow, Menu } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import log from "electron-log/main";
import "./messages/messages";
import menu from "./menu";

log.initialize();
Menu.setApplicationMenu(menu);

updateElectronApp({
  logger: {
    log: log.log,
    info: log.info,
    warn: log.warn,
    error: log.error,
  },
});

// Something something Windows. Not currently supported, will just leave it.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Platform-specific icon paths
  let iconPath: string;
  if (process.platform === "darwin") {
    iconPath = path.join(__dirname, "../../public/icons/icon.icns");
  } else if (process.platform === "win32") {
    iconPath = path.join(__dirname, "../../public/icons/icon.ico");
  } else {
    iconPath = path.join(__dirname, "../../public/icons/icon.png");
  }

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
