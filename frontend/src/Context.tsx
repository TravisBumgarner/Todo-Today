import React from 'react'

import { TDateFormat, TWeekStart, TColorTheme, TBackupInterval, TSettings } from 'sharedTypes'

const HAS_DONE_WARM_START = 'HAS_DONE_WARM_START'
const TRUE = 'TRUE'

type State = {
    dateFormat: TDateFormat
    weekStart: TWeekStart
    colorTheme: TColorTheme
    backupInterval: TBackupInterval
}

const EMPTY_STATE: State = {
    dateFormat: TDateFormat.A,
    weekStart: TWeekStart.SUNDAY,
    colorTheme: TColorTheme.SUNSET,
    backupInterval: TBackupInterval.DAILY
}

const initialSetup = () => {
    Object
        .keys(EMPTY_STATE)
        .forEach((key: keyof typeof EMPTY_STATE) => localStorage.setItem(key, EMPTY_STATE[key]))

    localStorage.setItem(HAS_DONE_WARM_START, TRUE)
}

const getKeysFromStorage = () => {
    // This function is bad. :shrug:
    const output: Record<string, string> = {}

    Object
        .keys(EMPTY_STATE)
        .forEach((key: string) => {
            output[key] = (localStorage.getItem(key)) as string
        })
    return output as unknown as State
}

const updateKeysInLocalStorage = (data: Record<string, string>) => {
    Object.keys(data).forEach((key) => localStorage.setItem(key, data[key]))
}

type HydrateUserSettings = {
    type: 'HYDRATE_USER_SETTINGS',
    payload: TSettings
}

type EditUserSettings = {
    type: 'EDIT_USER_SETTINGS',
    payload: Partial<TSettings>
}

const reducer = (state: State, action: EditUserSettings | HydrateUserSettings): State => {
    switch (action.type) {
        default: {
            updateKeysInLocalStorage(action.payload)
            return { ...state, ...action.payload }
        }
    }
}

const context = React.createContext(
    {
        state: EMPTY_STATE,
        dispatch: () => { },
    } as {
        state: State,
        dispatch: React.Dispatch<EditUserSettings>
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
