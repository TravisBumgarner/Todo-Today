import React from 'react'

import { TProject, TProjectStatus, TTask, TTaskStatus } from 'sharedTypes'
import dataStore from './dataStore.json'

type State = {
  projects: Record<string, TProject>
  tasks: Record<string, TTask>
}

const EMPTY_STATE: State = {
    ...dataStore as State
}

type AddProject = {
    type: 'ADD_PROJECT'
    payload: TProject
}

type EditProject = {
    type: 'EDIT_PROJECT'
    payload: TProject
}

type AddTask = {
    type: 'ADD_TASK'
    payload: TTask
}

type EditTask = {
    type: 'EDIT_TASK'
    payload: TTask
}


type Action =
    | AddProject
    | EditProject
    | AddTask
    | EditTask

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
        case 'ADD_PROJECT':
        case 'EDIT_PROJECT': {
            const updatedProjects = {...state.projects, [action.payload.id]: action.payload}
            return {...state, projects: updatedProjects  }
        }
        case 'ADD_TASK': 
        case 'EDIT_TASK': {
            const updatedTasks = {...state.tasks, [action.payload.id]: action.payload}
            return {...state, tasks: updatedTasks  }
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