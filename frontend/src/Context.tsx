import React from 'react'

import { TProject, TProjectStatus } from 'sharedTypes'

type State = {
  projects: Record<string, TProject>
}

const FAKE_PROJECTS: Record<string, TProject> = {
    '1': {
        id: "1",
        title: "PTO",
        status: TProjectStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
    },
    '2': {
        id: "2",
        title: "Sick Time",
        status: TProjectStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
    }
}


const EMPTY_STATE: State = {
    projects: {...FAKE_PROJECTS}
}

type AddProject = {
    type: 'ADD_PROJECT'
    payload: TProject
}

type EditProject = {
    type: 'EDIT_PROJECT'
    payload: TProject
}


type Action =
    | AddProject
    | EditProject

const context = React.createContext(
    {
        state: EMPTY_STATE,
        dispatch: () => { },
    } as {
        state: State,
        dispatch: React.Dispatch<Action>
    },
)

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_PROJECT': {
            const updatedProjects = {...state.projects, [action.payload.id]: action.payload}
            return {...state, projects: updatedProjects  }
        }
        case 'EDIT_PROJECT': {
            const updatedProjects = {...state.projects, [action.payload.id]: action.payload}
            return {...state, projects: updatedProjects  }
        }
        default: {
            console.log(`Swallowing action: ${JSON.stringify(action)}`)
            return state
        }
    }
}

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = React.useReducer(reducer, EMPTY_STATE)

    const { Provider } = context

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