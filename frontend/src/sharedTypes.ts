type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

enum TProjectStatus {
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
    status: TProjectStatus
}

enum TTaskStatus {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

type TTask = {
    id: string
    projectId: string
    title: string
    status: TTaskStatus
}

type TTodoListItem = {
    duration: number
    projectId: string
    taskId: string
    todoListDate: string
    id: string
}

enum TDateFormat {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

enum TBackupInterval {
    HOURLY = 'HOURLY',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    OFF = 'OFF'
}

enum TWeekStart {
    MONDAY = 'MONDAY',
    SUNDAY = 'SUNDAY'
}

enum TColorTheme {
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
    dateFormat: TDateFormat
    weekStart: TWeekStart
    colorTheme: TColorTheme
    backupInterval: TBackupInterval
}

type EnumTypeString<TEnum extends string> =
    { [key in string]: TEnum | string; }

type EnumTypeNumber<TEnum extends number> =
    { [key in string]: TEnum | number; }
    | { [key in number]: string; }

type EnumType<TEnum extends string | number> =
    (TEnum extends string ? EnumTypeString<TEnum> : never)
    | (TEnum extends number ? EnumTypeNumber<TEnum> : never)

export {
    TProject,
    TProjectStatus,
    TTask,
    TTaskStatus,
    TTodoListItem,
    EnumType,
    TSettings,
    TDateFormat,
    TWeekStart,
    TColorTheme,
    TColor,
    TDateISODate,
    TBackupInterval
}
