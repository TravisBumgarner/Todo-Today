type TYear = `${number}${number}${number}${number}`
type TMonth = `${number}${number}`
type TDay = `${number}${number}`
type TDateISODate = `${TYear}-${TMonth}-${TDay}`

enum EProjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

interface TProject {
  id: string
  title: string
  status: EProjectStatus
}

interface TSuccess {
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
  BLOCKED = 'BLOCKED'
}

interface TTask {
  id: string
  projectId: string
  title: string
  status: ETaskStatus
  details?: string // Migrated from TTodoListItem. Not every task has details.
}

interface TTodoListItem {
  taskId: string
  todoListDate: string
  id: string
  // details?: string // Deprecated, get data from TTask.
  sortOrder: number
}

enum EBackupInterval {
  MINUTELY = 'MINITELY',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  OFF = 'OFF'
}

enum EColorTheme {
  BEACH = 'BEACH',
  RETRO_FUTURE = 'RETRO_FUTURE',
  CONTRAST = 'CONTRAST',
  UNDER_THE_SEA = 'UNDER_THE_SEA'
}

interface TColor {
  FOREGROUND: string
  INTERACTION: string
  WARNING: string
  DISABLED: string
  BACKGROUND: string
}

interface TSettings {
  colorTheme: EColorTheme
  backupInterval: EBackupInterval
  backupDir: string
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
  type TProject,
  EProjectStatus,
  type TTask,
  ETaskStatus,
  type TTodoListItem,
  type TEnumType,
  type TSettings,
  EColorTheme,
  type TColor,
  type TDateISODate,
  EBackupInterval,
  type TSuccess
}
