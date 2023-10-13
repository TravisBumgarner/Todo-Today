export enum EMessageIPCFromRenderer {
  Notification = 'notification',
  Backup = 'backup',
  AppStart = 'app-start',
  Version = 'app-version'
}

export enum EMessageIPCFromMain {
  Backup = 'backup',
  AppStart = 'app-start',
  Version = 'version'
}

export interface NotificationIPCFromRenderer {
  type: EMessageIPCFromRenderer.Notification
  body: {
    title: string
    body: string
  }
}

export interface VersionIPCFromRenderer {
  type: EMessageIPCFromRenderer.Version
}

export interface BackupIPCFromRenderer {
  type: EMessageIPCFromRenderer.Backup
  body: {
    filename: string
    data: string
  }
}

export interface BackupIPCFromMain {
  type: EMessageIPCFromMain.Backup
  body: {
    success: boolean
  }
}

export interface VersionIPCFromMain {
  type: EMessageIPCFromMain.Version
  body: {
    version: string
  }
}

export interface AppStartIPCFromRenderer {
  type: EMessageIPCFromRenderer.AppStart
}

export interface AppStartIPCFromMain {
  type: EMessageIPCFromRenderer.AppStart
  body: {
    backupDir: string
  }
}

export type MessageIPCFromRenderer =
  | NotificationIPCFromRenderer
  | BackupIPCFromRenderer
  | AppStartIPCFromRenderer
  | VersionIPCFromRenderer

export type MessageIPCFromMain =
  | AppStartIPCFromMain
  | BackupIPCFromMain
  | VersionIPCFromMain
