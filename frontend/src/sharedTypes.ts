type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

enum EProjectStatus {
    REOCURRING = 'REOCURRING',
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

type TSuccess = {
    id: string
    description: string
    date: TDateISODate
    projectId: TProject['id']
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
    details: string
}

enum EDateFormat {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

enum EBackupInterval {
    MINUTELY = 'MINITELY',
    HOURLY = 'HOURLY',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    OFF = 'OFF'
}

enum EDaysOfWeek {
    SUNDAY = '0',
    MONDAY = '1',
    TUESDAY = '2',
    WEDNESDAY = '3',
    THURSDAY = '4',
    FRIDAY = '5',
    SATURDAY = '6',

}

type TReminder = {
    hours: string,
    minutes: string,
    dayOfWeek: EDaysOfWeek,
    reminderIndex: string
}

enum EColorTheme {
    BEACH = 'BEACH',
    NEWSPAPER = 'NEWSPAPER',
    OUTERSPACE = 'OUTERSPACE',
    RETRO_FUTURE = 'RETRO_FUTURE',
    SLATE = 'SLATE',
    SUNSET = 'SUNSET',
    UNDER_THE_SEA = 'UNDER_THE_SEA',
}

type TColor = {
    FOREGROUND: string,
    INTERACTION: string,
    WARNING: string
    DISABLED: string
    BACKGROUND: string
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
    TReminder,
    TSuccess
}
