import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import {
  ESyncMessageIPC,
  EAsyncMessageIPCFromRenderer,
  EAsyncMessageIPCFromMain,
} from '../shared/types'

const electronHandler = {
  ipcRenderer: {
    // Renderer → Main (fire and forget)
    send(channel: EAsyncMessageIPCFromRenderer, params: unknown) {
      ipcRenderer.send(channel, params)
    },

    // Main → Renderer (listen)
    on(channel: EAsyncMessageIPCFromMain, listener: (params: unknown) => void) {
      const subscription = (_event: IpcRendererEvent, params: unknown) =>
        listener(params)

      ipcRenderer.on(channel, subscription)
      return () => ipcRenderer.removeListener(channel, subscription)
    },

    // Main → Renderer (one-time listen)
    once(
      channel: EAsyncMessageIPCFromMain,
      listener: (params: unknown) => void,
    ) {
      ipcRenderer.once(channel, (_event, params: unknown) => listener(params))
    },

    // Renderer → Main (invoke / handle roundtrip)
    invoke(channel: ESyncMessageIPC, args?: unknown): Promise<unknown> {
      return ipcRenderer.invoke(channel, args)
    },
  },
}

contextBridge.exposeInMainWorld('electron', electronHandler)

export type ElectronHandler = typeof electronHandler
