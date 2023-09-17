type NotificationIPC = {
    title: string
    body: string
}

type BackupIPC = {
    filename: string
    data: string
}

type AppStartIPC = {
    backupDir: string
}


export {
    NotificationIPC,
    BackupIPC,
    AppStartIPC
}