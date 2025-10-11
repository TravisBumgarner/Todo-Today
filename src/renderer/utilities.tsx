import Icon from './components/Icon'
import moment from 'moment'

// import log from 'electron-log/renderer'

export const logMessage = (message: string) => {
  console.log(message)
  // if (import.meta.env.DEV) {
  //   console.log(message)
  // } else {
  //   log.info(message)
  // }
}

import { type AsyncMessageIPCFromRenderer } from '../shared/async-message-types'
import {
  type AppStartIPCFromMain,
  type ESyncMessageIPC,
  type SyncMessageIPCFromRenderer,
} from '../shared/sync-message-types'

import {
  DATE_ISO_DATE_MOMENT_STRING,
  ETaskStatus,
  type TDateISODate,
} from './types'

export const TASK_STATUS_IS_ACTIVE: Record<ETaskStatus, boolean> = {
  [ETaskStatus.CANCELED]: false,
  [ETaskStatus.COMPLETED]: false,
  [ETaskStatus.IN_PROGRESS]: true,
  [ETaskStatus.NEW]: true,
  [ETaskStatus.BLOCKED]: true,
}

const taskStatusLookup: Record<ETaskStatus, string> = {
  [ETaskStatus.CANCELED]: 'Canceled',
  [ETaskStatus.COMPLETED]: 'Completed',
  [ETaskStatus.IN_PROGRESS]: 'In Progress',
  [ETaskStatus.NEW]: 'Queued',
  [ETaskStatus.BLOCKED]: 'Blocked',
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

const sumArray = (arr: number[]) =>
  arr.reduce((partialSum, a) => partialSum + a, 0)

export const sortStrings = (a: string, b: string) =>
  a.toLocaleLowerCase() > b.toLocaleLowerCase() ? 1 : -1

const saveFile = async (fileName: string, jsonData: unknown) => {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
    type: 'application/json',
  })
  const a = document.createElement('a')
  a.download = fileName
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', () => {
    setTimeout(() => {
      URL.revokeObjectURL(a.href)
    }, 30 * 1000)
  })
  a.click()
}

interface MessageReturnTypeMap {
  [ESyncMessageIPC.AppStart]: AppStartIPCFromMain['body']
}

const sendSyncIPCMessage = async <T extends SyncMessageIPCFromRenderer>(
  message: T,
): Promise<MessageReturnTypeMap[T['type']]> => {
  return (await window.electron.ipcRenderer.invoke(
    message.type,
    message.body,
  )) as MessageReturnTypeMap[T['type']]
}

const sendAsyncIPCMessage = <T extends AsyncMessageIPCFromRenderer>(
  message: T,
) => {
  // Responses end up in useIPCRendererEffect.ts
  window.electron.ipcRenderer.send(message.type, message.body)
}

const taskStatusIcon = (taskStatus: ETaskStatus) => {
  switch (taskStatus) {
    case ETaskStatus.CANCELED:
      return <Icon.CanceledIcon />
    case ETaskStatus.BLOCKED:
      return <Icon.BlockedIcon />
    case ETaskStatus.NEW:
      return <Icon.NewIcon />
    case ETaskStatus.IN_PROGRESS:
      return <Icon.InProgressIcon />
    case ETaskStatus.COMPLETED:
      return <Icon.CompletedIcon />
  }
}

export {
  formatDateDisplayString,
  formatDateKeyLookup,
  formatDurationDisplayString,
  saveFile,
  sendAsyncIPCMessage,
  sendSyncIPCMessage,
  sumArray,
  taskStatusIcon,
  taskStatusLookup,
}
