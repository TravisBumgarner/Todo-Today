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

type RefreshRemindersIPC = AddReminderIPC[]

export {
    NotificationIPC,
    BackupIPC,
    AddReminderIPC,
    RefreshRemindersIPC
}