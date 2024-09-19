type TYear = `${number}${number}${number}${number}`
type TMonth = `${number}${number}`
type TDay = `${number}${number}`
export type TDateISODate = `${TYear}-${TMonth}-${TDay}`
export const DATE_ISO_DATE_MOMENT_STRING = 'YYYY-MM-DD'

export enum EProjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface TProject {
  id: string
  title: string
  status: EProjectStatus
}

export interface TSuccess {
  id: string
  description: string
  date: TDateISODate
  projectId: TProject['id']
}

export enum ETaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  BLOCKED = 'BLOCKED'
}

export interface TTask {
  id: string
  projectId: string
  title: string
  status: ETaskStatus
  details?: string // Migrated from TTodoListItem. Not every task has details.
}

export interface TTodoListItem {
  taskId: string
  todoListDate: TDateISODate
  id: string
  // details?: string // Deprecated, get data from TTask.
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

export enum EActivePage {
  Home = 'Home',
  History = 'History',
  Successes = 'Successes',
}

export interface TWorkspace {
  name: string
  id: string
}
