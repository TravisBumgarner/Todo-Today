import React from 'react'

import { EDateFormat, EColorTheme, EBackupInterval, TSettings, TReminder } from 'sharedTypes'
import { getLocalStorage, setLocalStorage } from 'utilities'
import { RefreshRemindersIPC, AppStartIPC } from '../../shared/types'

const { ipcRenderer } = window.require('electron')

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'TRUE'

type State = {
    dateFormat: EDateFormat
    colorTheme: EColorTheme
    backupInterval: EBackupInterval
    reminders: TReminder[]
    backupDir: string
}

const EMPTY_STATE: State = {
    dateFormat: EDateFormat.A,
    colorTheme: EColorTheme.BEACH,
    backupInterval: EBackupInterval.DAILY,
    reminders: [],
    backupDir: ''
}

const initialSetup = () => {
    Object
        .keys(EMPTY_STATE)
        .forEach((key: keyof typeof EMPTY_STATE) => setLocalStorage(key, EMPTY_STATE[key]))

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

type HydrateUserSettings = {
    type: 'HYDRATE_USER_SETTINGS',
    payload: Partial<TSettings>
}

type EditUserSettings = {
    type: 'EDIT_USER_SETTING',
    payload: {
        key: string
        value: string
    }
}

type AddReminder = {
    type: 'ADD_REMINDER',
    payload: TReminder
}

type EditReminder = {
    type: 'EDIT_REMINDER',
    payload: TReminder
}

type DeleteReminder = {
    type: 'DELETE_REMINDER',
    payload: {
        deletedReminderIndex: string
    }
}

type Action =
    | EditUserSettings
    | HydrateUserSettings
    | AddReminder
    | EditReminder
    | DeleteReminder

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
        case 'ADD_REMINDER': {
            const reminders = [...state.reminders]
            reminders.push(action.payload)
            setLocalStorage('reminders', reminders)
            return { ...state, reminders }
        }
        case 'EDIT_REMINDER': {
            const reminders = [...state.reminders.filter(({ reminderIndex }) => reminderIndex !== action.payload.reminderIndex)]
            reminders.push(action.payload)
            setLocalStorage('reminders', reminders)
            return { ...state, reminders }
        }
        case 'DELETE_REMINDER': {
            const reminders = [...state.reminders.filter(({ reminderIndex }) => reminderIndex !== action.payload.deletedReminderIndex)]
            setLocalStorage('reminders', reminders)
            return { ...state, reminders }
        }
        default:
            throw new Error('Unexpected action')
    }
}

const context = React.createContext(
    {
        state: EMPTY_STATE,
        dispatch: () => { },
    } as {
        state: State,
        dispatch: React.Dispatch<Action>
    },
)

const prepareRemindersPayload = (reminders: TReminder[]) => {
    const payload: RefreshRemindersIPC = reminders.map(({ hours, minutes, dayOfWeek }) => {
        return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10), dayOfWeek: parseInt(dayOfWeek, 10) }
    })
    return payload
}

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = React.useReducer(reducer, EMPTY_STATE)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        const fetchData = async () => {
            let payload: Partial<TSettings> = {}
            const { backupDir }: AppStartIPC = await ipcRenderer.invoke('app-start')
            payload.backupDir = backupDir
            if (getLocalStorage(HAS_DONE_WARM_START) !== TRUE) {
                initialSetup()
            } else {
                // On Restart, reminderIndexes are stale because they don't exist on the backend anymore.
                const currentLocalStorage = await getKeysFromStorage()
                const refreshedReminders = await ipcRenderer.invoke('refresh-reminder-ids', prepareRemindersPayload(currentLocalStorage.reminders))

                payload = { ...currentLocalStorage, ...payload, reminders: refreshedReminders }
            }
            dispatch({ type: 'HYDRATE_USER_SETTINGS', payload })
        }

        setIsLoading(true)
        fetchData()
        setIsLoading(false)
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
