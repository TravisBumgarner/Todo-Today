import React from 'react'
const { ipcRenderer } = window.require('electron');

import { TProject, TSettings, TTask, TTodoList, TDateFormat, TWeekStart, TColorTheme } from 'sharedTypes'

type State = {
    projects: Record<string, TProject>
    tasks: Record<string, TTask>
    todoList: Record<string, { projectId: string, taskId: string, duration: number }[]>
    settings: TSettings
}

const EMPTY_STATE: State = {
    projects: {},
    tasks: {},
    todoList: {},
    settings: {
        dateFormat: TDateFormat.A,
        weekStart: TWeekStart.SUNDAY,
        colorTheme: TColorTheme.BEACH
    }
}

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

type ToggleTodoListItemToSelectedDate = {
    type: 'TOGGLE_TODO_LIST_ITEM_FOR_SELECTED_DATE'
    payload: { shouldExistOnSelectedDate: boolean, projectId: string, taskId: string, selectedDate: string }
}

type EditTodoListItem = {
    type: 'EDIT_TODO_LIST_ITEM'
    payload: { selectedDate: string, isChecked: boolean, taskId: string, projectId: string, duration: number }
}

type EditUserSettings = {
    type: 'EDIT_USER_SETTINGS',
    payload: TSettings
}

type HydrateApp = {
    type: "HYDRATE_APP",
    payload: State
}

type Action =
    | HydrateApp
    | AddProject
    | EditProject
    | AddTask
    | EditTask
    | ToggleTodoListItemToSelectedDate
    | EditTodoListItem
    | AddTodoList
    | EditUserSettings

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
        case 'HYDRATE_APP': {
            return { ...action.payload }
        }
        case 'ADD_TODO_LIST': {
            return { ...state, todoList: { ...state.todoList, [action.payload.date]: [] } }
        }
        case 'ADD_PROJECT':
        case 'EDIT_PROJECT': {
            const updatedProjects = { ...state.projects, [action.payload.id]: action.payload }
            return { ...state, projects: updatedProjects }
        }
        case 'ADD_TASK':
        case 'EDIT_TASK': {
            const updatedTasks = { ...state.tasks, [action.payload.id]: action.payload }
            return { ...state, tasks: updatedTasks }
        }
        case 'TOGGLE_TODO_LIST_ITEM_FOR_SELECTED_DATE': {
            const { selectedDate, taskId, projectId, shouldExistOnSelectedDate } = action.payload

            let todoListForSelectedDate = [...state.todoList[selectedDate]]

            if (shouldExistOnSelectedDate) {
                todoListForSelectedDate.push({ projectId, taskId, duration: 0 })
            } else {
                todoListForSelectedDate = [...todoListForSelectedDate.filter(todoListItem => todoListItem.taskId !== taskId)]
            }
            return { ...state, todoList: { ...state.todoList, [selectedDate]: todoListForSelectedDate } }

        }
        case 'EDIT_TODO_LIST_ITEM': {
            const updatedTodoListForDate = [...state.todoList[action.payload.selectedDate]]
                .filter(({ taskId }) => taskId !== action.payload.taskId)
            updatedTodoListForDate.push({ projectId: action.payload.projectId, taskId: action.payload.taskId, duration: action.payload.duration })

            return { ...state, todoList: { ...state.todoList, [action.payload.selectedDate]: updatedTodoListForDate } }
        }
        case 'EDIT_USER_SETTINGS': {
            return { ...state, settings: { ...action.payload } }
        }
        default: {
            console.log(`Swallowing action: ${JSON.stringify(action)}`)
            return state
        }
    }
}

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = React.useReducer(reducer, EMPTY_STATE)
    const [isHydratingApp, setIsHydratingApp] = React.useState<boolean>(true)

    const { Provider } = context

    React.useEffect(() => {
        ipcRenderer.invoke('hydrate-app').then((r: string) => {
            dispatch({ type: "HYDRATE_APP", payload: JSON.parse(r) })
            setIsHydratingApp(false)
        })
    }, [])

    React.useEffect(() => {
        if(isHydratingApp) return // Don't send empty state to backend. 

        ipcRenderer.send('state-change', {payload: state})
    }, [state])

    if (isHydratingApp) {
        return <p>Loading...</p>
    }

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