import React from 'react'

import {
    Task,
    Agenda
} from '../../../../../sharedTypes'
import { AgendaAction, AGENDA_ITEM_CREATED, AGENDA_ITEM_DELETED } from './agendaActions'

type State = {
    agenda: Agenda
}

const EMPTY_STATE: State = {
    agenda: ['task-task1']
}

const context = React.createContext(
    {
        state: EMPTY_STATE,
        dispatch: () => { }
    } as {
        state: State,
        dispatch: React.Dispatch<Action>
    })

type Action =
    | AgendaAction

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case AGENDA_ITEM_CREATED: {
            if (!state.agenda.includes(action.data.id)) {
                return { ...state, agenda: [...state.agenda, action.data.id] }
            } else {
                return state
            }
        }
        case AGENDA_ITEM_DELETED: {
            if (state.agenda.includes(action.data.id)) {
                const modifiedAgenda = [...state.agenda].filter(taskId => taskId !== action.data.id)
                return { ...state, agenda: [...modifiedAgenda] }
            } else {
                return state
            }
        }
        default: {
            console.error("Swallowing action", action)
            return state
        }
    }
}

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = React.useReducer(reducer, EMPTY_STATE)

    const Provider = context.Provider

    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    )
}

export default ResultsContext
export {
    context,
    Action,
}