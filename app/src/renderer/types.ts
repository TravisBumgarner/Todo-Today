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
  type: 'regular' | 'recurring'
  recurringTaskId?: string
}

export interface TTodoList {
  date: TDateISODate
  taskIds: string[]
  processedRecurringTasks: boolean
}

export enum ERecurringFrequency {
  EVERY_WEEK = 'EVERY_WEEK',
  EVERY_OTHER_WEEK = 'EVERY_OTHER_WEEK',
  MONTHLY = 'MONTHLY',
}

export enum EDayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface TRecurringTask {
  id: string
  title: string
  frequency: ERecurringFrequency
  daysOfWeek: EDayOfWeek[]
  details: string
  status: ETaskStatus
}
