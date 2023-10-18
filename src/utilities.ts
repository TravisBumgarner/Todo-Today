import moment from 'moment'
import { ipcRenderer } from 'electron'

import { EProjectStatus, type TDateISODate, ETaskStatus, EColorTheme, EBackupInterval, DATE_ISO_DATE_MOMENT_STRING } from './types'
import { type BackupIPCFromMain, EMessageIPCFromRenderer, type MessageIPCFromRenderer, type AppStartIPCFromMain } from 'shared/types'

const projectStatusLookup: Record<EProjectStatus, string> = {
  [EProjectStatus.INACTIVE]: 'Inactive',
  [EProjectStatus.ACTIVE]: 'Active'
}

const backupIntervalLookup: Record<EBackupInterval, string> = {
  [EBackupInterval.MINUTELY]: 'Every Minute',
  [EBackupInterval.HOURLY]: 'Ever Hour',
  [EBackupInterval.DAILY]: 'Every Day',
  [EBackupInterval.WEEKLY]: 'Every Week',
  [EBackupInterval.MONTHLY]: 'Every Month',
  [EBackupInterval.OFF]: 'Off'
}

const taskStatusLookup: Record<ETaskStatus, string> = {
  [ETaskStatus.CANCELED]: 'Canceled',
  [ETaskStatus.COMPLETED]: 'Completed',
  [ETaskStatus.IN_PROGRESS]: 'In Progress',
  [ETaskStatus.NEW]: 'New',
  [ETaskStatus.BLOCKED]: 'Blocked'
}

const colorThemeOptionLabels: Record<EColorTheme, string> = {
  [EColorTheme.BEACH]: 'Beach',
  [EColorTheme.RETRO_FUTURE]: 'Retro Future',
  [EColorTheme.UNDER_THE_SEA]: 'Under the Sea',
  [EColorTheme.CONTRAST]: 'High Contrast'
}

const formatDateDisplayString = (date: TDateISODate | null): string => {
  if (date === null) {
    return ''
  }

  return moment(date, DATE_ISO_DATE_MOMENT_STRING).format('dddd, MMM Do')
}

const formatDateKeyLookup = (date: moment.Moment): TDateISODate => {
  return date.format('YYYY-MM-DD') as TDateISODate
}

const formatDurationDisplayString = (rawMinutes: number) => {
  const hours = Math.floor(rawMinutes / 60)
  const minutes = rawMinutes % 60
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
  return `${hours}:${paddedMinutes}`
}

const sumArray = (arr: number[]) => arr.reduce((partialSum, a) => partialSum + a, 0)

export const sortStrings = (a: string, b: string) => a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1

const saveFile = async (fileName: string, jsonData: unknown) => {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.download = fileName
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', () => {
    setTimeout(() => { URL.revokeObjectURL(a.href) }, 30 * 1000)
  })
  a.click()
}

export interface TLocalStorage {
  backupDir: string
  lastBackup: string
  hasDoneWarmStart: boolean
  colorTheme: EColorTheme
  backupInterval: EBackupInterval
}

const getLocalStorage = (key: keyof TLocalStorage) => {
  const result = localStorage.getItem(key)
  return result ? JSON.parse(result) : ''
}

const setLocalStorage = <T extends TLocalStorage>(key: keyof T, value: T[keyof T]) => {
  localStorage.setItem(key as string, JSON.stringify(value))
}

interface MessageReturnTypeMap {
  [EMessageIPCFromRenderer.Notification]: null
  [EMessageIPCFromRenderer.Backup]: BackupIPCFromMain['body']
  [EMessageIPCFromRenderer.AppStart]: AppStartIPCFromMain['body']
}

const sendIPCMessage = async <T extends MessageIPCFromRenderer>(
  message: T
): Promise<MessageReturnTypeMap[T['type']]> => {
  switch (message.type) {
    case EMessageIPCFromRenderer.Notification: {
      await ipcRenderer.invoke(message.type, message.body)
      return null as MessageReturnTypeMap[T['type']]
    }
    case EMessageIPCFromRenderer.Backup: {
      return (await ipcRenderer.invoke(
        message.type,
        message.body
      )) as MessageReturnTypeMap[T['type']]
    }
    case EMessageIPCFromRenderer.AppStart: {
      return (await ipcRenderer.invoke(
        message.type
      )) as MessageReturnTypeMap[T['type']]
    }
  }
}

export {
  projectStatusLookup,
  taskStatusLookup,
  formatDateDisplayString,
  formatDateKeyLookup,
  formatDurationDisplayString,
  colorThemeOptionLabels,
  backupIntervalLookup,
  sumArray,
  saveFile,
  getLocalStorage,
  setLocalStorage,
  sendIPCMessage
}
