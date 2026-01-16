import { type IpcMainInvokeEvent, ipcMain } from 'electron'
import type { Invokes } from '../../shared/types'

// ----- typed IPC main -----
export const typedIpcMain = {
  // Main handles invoke() calls (Renderer → Main request/response)
  handle<T extends keyof Invokes>(
    CHANNEL_INVOKES: T,
    handler: (
      event: IpcMainInvokeEvent,
      args: Invokes[T]['args'],
    ) => Invokes[T]['result'] | Promise<Invokes[T]['result']>,
  ) {
    ipcMain.handle(CHANNEL_INVOKES, (event, args) => handler(event, args as Invokes[T]['args']))
  },
}
