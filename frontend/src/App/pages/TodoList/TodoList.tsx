import React from 'react'
import moment from 'moment'

import { Button, Heading, Paragraph } from 'sharedComponents'
import { TTodoListItem } from 'sharedTypes'
import { TodoListTable, ManageTodoListItemsModal} from './components'
import { formatDateKeyLookup } from 'utilities'
import { context } from 'Context'

const groupItemsByProjectId = (todoListItems: TTodoListItem[]) => {
    const output: Record<string, TTodoListItem[]> = {}

    todoListItems.forEach(({ duration, projectId, taskId }) => {
        if (!(projectId in output)) {
            output[projectId] = []
        }
        output[projectId].push({ duration, projectId, taskId })
    })

    return output
}

const TodoToday = () => {
    const { state, dispatch } = React.useContext(context)
    const [selectedDate, setSelectedDate] = React.useState<moment.Moment>(moment())
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)

    const getPreviousDay = () => {
        setSelectedDate(moment(selectedDate).subtract(1, 'day'))
        setIsLoading(true)
    }
    const getNextDay = () => {
        setSelectedDate(moment(selectedDate).add(1, 'day'))
        setIsLoading(true)
    }

    React.useEffect(() => {
        if (!Object.keys(state.todoList).includes(formatDateKeyLookup(selectedDate))) {
            dispatch({ type: "ADD_TODO_LIST", payload: { date: formatDateKeyLookup(selectedDate) } })
        }
        setIsLoading(false)
    }, [formatDateKeyLookup(selectedDate)])

    if (isLoading) {
        return (
            <Paragraph>One sec...</Paragraph>
        )
    }
    const todoListItems = state.todoList[formatDateKeyLookup(selectedDate) as keyof typeof state.todoList]
    const todoListItemsByProjectId = groupItemsByProjectId(todoListItems)

    return (
        <>
            <Heading.H2>{selectedDate.format('dddd, MMMM Do YYYY')}</Heading.H2>
            <Button onClick={getPreviousDay} variation='FOREGROUND_PRIMARY'>Previous Day</Button>
            <Button onClick={getNextDay} variation='FOREGROUND_PRIMARY'>Next Day</Button>
            <Button onClick={() => setShowManagementModal(true)} variation='FOREGROUND_PRIMARY'>Manage Tasks</Button>
            {
                Object.keys(todoListItemsByProjectId).map(projectId => <TodoListTable selectedDate={selectedDate} key={projectId} projectId={projectId} todoListItems={todoListItemsByProjectId[projectId]} />)
            }
            <ManageTodoListItemsModal selectedDate={selectedDate} showModal={showManagementModal} setShowModal={setShowManagementModal}/>
        </>
    )
}

export default TodoToday
