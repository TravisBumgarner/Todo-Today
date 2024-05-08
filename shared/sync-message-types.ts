export enum ESyncMessageIPCFromRenderer {
  AppStart = 'app-start',
  StartTimer = 'start-timer',
  StopTimer = 'stop-timer',
}

export enum ESyncMessageIPCFromMain {
  AppStart = 'app-start',
  StartTimer = 'start-timer',
  StopTimer = 'stop-timer',
}

export interface AppStartIPCFromRenderer {
  type: ESyncMessageIPCFromRenderer.AppStart
  body: null
}

export interface StartTimerIPCFromRenderer {
  type: ESyncMessageIPCFromRenderer.StartTimer
  body: {
    duration: number
  }
}

export interface StopTimerIPCFromRenderer {
  type: ESyncMessageIPCFromRenderer.StopTimer
  body: null
}

export interface AppStartIPCFromMain {
  type: ESyncMessageIPCFromRenderer.AppStart
  body: {
    backupDir: string
  }
}

export interface StartTimerIPCFromMain {
  type: ESyncMessageIPCFromRenderer.StartTimer
  body: null
}

export interface StopTimerIPCFromMain {
  type: ESyncMessageIPCFromRenderer.StopTimer
  body: null
}

export type SyncMessageIPCFromRenderer =
  | AppStartIPCFromRenderer
  | StartTimerIPCFromRenderer
  | StopTimerIPCFromRenderer
