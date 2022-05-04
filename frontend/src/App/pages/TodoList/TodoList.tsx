import React from 'react'
import moment from 'moment'

import { BigBoxOfNothing, Button, ButtonWrapper, Heading, Paragraph } from 'sharedComponents'
import { TTodoListItem } from 'sharedTypes'
import { TodoListTable, ManageTodoListItemsModal } from './components'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

const getProjectIdsWithTodoListItems = (todoListItems: TTodoListItem[]) => {
    const ids: string[] = []
    todoListItems.forEach(({ projectId }) => {
        if (!ids.includes(projectId)) ids.push(projectId)
    })
    console.log('ids', ids)
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
    console.log(todoListItems)

    const getPreviousDay = () => {
        setSelectedDate(moment(selectedDate).subtract(1, 'day'))
    }
    const getNextDay = () => {
        setSelectedDate(moment(selectedDate).add(1, 'day'))
    }

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
                todoListItems && todoListItems.length
                    ? (
                        getProjectIdsWithTodoListItems(todoListItems).map(projectId => <TodoListTable todoListItems={todoListItems} selectedDate={selectedDate} projectId={projectId} />)
                    ) : <BigBoxOfNothing message='Click Manage Tasks above to get started' />
            }


            <ManageTodoListItemsModal selectedDate={selectedDate} showModal={showManagementModal} setShowModal={setShowManagementModal} />
        </>
    )
}

export default TodoList
