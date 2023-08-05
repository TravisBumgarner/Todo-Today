import React, { createContext, useReducer, useState, type Dispatch, useEffect } from 'react'

import { EColorTheme, EBackupInterval, type TSettings, type TDateISODate } from 'sharedTypes'
import { formatDateKeyLookup, getLocalStorage, setLocalStorage } from 'utilities'
import { type AppStartIPC } from '../../shared/types'
import moment from 'moment'
import { type ModalID } from './modals/LazyLoadModal'

const { ipcRenderer } = window.require('electron')

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'TRUE'

interface State {
  colorTheme: EColorTheme
  backupInterval: EBackupInterval
  backupDir: string
  activeModal: { id: ModalID, data: any } | null
  selectedDate: TDateISODate
}

const EMPTY_STATE: State = {
  colorTheme: EColorTheme.BEACH,
  backupInterval: EBackupInterval.DAILY,
  backupDir: '',
  activeModal: null,
  selectedDate: formatDateKeyLookup(moment())
}
console.log(EMPTY_STATE)
const initialSetup = () => {
  Object
    .keys(EMPTY_STATE)
    .forEach((key: keyof typeof EMPTY_STATE) => { setLocalStorage(key, EMPTY_STATE[key]) })

  setLocalStorage(HAS_DONE_WARM_START, TRUE)
}

const getKeysFromStorage = () => {
  // This function is bad. :shrug:
  const output: Record<string, string> = {}

  Object
    .keys(EMPTY_STATE)
    .forEach((key: string) => {
      output[key] = getLocalStorage(key) as string
    })
  return output as unknown as State
}

interface HydrateUserSettings {
  type: 'HYDRATE_USER_SETTINGS'
  payload: Partial<TSettings>
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
  payload: {
    id: ModalID
    data?: any
  }
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

type Action =
  | EditUserSettings
  | HydrateUserSettings
  | SetActiveModal
  | ClearActiveModal
  | SetSelectedDate

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'HYDRATE_USER_SETTINGS': {
      return { ...state, ...action.payload }
    }
    case 'EDIT_USER_SETTING': {
      const { key, value } = action.payload
      setLocalStorage(key, value)
      return { ...state, [key]: value }
    }
    case 'SET_ACTIVE_MODAL': {
      const { id, data } = action.payload
      return { ...state, activeModal: { id, data } }
    }
    case 'CLEAR_ACTIVE_MODAL': {
      return { ...state, activeModal: null }
    }
    case 'SET_SELECTED_DATE': {
      const { date } = action.payload
      return { ...state, selectedDate: date }
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
      let payload: Partial<TSettings> = {}
      const { backupDir }: AppStartIPC = await ipcRenderer.invoke('app-start')
      payload.backupDir = backupDir
      if (getLocalStorage(HAS_DONE_WARM_START) !== TRUE) {
        initialSetup()
      } else {
        // On Restart, reminderIndexes are stale because they don't exist on the backend anymore.
        const currentLocalStorage = getKeysFromStorage()

        payload = { ...currentLocalStorage, ...payload }
      }
      dispatch({ type: 'HYDRATE_USER_SETTINGS', payload })
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
