type NotificationIPC = {
    title: string
    body: string
}

type BackupIPC = {
    filename: string
    data: string
}

type AddReminderIPC = {
    minutes: number
    hours: number
    dayOfWeek: number
}

export {
    NotificationIPC,
    BackupIPC,
    AddReminderIPC
}