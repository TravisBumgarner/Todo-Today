export enum EMessageIPCFromRenderer {
  Notification = 'notification',
  Backup = 'backup',
  AppStart = 'app-start',
}

export enum EMessageIPCFromMain {
  Backup = 'backup',
  AppStart = 'app-start',
}

export interface NotificationIPCFromRenderer {
  type: EMessageIPCFromRenderer.Notification
  body: {
    title: string
    body: string
  }
}

export interface BackupIPCFromRenderer {
  type: EMessageIPCFromRenderer.Backup
  body: {
    filename: string
    data: string
  }
}

export interface BackupIPCFromMain {
  type: EMessageIPCFromRenderer.Backup
  body: {
    success: boolean
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

export type MessageIPCFromMain =
  | AppStartIPCFromMain
  | BackupIPCFromMain
