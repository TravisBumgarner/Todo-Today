import React from 'react'

import { EDateFormat, EWeekStart, EColorTheme, EBackupInterval, TSettings, EDaysOfWeek, TReminder } from 'sharedTypes'
import { RefreshRemindersIPC } from '../../shared/types'

const { ipcRenderer } = window.require('electron')

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'TRUE'

type State = {
    dateFormat: EDateFormat
    weekStart: EWeekStart
    colorTheme: EColorTheme
    backupInterval: EBackupInterval
    reminders: TReminder[]
}

const EMPTY_STATE: State = {
    dateFormat: EDateFormat.A,
    weekStart: EWeekStart.SUNDAY,
    colorTheme: EColorTheme.BEACH,
    backupInterval: EBackupInterval.DAILY,
    reminders: []
}

const initialSetup = () => {
    Object
        .keys(EMPTY_STATE)
        .forEach((key: keyof typeof EMPTY_STATE) => localStorage.setItem(key, JSON.stringify(EMPTY_STATE[key])))

    localStorage.setItem(HAS_DONE_WARM_START, TRUE)
}

const getKeysFromStorage = () => {
    // This function is bad. :shrug:
    const output: Record<string, string> = {}

    Object
        .keys(EMPTY_STATE)
        .forEach((key: string) => {
            output[key] = (JSON.parse(localStorage.getItem(key) as string))
        })
    return output as unknown as State
}

const updateKeysInLocalStorage = (data: Record<string, string>) => {
    Object.keys(data).forEach((key) => localStorage.setItem(key, JSON.stringify(data[key])))
}

type HydrateUserSettings = {
    type: 'HYDRATE_USER_SETTINGS',
    payload: TSettings
}

type EditUserSettings = {
    type: 'EDIT_USER_SETTINGS',
    payload: Partial<Omit<TSettings, 'reminders'>>
}

type AddReminder = {
    type: "ADD_REMINDER",
    payload: TReminder
}

type DeleteReminder = {
    type: "DELETE_REMINDER",
    payload: {
        deletedReminderIndex: string
    }
}

type Action =
    | EditUserSettings
    | HydrateUserSettings
    | AddReminder
    | DeleteReminder

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "HYDRATE_USER_SETTINGS": {
            return { ...state, ...action.payload }
        }
        case "EDIT_USER_SETTINGS": {
            updateKeysInLocalStorage(action.payload)
            return { ...state, ...action.payload }
        }
        case "ADD_REMINDER": {
            const reminders = [...state.reminders]
            reminders.push(action.payload)
            localStorage.setItem('reminders', JSON.stringify(reminders))
            return { ...state, reminders }
        }
        case "DELETE_REMINDER": {
            const reminders = [...state.reminders.filter(({ reminderIndex }) => reminderIndex !== action.payload.deletedReminderIndex)]
            localStorage.setItem('reminders', JSON.stringify(reminders))
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
        const payload = { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10), dayOfWeek: parseInt(dayOfWeek, 10) }
        return payload
    })
    return payload

}

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = React.useReducer(reducer, EMPTY_STATE)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    React.useEffect(() => {
        const fetchData = async () => {
            if (localStorage.getItem(HAS_DONE_WARM_START) !== TRUE) {
                initialSetup()
                setIsLoading(false)
            } else {
                // On Restart, reminderIndexes are stale because they don't exist on the backend anymore. 
                const currentLocalStorage = getKeysFromStorage()
                const refreshedReminders = await ipcRenderer.invoke('refresh-reminder-ids', prepareRemindersPayload(currentLocalStorage.reminders))
                dispatch({ type: 'HYDRATE_USER_SETTINGS', payload: { ...currentLocalStorage, reminders: refreshedReminders } })
            }
        }
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
