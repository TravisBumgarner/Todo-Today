import React from 'react'

import { EDateFormat, EWeekStart, EColorTheme, EBackupInterval, TSettings, EDaysOfWeek, TReminder } from 'sharedTypes'

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'TRUE'

type State = {
    dateFormat: EDateFormat
    weekStart: EWeekStart
    colorTheme: EColorTheme
    backupInterval: EBackupInterval
    reminders: {
        timeOfDay: string,
        dayOfWeek: EDaysOfWeek,
        reminderIndex: number
    }[]
}

const EMPTY_STATE: State = {
    dateFormat: EDateFormat.A,
    weekStart: EWeekStart.SUNDAY,
    colorTheme: EColorTheme.SUNSET,
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
            console.log(localStorage.getItem(key))
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
    payload: Partial<TSettings>
}

type AddReminder = {
    type: "ADD_REMINDER",
    payload: TReminder
}

type Action =
    | EditUserSettings
    | HydrateUserSettings
    | AddReminder

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "EDIT_USER_SETTINGS":
        case "HYDRATE_USER_SETTINGS": {
            updateKeysInLocalStorage(action.payload)
            return { ...state, ...action.payload }
        }
        case "ADD_REMINDER": {
            const reminders = [...state.reminders]
            reminders.push(action.payload)
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

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = React.useReducer(reducer, EMPTY_STATE)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    React.useEffect(() => {
        if (localStorage.getItem(HAS_DONE_WARM_START) !== TRUE) {
            initialSetup()
            setIsLoading(false)
        } else {
            dispatch({ type: 'HYDRATE_USER_SETTINGS', payload: getKeysFromStorage() })
            setIsLoading(false)
        }
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
