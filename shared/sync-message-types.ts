export enum ESyncMessageIPCFromRenderer {
  AppStart = 'app-start',
}

export enum ESyncMessageIPCFromMain {
  AppStart = 'app-start',
}

export interface AppStartIPCFromRenderer {
  type: ESyncMessageIPCFromRenderer.AppStart
}

export interface AppStartIPCFromMain {
  type: ESyncMessageIPCFromRenderer.AppStart
  body: {
    backupDir: string
  }
}

export type SyncMessageIPCFromRenderer =
  | AppStartIPCFromRenderer

export type SyncMessageIPCFromMain =
  | AppStartIPCFromMain
