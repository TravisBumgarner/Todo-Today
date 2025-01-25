import Icon from 'components/Icon'
import { ipcRenderer } from 'electron'
import moment from 'moment'

import { type AsyncMessageIPCFromRenderer } from '../shared/async-message-types'
import { type AppStartIPCFromMain, type ESyncMessageIPC, type SyncMessageIPCFromRenderer } from '../shared/sync-message-types'

import { DATE_ISO_DATE_MOMENT_STRING, EColorTheme, ETaskStatus, type TDateISODate } from './types'

export const TASK_STATUS_IS_ACTIVE: Record<ETaskStatus, boolean> = {
  [ETaskStatus.CANCELED]: false,
  [ETaskStatus.COMPLETED]: false,
  [ETaskStatus.IN_PROGRESS]: true,
  [ETaskStatus.NEW]: true,
  [ETaskStatus.BLOCKED]: true
}

const taskStatusLookup: Record<ETaskStatus, string> = {
  [ETaskStatus.CANCELED]: 'Canceled',
  [ETaskStatus.COMPLETED]: 'Completed',
  [ETaskStatus.IN_PROGRESS]: 'In Progress',
  [ETaskStatus.NEW]: 'Queued',
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

  return moment(date, DATE_ISO_DATE_MOMENT_STRING).format('ddd, MMM Do')
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
  colorTheme: EColorTheme
}

const getLocalStorage = (key: keyof TLocalStorage) => {
  const result = localStorage.getItem(key)
  return result ? JSON.parse(result) : ''
}

// This'll need to be rethought.
// eslint-disable-next-line
const setLocalStorage = <T extends TLocalStorage>(key: keyof T, value: T[keyof T]) => {
  localStorage.setItem(key as string, JSON.stringify(value))
}

interface MessageReturnTypeMap {
  [ESyncMessageIPC.AppStart]: AppStartIPCFromMain['body']
}

const sendSyncIPCMessage = async <T extends SyncMessageIPCFromRenderer>(
  message: T
): Promise<MessageReturnTypeMap[T['type']]> => {
  return (await ipcRenderer.invoke(
    message.type,
    message.body
  )) as MessageReturnTypeMap[T['type']]
}

const sendAsyncIPCMessage = <T extends AsyncMessageIPCFromRenderer>(
  message: T
) => {
  // Responses end up in useIPCRendererEffect.ts
  ipcRenderer.send(message.type, message.body)
}

const taskStatusIcon = (taskStatus: ETaskStatus) => {
  switch (taskStatus) {
    case ETaskStatus.CANCELED:
      return (
        <Icon.CanceledIcon />
      )
    case ETaskStatus.BLOCKED:
      return (
        <Icon.BlockedIcon />
      )
    case ETaskStatus.NEW:
      return (
        <Icon.NewIcon />
      )
    case ETaskStatus.IN_PROGRESS:
      return (
        <Icon.InProgressIcon />
      )
    case ETaskStatus.COMPLETED:
      return (
        <Icon.CompletedIcon />
      )
  }
}

export {
  colorThemeOptionLabels, formatDateDisplayString,
  formatDateKeyLookup,
  formatDurationDisplayString, getLocalStorage, saveFile, sendAsyncIPCMessage, sendSyncIPCMessage, setLocalStorage, sumArray, taskStatusIcon, taskStatusLookup
}

export const mergeDeep = (target: any, source: any) => {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object') {
      if (!target[key]) {
        target[key] = {}
      }
      mergeDeep(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}
