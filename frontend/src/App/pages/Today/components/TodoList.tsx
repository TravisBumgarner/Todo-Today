import React from 'react'
import moment from 'moment'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'

import { BigBoxOfNothing, Button, ButtonWrapper, ConfirmationModal, Heading, Paragraph } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup, formatDurationDisplayString, sumArray } from 'utilities'
import database from 'database'
import { ETaskStatus, TDateISODate } from 'sharedTypes'
import { context } from 'Context'
import { TodoListTable, ManageTodoListItemsModal } from './'

type TodoListProps = {
    selectedDate: TDateISODate
}

const TodoList = ({ selectedDate }: TodoListProps) => {
    const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)
    const [showNothingToCopyModal, setShowNothingToCopyModal] = React.useState<boolean>(false)

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

    const hoursWorkedSelectedDate = todoListItems
        ? `(${formatDurationDisplayString(sumArray(todoListItems.map(({ duration }) => duration)))} Worked)`
        : ''


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



    if (isLoading) {
        return <Paragraph>One sec</Paragraph>
    }
    return (
        <>
            <Heading.H3>Todo List {hoursWorkedSelectedDate}</Heading.H3>
            <ButtonWrapper
                left={[
                    <Button key="today" disabled={todoListItems && todoListItems.length > 0} onClick={getPreviousDatesTasks} variation="INTERACTION">Copy Yesterday</Button>,
                    <Button key="manage" disabled={taskCount === 0} onClick={() => setShowManagementModal(true)} variation="INTERACTION">Manage Tasks</Button>,            
                    <Button key="add" onClick={() => console.log('add')} variation="INTERACTION">Add New Task</Button>               
                ]}
            />
            {taskCount > 0
                ? <TodoListTable todoListItems={todoListItems} selectedDate={selectedDate} />
                : <BigBoxOfNothing message="Go create some projects and tasks and come back!" />

            }
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
