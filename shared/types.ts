export enum ENotificationIPC {
  Notification = 'notification',
  Backup = 'backup',
  AppStart = 'app-start',
}

export interface NotificationIPC {
  type: ENotificationIPC.Notification
  body: {
    title: string
    body: string
  }
}

export interface BackupIPC {
  type: ENotificationIPC.Backup
  body: {
    filename: string
    data: string
  }
}

export interface AppStartIPC {
  type: ENotificationIPC.AppStart
  body: {
    backupDir: string
  }
}

export type MessageIPC =
  | NotificationIPC
  | BackupIPC
  | AppStartIPC
