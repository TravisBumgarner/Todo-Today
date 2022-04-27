import React from 'react'
import moment from 'moment'

import { Button, Heading } from 'sharedComponents'
import {TTodoListItem} from 'sharedTypes'
import { TodoListTable } from './components'
import { formatDateKeyLookup } from 'utilities'
import { context } from 'Context'

const groupItemsByProjectId = (todoListItems: TTodoListItem[]) => {
    const output: Record<string, TTodoListItem[]> = {}

    todoListItems.forEach(({duration, projectId, taskId}) => {
        if (!(projectId in output)){
            output[projectId] = []
        }
        output[projectId].push({duration, projectId, taskId})
    })

    return output
}

const TodoToday = () => {
    const {state, dispatch} = React.useContext(context)
    const [selectedDate, setSelectedDate] = React.useState<moment.Moment>(moment())

    const getPreviousDay = () => setSelectedDate(moment(selectedDate).subtract(1, 'day'))
    const getNextDay = () => setSelectedDate(moment(selectedDate).add(1, 'day'))
    
    const todoListItems = state.todoList[formatDateKeyLookup(selectedDate) as keyof typeof state.todoList]
    const todoListItemsByProjectId = groupItemsByProjectId(todoListItems)
    
    return (
        <>
            <Heading.H2>{selectedDate.format('dddd, MMMM Do YYYY')}</Heading.H2>
            <Button onClick={getPreviousDay} variation='FOREGROUND_PRIMARY'>Previous Day</Button>
            <Button onClick={getNextDay} variation='FOREGROUND_PRIMARY'>Next Day</Button>
            {
                Object.keys(todoListItemsByProjectId).map(projectId => <TodoListTable selectedDate={selectedDate} key={projectId} projectId={projectId} todoListItems={todoListItemsByProjectId[projectId]} />)
            }
        </>
    )
}

export default TodoToday
