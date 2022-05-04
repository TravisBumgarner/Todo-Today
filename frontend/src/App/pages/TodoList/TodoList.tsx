import React from 'react'
import moment from 'moment'
import { useLiveQuery } from 'dexie-react-hooks'

import { BigBoxOfNothing, Button, ButtonWrapper, Heading, Paragraph } from 'sharedComponents'
import { TTodoListItem } from 'sharedTypes'
import { TodoListTable, ManageTodoListItemsModal } from './components'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import database from 'database'

const getProjectIdsWithTodoListItems = (todoListItems: TTodoListItem[]) => {
    const ids: string[] = []
    todoListItems.forEach(({ projectId }) => {
        if (!ids.includes(projectId)) ids.push(projectId)
    })
    return ids
}

const TodoList = () => {
    const [selectedDate, setSelectedDate] = React.useState<moment.Moment>(moment())
    const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)
    const todoListItems = useLiveQuery(() =>
        database
            .todoListItems
            .where('todoListDate')
            .equals(formatDateKeyLookup(selectedDate))
            .toArray(),
        [formatDateKeyLookup(selectedDate)]
    )

    const getPreviousDay = () => {
        setSelectedDate(moment(selectedDate).subtract(1, 'day'))
    }
    const getToday = () => {
        setSelectedDate(moment())
    }
    const getNextDay = () => {
        setSelectedDate(moment(selectedDate).add(1, 'day'))
    }

    return (
        <>
            <Heading.H2>{formatDateDisplayString(selectedDate)}</Heading.H2>
            <ButtonWrapper
                left={[
                    <Button key="previous" onClick={getPreviousDay} variation='PRIMARY_BUTTON'>Previous</Button>,
                    <Button key="next" onClick={getNextDay} variation='PRIMARY_BUTTON'>Next</Button>,
                    <Button key="today" onClick={getToday} variation='PRIMARY_BUTTON'>Today</Button>,
                ]}
                right={[<Button key="manage" onClick={() => setShowManagementModal(true)} variation='PRIMARY_BUTTON'>Manage Tasks</Button>]}
            />
            {
                todoListItems && todoListItems.length
                    ? (
                        getProjectIdsWithTodoListItems(todoListItems).map(projectId => <TodoListTable key={projectId} todoListItems={todoListItems} selectedDate={selectedDate} projectId={projectId} />)
                    ) : <BigBoxOfNothing message='Click Manage Tasks above to get started' />
            }


            <ManageTodoListItemsModal selectedDate={selectedDate} showModal={showManagementModal} setShowModal={setShowManagementModal} />
        </>
    )
}

export default TodoList
