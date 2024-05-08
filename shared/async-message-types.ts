export enum EAsyncMessageIPCFromRenderer {
  CreateNotification = 'create-notification',
  CreateBackup = 'create-backup',
  RestartApp = 'restart-app',
}

export enum EAsyncMessageIPCFromMain {
  BackupCompleted = 'backup-completed',
  UpdateAvailable = 'update-available',
  UpdateDownloaded = 'update-downloaded'
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
