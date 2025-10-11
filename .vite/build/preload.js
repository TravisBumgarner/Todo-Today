"use strict";
const electron = require("electron");
const electronHandler = {
  ipcRenderer: {
    // Renderer → Main (fire and forget)
    send(channel, params) {
      electron.ipcRenderer.send(channel, params);
    },
    // Main → Renderer (listen)
    on(channel, listener) {
      const subscription = (_event, params) => listener(params);
      electron.ipcRenderer.on(channel, subscription);
      return () => electron.ipcRenderer.removeListener(channel, subscription);
    },
    // Main → Renderer (one-time listen)
    once(channel, listener) {
      electron.ipcRenderer.once(channel, (_event, params) => listener(params));
    },
    // Renderer → Main (invoke / handle roundtrip)
    invoke(channel, args) {
      return electron.ipcRenderer.invoke(channel, args);
    }
  }
};
electron.contextBridge.exposeInMainWorld("electron", electronHandler);
