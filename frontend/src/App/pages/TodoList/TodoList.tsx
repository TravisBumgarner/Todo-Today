import React from 'react'
import moment from 'moment'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'

import { Button, ButtonWrapper, ConfirmationModal, Heading } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup, formatDurationDisplayString, sumArray } from 'utilities'
import database from 'database'
import { TDateISODate } from 'sharedTypes'
import { context } from 'Context'
import { TodoListTable, ManageTodoListItemsModal } from './components'

const TodoList = () => {
    const [selectedDate, setSelectedDate] = React.useState<TDateISODate>(formatDateKeyLookup(moment()))
    const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)
    const [showNothingToCopyModal, setShowNothingToCopyModal] = React.useState<boolean>(false)
    const { state: { dateFormat } } = React.useContext(context)

    const todoListItems = useLiveQuery(
        () => database
            .todoListItems
            .where('todoListDate')
            .equals(selectedDate)
            .toArray(),
        [selectedDate]
    )

    const setPreviousDate = () => {
        setSelectedDate(formatDateKeyLookup(moment(selectedDate).subtract(1, 'day')))
    }

    const getNextDate = () => {
        setSelectedDate(formatDateKeyLookup(moment(selectedDate).add(1, 'day')))
    }

    const getToday = () => {
        setSelectedDate(formatDateKeyLookup(moment()))
    }

    const getPreviousDatesTasks = async () => {
        const previousDay = await database
            .todoListItems
            .where('todoListDate')
            .equals(formatDateKeyLookup(moment(selectedDate).subtract(1, 'days')))
            .toArray()

        if(previousDay.length === 0 ){
            setShowNothingToCopyModal(true)
        } else (
            previousDay.map(async ({ projectId, taskId }) => {
                await database.todoListItems.add({
                    projectId,
                    taskId,
                    duration: 0,
                    id: uuid4(),
                    todoListDate: selectedDate
                })
            })
        )

       

    }

    const hoursWorkedSelectedDate = todoListItems
        ? `(${formatDurationDisplayString(sumArray(todoListItems.map(({ duration }) => duration)))} Worked)`
        : ''

    return (
        <>
            <Heading.H2>{formatDateDisplayString(dateFormat, selectedDate)} {hoursWorkedSelectedDate}</Heading.H2>
            <ButtonWrapper
                left={[
                    <Button key="today" disabled={todoListItems && todoListItems.length > 0} onClick={getPreviousDatesTasks} variation="PRIMARY_BUTTON">Copy Yesterday</Button>
                ]}
                right={[
                    <Button key="today" onClick={getToday} variation="PRIMARY_BUTTON">Today</Button>,
                    <Button key="previous" onClick={setPreviousDate} variation="PRIMARY_BUTTON">&lt;</Button>,
                    <Button key="next" onClick={getNextDate} variation="PRIMARY_BUTTON">&gt;</Button>,
                ]}
            />
            <TodoListTable todoListItems={todoListItems} selectedDate={selectedDate} />
            <Button key="manage" fullWidth onClick={() => setShowManagementModal(true)} variation="PRIMARY_BUTTON">Add Tasks</Button>
            <ManageTodoListItemsModal selectedDate={selectedDate} showModal={showManagementModal} setShowModal={setShowManagementModal} />
            <ConfirmationModal
                body="It looks like there's nothing to copy from yesterday."
                title="Heads Up!"
                confirmationCallback={() => setShowNothingToCopyModal(false)}
                showModal={showNothingToCopyModal}
                setShowModal={setShowNothingToCopyModal}
            />
        </>
    )
}

export default TodoList
