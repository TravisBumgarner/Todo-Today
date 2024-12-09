import { createContext, useEffect, useReducer, useState, type Dispatch } from 'react'

import { DEFAULT_WORKSPACE } from 'database'
import { ESyncMessageIPC } from 'shared/types'
import { EBackupInterval, EColorTheme, type TSettings } from 'types'
import { getLocalStorage, sendSyncIPCMessage, setLocalStorage } from 'utilities'
import { type ActiveModal } from './modals/RenderModal'

const HAS_DONE_WARM_START = 'hasDoneWarmStart'
const TRUE = 'TRUE'

export interface State {
  message: {
    text: string
    severity: 'error' | 'warning' | 'info' | 'success'
    confirmCallback?: () => void
    confirmCallbackText?: string
    cancelCallback?: () => void
    cancelCallbackText?: string
  } | null
  settings: {
    colorTheme: EColorTheme
    backupInterval: EBackupInterval
    backupDir: string
    lastBackup: string
    concurrentTodoListItems: number
  }
  activeModal: ActiveModal | null
  restoreInProgress: boolean
  activeWorkspaceId: string
}

const EMPTY_STATE: State = {
  settings: {
    colorTheme: EColorTheme.BEACH,
    backupInterval: EBackupInterval.OFF,
    backupDir: '',
    lastBackup: '',
    concurrentTodoListItems: 1
  },
  activeWorkspaceId: DEFAULT_WORKSPACE.id,
  activeModal: null,
  restoreInProgress: false,
  message: null,
}
const initialSetup = (backupDir: string) => {
  Object
    .keys(EMPTY_STATE.settings)
    .forEach((key) => { setLocalStorage(key as keyof typeof EMPTY_STATE['settings'], EMPTY_STATE.settings[key as keyof typeof EMPTY_STATE['settings']]) })

  setLocalStorage('backupDir', backupDir)
  setLocalStorage(HAS_DONE_WARM_START, TRUE)
  setLocalStorage('activeWorkspaceId', DEFAULT_WORKSPACE.id)
}

const getSettingsFromLocalStorage = () => {
  const output: Record<string, string> = {}

  Object
    .keys(EMPTY_STATE.settings)
    .forEach((key) => {
      output[key] = getLocalStorage(key as keyof State['settings'])
    })
  return output as unknown as State['settings']
}

interface HydrateUserSettings {
  type: 'HYDRATE_USER_SETTINGS'
  payload: TSettings
}

interface EditUserSettings {
  type: 'EDIT_USER_SETTING'
  payload: {
    key: keyof State['settings']
    value: string | number
  }
}

interface SetActiveModal {
  type: 'SET_ACTIVE_MODAL'
  payload: ActiveModal
}

interface ClearActiveModal {
  type: 'CLEAR_ACTIVE_MODAL'
}

interface RestoreStarted {
  type: 'RESTORE_STARTED'
}

interface RestoreEnded {
  type: 'RESTORE_ENDED'
}

interface ChangeWorkspace {
  type: 'CHANGE_WORKSPACE'
  payload: {
    workspaceId: string
  }
}

interface AddMessage {
  type: 'ADD_MESSAGE'
  payload: {
    text: string
    severity: 'error' | 'warning' | 'info' | 'success'
    url?: string
    confirmCallback?: () => void
    confirmCallbackText?: string
    cancelCallback?: () => void
    cancelCallbackText?: string
  }
}

interface DeleteMessage {
  type: 'DELETE_MESSAGE'
}


export type Action =
  | EditUserSettings
  | HydrateUserSettings
  | SetActiveModal
  | ClearActiveModal
  | RestoreStarted
  | RestoreEnded
  | AddMessage
  | DeleteMessage
  | ChangeWorkspace

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'HYDRATE_USER_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } }
    }
    case 'EDIT_USER_SETTING': {
      const { key, value } = action.payload
      setLocalStorage(key, value)
      return { ...state, settings: { ...state.settings, [key]: value } }
    }
    case 'SET_ACTIVE_MODAL': {
      return { ...state, activeModal: action.payload }
    }
    case 'CLEAR_ACTIVE_MODAL': {
      return { ...state, activeModal: null }
    }
    case 'RESTORE_STARTED': {
      return { ...state, restoreInProgress: true }
    }
    case 'RESTORE_ENDED': {
      return { ...state, restoreInProgress: false }
    }
    case 'ADD_MESSAGE': {
      return { ...state, message: { ...action.payload } }
    }
    case 'DELETE_MESSAGE': {
      return { ...state, message: null }
    }
    case 'CHANGE_WORKSPACE': {
      const { workspaceId } = action.payload
      setLocalStorage('activeWorkspaceId', workspaceId)
      return { ...state, activeWorkspaceId: workspaceId }
    }
    default:
      throw new Error('Unexpected action')
  }
}

const context = createContext(
  {
    state: EMPTY_STATE,
    dispatch: () => { }
  } as {
    state: State
    dispatch: Dispatch<Action>
  }
)

const ResultsContext = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      const { backupDir } = await sendSyncIPCMessage({ type: ESyncMessageIPC.AppStart, body: null })
      if (getLocalStorage(HAS_DONE_WARM_START) !== TRUE) {
        initialSetup(backupDir)
      } else {
        const localStorageSettings = getSettingsFromLocalStorage()
        const payload = { ...localStorageSettings, backupDir }
        dispatch({ type: 'HYDRATE_USER_SETTINGS', payload })
      }
    }

    setIsLoading(true)
    void fetchData().then(() => { setIsLoading(false) })
  }, [])

  if (isLoading) {
    return <p>Loading...</p>
  }

  const { Provider } = context

  return (
    <Provider value={{ state, dispatch }}>
      {children}
    </Provider>
  )
}

export default ResultsContext
export {
  context
}
