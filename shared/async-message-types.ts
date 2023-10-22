export enum EAsyncMessageIPCFromRenderer {
  CreateNotification = 'create_notification',
  CreateBackup = 'create_backup',
  RestartApp = 'restart_app'
}

export enum EAsyncMessageIPCFromMain {
  BackupCompleted = 'backup_completed',
  UpdateAvailable = 'update_available',
  UpdateDownloaded = 'update_downloaded'
}

export interface AsyncNotificationIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.CreateNotification
  body: {
    title: string
    body: string
  }
}

export interface AsyncBackupIPCFromRenderer {
  type: EAsyncMessageIPCFromRenderer.CreateBackup
  body: {
    filename: string
    data: string
  }
}

export interface AsyncBackupIPCFromMain {
  type: EAsyncMessageIPCFromMain.BackupCompleted
  body: {
    success: true
    timestamp: string
  } | {
    success: false
  }
}

export type AsyncMessageIPCFromRenderer =
  | AsyncNotificationIPCFromRenderer
  | AsyncBackupIPCFromRenderer

export type AsyncMessageIPCFromMain =
  | AsyncBackupIPCFromMain
