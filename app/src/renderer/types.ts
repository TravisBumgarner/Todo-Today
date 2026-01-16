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
  BLOCKED = 'BLOCKED',
}

export interface TSubtask {
  id: string
  title: string
  checked: boolean
}

export interface TTask {
  id: string
  title: string
  status: ETaskStatus
  details: string
  subtasks: TSubtask[]
}

export interface TTodoList {
  date: TDateISODate
  taskIds: string[]
}
