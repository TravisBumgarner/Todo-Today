import React, { createContext, useReducer, useState, type Dispatch, useEffect } from 'react'

import { EColorTheme, EBackupInterval, type TSettings, type TDateISODate } from 'sharedTypes'
import { formatDateKeyLookup, getLocalStorage, setLocalStorage } from 'utilities'
import { type AppStartIPC } from '../../shared/types'
import moment from 'moment'
import { type ActiveModal } from './modals/LazyLoadModal'
const { ipcRenderer } = window.require('electron')

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'TRUE'

export interface State {
  settings: {
    colorTheme: EColorTheme
    backupInterval: EBackupInterval
    backupDir: string
  }
  activeModal: ActiveModal | null
  selectedDate: TDateISODate
  restoreInProgress: boolean
}

const EMPTY_STATE: State = {
  settings: {
    colorTheme: EColorTheme.BEACH,
    backupInterval: EBackupInterval.OFF,
    backupDir: ''
  },
  activeModal: null,
  selectedDate: formatDateKeyLookup(moment()),
  restoreInProgress: false
}
const initialSetup = () => {
  Object
    .keys(EMPTY_STATE.settings)
    .forEach((key: keyof typeof EMPTY_STATE['settings']) => { setLocalStorage(key, EMPTY_STATE.settings[key]) })

  setLocalStorage(HAS_DONE_WARM_START, TRUE)
}

const getKeysFromStorage = () => {
  const output: Record<string, string> = {}

  Object
    .keys(EMPTY_STATE.settings)
    .forEach((key: string) => {
      output[key] = getLocalStorage(key) as string
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
    key: string
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

type Action =
  | EditUserSettings
  | HydrateUserSettings
  | SetActiveModal
  | ClearActiveModal
  | SetSelectedDate
  | RestoreStarted
  | RestoreEnded

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
      const { backupDir }: AppStartIPC = await ipcRenderer.invoke('app-start')

      if (getLocalStorage(HAS_DONE_WARM_START) !== TRUE) {
        initialSetup()
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
