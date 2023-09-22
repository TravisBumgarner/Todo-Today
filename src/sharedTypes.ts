export interface NotificationIPC {
  title: string
  body: string
}

export interface BackupIPC {
  filename: string
  data: string
}

export interface AppStartIPC {
  backupDir: string
}
