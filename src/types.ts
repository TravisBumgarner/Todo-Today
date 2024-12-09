type TYear = `${number}${number}${number}${number}`
type TMonth = `${number}${number}`
type TDay = `${number}${number}`
export type TDateISODate = `${TYear}-${TMonth}-${TDay}`
export const DATE_ISO_DATE_MOMENT_STRING = 'YYYY-MM-DD'

export enum ETaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  BLOCKED = 'BLOCKED'
}

export interface TTask {
  id: string
  title: string
  status: ETaskStatus
  details?: string // Migrated from TTodoListItem. Not every task has details.
}

export interface TTodoListItem {
  taskId: string
  todoListDate: TDateISODate
  workspaceId: string
  id: string
  sortOrder: number
}

export enum EBackupInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  OFF = 'OFF'
}

export enum EColorTheme {
  BEACH = 'BEACH',
  RETRO_FUTURE = 'RETRO_FUTURE',
  CONTRAST = 'CONTRAST',
  UNDER_THE_SEA = 'UNDER_THE_SEA'
}

export interface TSettings {
  colorTheme: EColorTheme
  backupInterval: EBackupInterval
  backupDir: string
}

export interface TWorkspace {
  name: string
  id: string
}
