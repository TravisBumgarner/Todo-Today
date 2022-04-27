import moment from 'moment'
import React from 'react'

import { TProject, TTask, TTodoList, TTodoListItem } from 'sharedTypes'
import dataStore from './dataStore.json'

type State = {
  projects: Record<string, TProject>
  tasks: Record<string, TTask>
  todoList: Record<string, {projectId: string, taskId: string, duration: number}[]>
  
}


const EMPTY_STATE: State = {
    ...dataStore,
} as State

type AddTodoList = {
    type: 'ADD_TODO_LIST'
    payload: TTodoList
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

type AddTodoItem = {
    type: 'ADD_TODO_ITEM'
    payload: {todoListItem: TTodoListItem, selectedDate: string}
}

type EditTodoItem = {
    type: 'EDIT_TODO_ITEM'
    payload: {todoListItem: TTodoListItem, selectedDate: string}
}


type Action =
    | AddProject
    | EditProject
    | AddTask
    | EditTask
    | AddTodoItem
    | EditTodoItem
    | AddTodoList

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
        case 'ADD_TODO_LIST': {
            console.log('action', action)
            return {...state, todoList: {...state.todoList, [action.payload.date]: []}}
        }
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
        case 'ADD_TODO_ITEM': {
            return state
        }
        case 'EDIT_TODO_ITEM': {
            const updatedTodoListForDate = [...state.todoList[action.payload.selectedDate]]
                .filter(({taskId}) => taskId !== action.payload.todoListItem.taskId)
            updatedTodoListForDate.push(action.payload.todoListItem)
            
            return {...state, todoList: {...state.todoList, [action.payload.selectedDate]: updatedTodoListForDate}  }
        }
        default: {
            console.log(action)
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