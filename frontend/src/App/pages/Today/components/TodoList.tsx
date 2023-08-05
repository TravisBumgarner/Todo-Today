import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid4 } from 'uuid'
import { Button, Typography } from '@mui/material'

import { BigBoxOfNothing, ConfirmationModal } from 'sharedComponents'
import database from 'database'
import { ETaskStatus, type TDateISODate } from 'sharedTypes'
import { AddTaskModal, AddProjectModal } from 'sharedModals'
import { TodoListTable, ManageTodoListItemsModal } from '.'

interface TodoListProps {
    selectedDate: TDateISODate
}

const TodoList = ({ selectedDate }: TodoListProps) => {
    const [showManagementModal, setShowManagementModal] = React.useState<boolean>(false)
    const [showNothingToCopyModal, setShowNothingToCopyModal] = React.useState<boolean>(false)
    const [showAddNewTaskModal, setShowAddNewTaskModal] = React.useState<boolean>(false)
    const [showAddNewProjectModal, setShowAddNewProjectModal] = React.useState<boolean>(false)

    const projects = useLiveQuery(async () => await database.projects.toArray())
    const tasks = useLiveQuery(async () => await database.tasks.toArray())

    const todoListItems = useLiveQuery(
        async () => await database.todoListItems.where('todoListDate').equals(selectedDate).toArray()
        , [selectedDate])

    const getPreviousDatesTasks = async () => {
        const lastDate = (
            await database.todoListItems.where('todoListDate').below(selectedDate).sortBy('todoListDate')
        ).reverse()[0]

        if (lastDate) {
            const previousDay = await database.todoListItems
                .where({
                    todoListDate: lastDate.todoListDate
                })
                .toArray()

            if (previousDay.length === 0) {
                setShowNothingToCopyModal(true)
            } else {
                previousDay.map(async ({ projectId, taskId, details }) => {
                    const task = await database.tasks.where('id').equals(taskId).first()

                    if (
                        task?.status === ETaskStatus.NEW ||
                        task?.status === ETaskStatus.IN_PROGRESS ||
                        task?.status === ETaskStatus.BLOCKED
                    ) {
                        await database.todoListItems.add({
                            projectId,
                            taskId,
                            id: uuid4(),
                            todoListDate: selectedDate,
                            details
                        })
                    }
                })
            }
        } else {
            setShowNothingToCopyModal(true)
        }
    }

    return (
        <>
            <Typography variant="h3">Todo List</Typography>
            <Button
                key="today"
                disabled={todoListItems && todoListItems.length > 0}
                onClick={getPreviousDatesTasks}

            >
                Copy Previous
            </Button>
            <Button
                key="manage"
                disabled={tasks && tasks.length === 0}
                title={tasks && tasks.length === 0 ? 'You need to create a task first!' : 'Manage'}
                onClick={() => { setShowManagementModal(true) }}

            >
                Select Tasks
            </Button>
            <Button
                key="add-project"
                onClick={() => { setShowAddNewProjectModal(true) }}

                title="Add new Project"
            >
                Add New Project
            </Button>
            <Button
                key="add-task"
                disabled={projects && projects.length === 0}
                onClick={() => { setShowAddNewTaskModal(true) }}

                title={projects && projects.length === 0 ? 'You need to create a project first!' : 'Add New Task'}
            >
                Add New Task
            </Button>
            {tasks && tasks.length !== 0
                ? (
                    <TodoListTable selectedDate={selectedDate} />
                )
                : (
                    <BigBoxOfNothing message="Go create some projects and tasks and come back!" />
                )}
            <ManageTodoListItemsModal
                selectedDate={selectedDate}
                showModal={showManagementModal}
                setShowModal={setShowManagementModal}
            />
            <ConfirmationModal
                body="It looks like there's nothing to copy from yesterday."
                title="Heads Up!"
                confirmationCallback={() => { setShowNothingToCopyModal(false) }}
                showModal={showNothingToCopyModal}
                setShowModal={setShowNothingToCopyModal}
            />
            {showAddNewTaskModal
                ? (
                    <AddTaskModal
                        selectedDate={selectedDate}
                        showModal={showAddNewTaskModal}
                        setShowModal={setShowAddNewTaskModal}
                    />
                )
                : null}
            {showAddNewProjectModal
                ? (
                    <AddProjectModal showModal={showAddNewProjectModal} setShowModal={setShowAddNewProjectModal} />
                )
                : null}
        </>
    )
}

export default TodoList
