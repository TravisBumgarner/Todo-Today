type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

enum EProjectStatus {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

type TProject = {
    id: string
    title: string
    startDate: TDateISODate | null
    endDate: TDateISODate | null
    status: EProjectStatus
}

enum ETaskStatus {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

type TTask = {
    id: string
    projectId: string
    title: string
    status: ETaskStatus
}

type TTodoListItem = {
    duration: number
    projectId: string
    taskId: string
    todoListDate: string
    id: string
}

enum EDateFormat {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

enum EBackupInterval {
    HOURLY = 'HOURLY',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    OFF = 'OFF'
}

enum EDaysOfWeek {
    SUNDAY = "0",
    MONDAY = "1",
    TUESDAY = "2",
    WEDNESDAY = "3",
    THURSDAY = "4",
    FRIDAY = "5",
    SATURDAY = "6",

}

type TReminder = {
    hours: string,
    minutes: string,
    dayOfWeek: EDaysOfWeek,
    reminderIndex: string
}

enum EColorTheme {
    FIRE_AND_ICE = 'FIRE_AND_ICE',
    NEWSPAPER = 'NEWSPAPER',
    BEACH = 'BEACH',
    SUNSET = 'SUNSET'
}

type TColor = {
    FOREGROUND_TEXT: string,
    PRIMARY_BUTTON: string,
    ALERT_BUTTON: string
    FOREGROUND_DISABLED: string
    BACKGROUND_PRIMARY: string
}

type TSettings = {
    dateFormat: EDateFormat
    colorTheme: EColorTheme
    backupInterval: EBackupInterval
    reminders: TReminder[]
}

type TEnumTypeString<TEnum extends string> =
    { [key in string]: TEnum | string; }

type TEnumTypeNumber<TEnum extends number> =
    { [key in string]: TEnum | number; }
    | { [key in number]: string; }

type TEnumType<TEnum extends string | number> =
    (TEnum extends string ? TEnumTypeString<TEnum> : never)
    | (TEnum extends number ? TEnumTypeNumber<TEnum> : never)

export {
    TProject,
    EProjectStatus,
    TTask,
    ETaskStatus,
    TTodoListItem,
    TEnumType,
    TSettings,
    EDateFormat,
    EColorTheme,
    TColor,
    TDateISODate,
    EBackupInterval,
    EDaysOfWeek,
    TReminder
}
