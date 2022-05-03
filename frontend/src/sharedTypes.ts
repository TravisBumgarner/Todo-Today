import moment from "moment"

// https://gist.github.com/MrChocolatine/367fb2a35d02f6175cc8ccb3d3a20054
// In TS, interfaces are "open" and can be extended
interface Date {
    /**
     * Give a more precise return type to the method `toISOString()`:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
     */
    toISOString(): TDateISO;
  }
  
  type TYear         = `${number}${number}${number}${number}`;
  type TMonth        = `${number}${number}`;
  type TDay          = `${number}${number}`;
  type THours        = `${number}${number}`;
  type TMinutes      = `${number}${number}`;
  type TSeconds      = `${number}${number}`;
  type TMilliseconds = `${number}${number}${number}`;
  
  /**
   * Represent a string like `2021-01-08`
   */
  type TDateISODate = `${TYear}-${TMonth}-${TDay}`;
  
  /**
   * Represent a string like `14:42:34.678`
   */
  type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;
  
  /**
   * Represent a string like `2021-01-08T14:42:34.678Z` (format: ISO 8601).
   *
   * It is not possible to type more precisely (list every possible values for months, hours etc) as
   * it would result in a warning from TypeScript:
   *   "Expression produces a union type that is too complex to represent. ts(2590)
   */
  type TDateISO = `${TDateISODate}T${TDateISOTime}Z`;

enum TProjectStatus {
    NEW = 'NEW',
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
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
    date: TDateISODate
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
    TColorTheme,
    TColor,
    TDateISODate
}