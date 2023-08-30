import moment from 'moment'
import { type TProject, EProjectStatus, type TTask, type TDateISODate, ETaskStatus, EColorTheme, EBackupInterval } from 'sharedTypes'
import { type NotificationIPC } from '../../shared/types'

const { ipcRenderer } = window.require('electron')

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

  return moment(date).format('dddd, MMMM Do')
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

const sendNotification = (title: string, body: string) => {
  ipcRenderer.send('notification', { title, body } as NotificationIPC)
}

const getLocalStorage = (key: string) => {
  const result = localStorage.getItem(key)
  return result ? JSON.parse(result) : ''
}

const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
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
  sendNotification,
  getLocalStorage,
  setLocalStorage
}
