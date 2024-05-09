export enum ESyncMessageIPC {
  AppStart = 'app-start',
  ResumeTimer = 'resume-timer',
}

export interface AppStartIPCFromRenderer {
  type: ESyncMessageIPC.AppStart
  body: null
}

export interface AppStartIPCFromMain {
  type: ESyncMessageIPC.AppStart
  body: {
    backupDir: string
  }
}

export interface ResumeTimerIPCFromRenderer {
  type: ESyncMessageIPC.ResumeTimer
  body: null
}

export interface ResumeTimerIPCFromMain {
  type: ESyncMessageIPC.ResumeTimer
  body: {
    timerDuration: number
  }
}

export type SyncMessageIPCFromRenderer =
  | AppStartIPCFromRenderer
  | ResumeTimerIPCFromRenderer
