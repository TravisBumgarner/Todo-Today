import React from 'react'
import moment from 'moment'

import { BigBoxOfNothing, Button, ButtonWrapper, Heading, Paragraph } from 'sharedComponents'
import { TTodoListItem } from 'sharedTypes'
import { TodoListTable, ManageTodoListItemsModal } from './components'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

const groupItemsByProjectId = (todoListItems: TTodoListItem[]) => {
    const output: Record<string, TTodoListItem[]> = {}
    todoListItems.forEach(({ duration, projectId, taskId, date, id }) => {
        if (!(projectId in output)) {
            output[projectId] = []
        }
        output[projectId].push({ duration, projectId, taskId, date, id })
    })

    return output
}

const TodoList = () => {
    const [selectedDate, setSelectedDate] = React.useState<moment.Moment>(moment())
    const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)
    const todoListItems = useLiveQuery(() => database.todoListItems.toArray())

    const getPreviousDay = () => {
        setSelectedDate(moment(selectedDate).subtract(1, 'day'))
    }
    const getNextDay = () => {
        setSelectedDate(moment(selectedDate).add(1, 'day'))
    }

    if (!todoListItems) {
        return (
            <BigBoxOfNothing message='No todo list'/>
        )
    }

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
                    <Button key="previous" onClick={getPreviousDay} variation='PRIMARY_BUTTON'>Previous Day</Button>,
                    <Button key="next" onClick={getNextDay} variation='PRIMARY_BUTTON'>Next Day</Button>]}
                right={[<Button key="manage" onClick={() => setShowManagementModal(true)} variation='PRIMARY_BUTTON'>Manage Tasks</Button>]}
            />

            {
                Object.keys(todoListItemsByProjectId).length == 0
                    ? (<BigBoxOfNothing message="Click the Manage Tasks button above to get started!" />)
                    : (TodoListTables)
            }
            <ManageTodoListItemsModal selectedDate={selectedDate} todoListItemsByProjectId={todoListItemsByProjectId} showModal={showManagementModal} setShowModal={setShowManagementModal} />
        </>
    )
}

export default TodoList
