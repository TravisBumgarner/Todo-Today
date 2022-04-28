import React from 'react'
import moment from 'moment'

import { BigBoxOfNothing, Button, ButtonWrapper, Heading, Paragraph } from 'sharedComponents'
import { TTodoListItem } from 'sharedTypes'
import { TodoListTable, ManageTodoListItemsModal } from './components'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
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
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
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

    const TodoListTables = Object
        .keys(todoListItemsByProjectId)
        .map(projectId => <TodoListTable
            selectedDate={selectedDate}
            key={projectId}
            projectId={projectId}
            todoListItems={todoListItemsByProjectId[projectId]}
        />
        )


    return (
        <>
            <Heading.H2>{formatDateDisplayString(selectedDate)}</Heading.H2>
            <ButtonWrapper
                left={[
                    <Button onClick={getPreviousDay} variation='PRIMARY_BUTTON'>Previous Day</Button>,
                    <Button onClick={getNextDay} variation='PRIMARY_BUTTON'>Next Day</Button>]}
                right={[<Button onClick={() => setShowManagementModal(true)} variation='PRIMARY_BUTTON'>Manage Tasks</Button>]}
            />


            {
                Object.keys(todoListItemsByProjectId).length == 0
                    ? (<BigBoxOfNothing message="Click the Manage Tasks button above to get started!" />)
                    : (TodoListTables)
            }
            <ManageTodoListItemsModal selectedDate={selectedDate} showModal={showManagementModal} setShowModal={setShowManagementModal} />
        </>
    )
}

export default TodoToday
