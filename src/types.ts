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
  details: string
}

export interface TTodoListItem {
  taskId: string
  todoListDate: TDateISODate
  id: string
}

export enum EColorTheme {
  BEACH = 'BEACH',
  RETRO_FUTURE = 'RETRO_FUTURE',
  CONTRAST = 'CONTRAST',
  UNDER_THE_SEA = 'UNDER_THE_SEA'
}

export interface TSettings {
  colorTheme: EColorTheme
}
