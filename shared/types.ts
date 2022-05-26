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

type EditReminderIPC = {
    minutes: number
    hours: number
    dayOfWeek: number
    reminderIndex: string
}

type AppStartIPC = {
    backupDir: string
}

type RefreshRemindersIPC = AddReminderIPC[]

export {
    NotificationIPC,
    BackupIPC,
    AddReminderIPC,
    EditReminderIPC,
    RefreshRemindersIPC,
    AppStartIPC
}