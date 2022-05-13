import React from 'react'
import moment from 'moment'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'

import { BigBoxOfNothing, Button, ButtonWrapper, ConfirmationModal, Heading, Paragraph } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup, formatDurationDisplayString, sumArray } from 'utilities'
import database from 'database'
import { ETaskStatus, TDateISODate } from 'sharedTypes'
import { context } from 'Context'
import { TodoListTable, ManageTodoListItemsModal } from './components'

const TodoList = () => {
    const [selectedDate, setSelectedDate] = React.useState<TDateISODate>(formatDateKeyLookup(moment()))
    const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)
    const [showNothingToCopyModal, setShowNothingToCopyModal] = React.useState<boolean>(false)
    const { state: { dateFormat } } = React.useContext(context)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [taskCount, setTaskCount] = React.useState<number>(0)

    React.useEffect(() => {
        const fetch = async () => {
            const tasks = await database.tasks.toArray()
            setTaskCount(tasks ? tasks.length : 0)
            setIsLoading(false)
        }
        fetch()
    }, [])



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
            .where({
                todoListDate: formatDateKeyLookup(moment(selectedDate).subtract(1, 'days'))
            })
            .toArray()

        if (previousDay.length === 0) {
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

    if (isLoading) {
        return <Paragraph>One sec</Paragraph>
    }
    console.log('todolist', todoListItems)
    return (
        <>
            <Heading.H2>{formatDateDisplayString(dateFormat, selectedDate)} {hoursWorkedSelectedDate}</Heading.H2>
            <ButtonWrapper
                left={[
                    <Button key="today" disabled={todoListItems && todoListItems.length > 0} onClick={getPreviousDatesTasks} variation="INTERACTION">Copy Yesterday</Button>
                ]}
                right={[
                    <Button key="today" onClick={getToday} variation="INTERACTION">Today</Button>,
                    <Button key="previous" onClick={setPreviousDate} variation="INTERACTION">&lt;</Button>,
                    <Button key="next" onClick={getNextDate} variation="INTERACTION">&gt;</Button>,
                ]}
            />
            {taskCount > 0
                ? <TodoListTable todoListItems={todoListItems} selectedDate={selectedDate} />
                : <BigBoxOfNothing message="Go create some projects and tasks and come back!" />

            }
            <Button key="manage" disabled={taskCount === 0} fullWidth onClick={() => setShowManagementModal(true)} variation="INTERACTION">Add Tasks</Button>
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
