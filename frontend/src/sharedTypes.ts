import moment from "moment"

enum TProjectStatus {
    NEW = 'NEW',
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

type TProject = {
    id: string
    title: string
    startDate: moment.Moment | null
    endDate: moment.Moment | null
    status: TProjectStatus
}

enum TTaskStatus {
    NEW = 'NEW',
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

type TTask = {
    id: string
    projectId: string
    title: string
    status: TTaskStatus
}

type TTodoList = {
    date: string
}

type TTodoListItem = {
    duration: number
    projectId: string
    taskId: string
}

enum TDateFormat {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
} 

enum TWeekStart {
    MONDAY = 'MONDAY',
    SUNDAY = 'SUNDAY'
}

enum TAvailableThemes {
    FIRE_AND_ICE = 'FIRE_AND_ICE',
    NEWSPAPER = 'NEWSPAPER',
    BEACH = 'BEACH',
    SUNSET = 'SUNSET'
}

type TThemeConstants = {
    FOREGROUND_TEXT: string,
    PRIMARY_BUTTON: string,
    ALERT_BUTTON: string
    FOREGROUND_DISABLED: string
    BACKGROUND_PRIMARY: string
}

type TSettings = {
    dateFormat: TDateFormat
    weekStart: TWeekStart
    colorTheme: TAvailableThemes
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
    TTodoList,
    EnumType,
    TSettings,
    TDateFormat,
    TWeekStart,
    TAvailableThemes,
    TThemeConstants
}