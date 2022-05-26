import React from 'react'
import moment from 'moment'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'

import { BigBoxOfNothing, Button, ButtonWrapper, ConfirmationModal, Heading } from 'sharedComponents'
import { formatDateKeyLookup } from 'utilities'
import database from 'database'
import { TDateISODate } from 'sharedTypes'
import { AddTaskModal, AddProjectModal } from 'sharedModals'
import { TodoListTable, ManageTodoListItemsModal } from '.'

type TodoListProps = {
    selectedDate: TDateISODate
}

const TodoList = ({ selectedDate }: TodoListProps) => {
    const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)
    const [showNothingToCopyModal, setShowNothingToCopyModal] = React.useState<boolean>(false)
    const [showAddNewTaskModal, setShowAddNewTaskModal] = React.useState<boolean>(false)
    const [showAddNewProjectModal, setShowAddNewProjectModal] = React.useState<boolean>(false)
    // Dropdown of duration change doesn't trigger rerender
    const [lastEditedDuration, setLastEditedDuration] = React.useState<string | null>(null)

    const projects = useLiveQuery(() => database.projects.toArray())
    const tasks = useLiveQuery(() => database.tasks.toArray())


    const todoListItems = useLiveQuery(
        () => database
            .todoListItems
            .where('todoListDate')
            .equals(selectedDate)
            .toArray(),
        [selectedDate, lastEditedDuration]
    )

    const getPreviousDatesTasks = async () => {
        const previousDay = await database
            .todoListItems
            .where({
                todoListDate: formatDateKeyLookup(moment(selectedDate).subtract(1, 'days'))
            })
            .toArray()

        if (previousDay.length === 0) {
            setShowNothingToCopyModal(true)
        } else {
            (
                previousDay.map(async ({ projectId, taskId, details }) => {
                    await database.todoListItems.add({
                        projectId,
                        taskId,
                        duration: 0,
                        id: uuid4(),
                        todoListDate: selectedDate,
                        details
                    })
                })
            )
        }
    }

    return (
        <>
            <Heading.H3>Todo List</Heading.H3>
            <ButtonWrapper
                left={[
                    <Button
                        key="today"
                        disabled={todoListItems && todoListItems.length > 0}
                        onClick={getPreviousDatesTasks}
                        variation="INTERACTION"
                    >
                        Copy Yesterday
                    </Button>,
                    <Button
                        key="manage"
                        disabled={tasks && tasks.length === 0}
                        title={tasks && tasks.length === 0 ? 'You need to create a task first!' : 'Manage'}
                        onClick={() => setShowManagementModal(true)}
                        variation="INTERACTION"
                    >
                        Select Tasks
                    </Button>
                ]}
                right={[
                    < Button
                        key="add-project"
                        onClick={() => setShowAddNewProjectModal(true)}
                        variation="INTERACTION"
                        title="Add new Project"
                    >
                        Add New Project
                    </Button>,
                    <Button
                        key="add-task"
                        disabled={projects && projects.length === 0}
                        onClick={() => setShowAddNewTaskModal(true)}
                        variation="INTERACTION"
                        title={projects && projects.length === 0 ? 'You need to create a project first!' : 'Add New Task'}
                    >
                        Add New Task
                    </Button>
                ]}
            />
            {tasks && tasks.length !== 0
                ? <TodoListTable todoListItems={todoListItems} setLastEditedDuration={setLastEditedDuration} />
                : <BigBoxOfNothing message="Go create some projects and tasks and come back!" />}
            <ManageTodoListItemsModal selectedDate={selectedDate} showModal={showManagementModal} setShowModal={setShowManagementModal} />
            <ConfirmationModal
                body="It looks like there's nothing to copy from yesterday."
                title="Heads Up!"
                confirmationCallback={() => setShowNothingToCopyModal(false)}
                showModal={showNothingToCopyModal}
                setShowModal={setShowNothingToCopyModal}
            />
            {showAddNewTaskModal
                ? <AddTaskModal addToTodayDefaultValue="yes" showModal={showAddNewTaskModal} setShowModal={setShowAddNewTaskModal} />
                : null
            }
            {showAddNewProjectModal
                ? <AddProjectModal showModal={showAddNewProjectModal} setShowModal={setShowAddNewProjectModal} />
                : null
            }
        </>
    )
}

export default TodoList
