import { createContext, useReducer, useState, type Dispatch, useEffect } from 'react'
import moment from 'moment'

import { EColorTheme, EBackupInterval, type TSettings, type TDateISODate, EActivePage } from 'types'
import { formatDateKeyLookup, getLocalStorage, sendIPCMessage, setLocalStorage } from 'utilities'
import { EMessageIPCFromRenderer } from 'shared/types'
import { type ActiveModal } from './modals/RenderModal'

const HAS_DONE_WARM_START = 'hasDoneWarmStart'
const TRUE = 'TRUE'

export interface State {
  message: {
    text: string
    severity: 'error' | 'warning' | 'info' | 'success'
  } | null
  settings: {
    colorTheme: EColorTheme
    backupInterval: EBackupInterval
    backupDir: string
  }
  activeModal: ActiveModal | null
  selectedDate: TDateISODate
  restoreInProgress: boolean
  activePage: EActivePage
}

const EMPTY_STATE: State = {
  settings: {
    colorTheme: EColorTheme.BEACH,
    backupInterval: EBackupInterval.OFF,
    backupDir: ''
  },
  activeModal: null,
  selectedDate: formatDateKeyLookup(moment()),
  restoreInProgress: false,
  activePage: EActivePage.Home,
  message: null

}
const initialSetup = (backupDir: string) => {
  Object
    .keys(EMPTY_STATE.settings)
    .forEach((key) => { setLocalStorage(key as keyof typeof EMPTY_STATE['settings'], EMPTY_STATE.settings[key as keyof typeof EMPTY_STATE['settings']]) })

  setLocalStorage('backupDir', backupDir)
  setLocalStorage(HAS_DONE_WARM_START, TRUE)
}

const getKeysFromStorage = () => {
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
    value: string
  }
}

interface SetActiveModal {
  type: 'SET_ACTIVE_MODAL'
  payload: ActiveModal
}

interface SetSelectedDate {
  type: 'SET_SELECTED_DATE'
  payload: {
    date: TDateISODate
  }
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

interface SetActivePage {
  type: 'SET_ACTIVE_PAGE'
  payload: {
    page: EActivePage
  }
}

interface AddMessage {
  type: 'ADD_MESSAGE'
  data: {
    text: string
    severity: 'error' | 'warning' | 'info' | 'success'
    url?: string
  }
}

interface DeleteMessage {
  type: 'DELETE_MESSAGE'
}

type Action =
  | EditUserSettings
  | HydrateUserSettings
  | SetActiveModal
  | ClearActiveModal
  | SetSelectedDate
  | RestoreStarted
  | RestoreEnded
  | SetActivePage
  | AddMessage
  | DeleteMessage

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
    case 'SET_SELECTED_DATE': {
      const { date } = action.payload
      return { ...state, selectedDate: date }
    }
    case 'RESTORE_STARTED': {
      return { ...state, restoreInProgress: true }
    }
    case 'RESTORE_ENDED': {
      return { ...state, restoreInProgress: false }
    }
    case 'SET_ACTIVE_PAGE': {
      const { page } = action.payload
      return { ...state, activePage: page }
    }
    case 'ADD_MESSAGE': {
      return { ...state, message: { ...action.data } }
    }
    case 'DELETE_MESSAGE': {
      return { ...state, message: null }
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
      const { backupDir } = await sendIPCMessage({ type: EMessageIPCFromRenderer.AppStart })
      if (getLocalStorage(HAS_DONE_WARM_START) !== TRUE) {
        initialSetup(backupDir)
      } else {
        const currentLocalStorage = getKeysFromStorage()
        const payload = { ...currentLocalStorage, backupDir }
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
