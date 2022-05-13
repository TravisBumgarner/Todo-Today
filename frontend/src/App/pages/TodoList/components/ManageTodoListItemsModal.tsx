import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'

import { Modal, Paragraph, BigBoxOfNothing, Button, Heading, ButtonWrapper } from 'sharedComponents'
import { formatDateDisplayString } from 'utilities'
import { TDateISODate, TTask, TTodoListItem } from 'sharedTypes'
import database from 'database'
import { context } from 'Context'

type ManageTodoListItemsModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    selectedDate: TDateISODate
}

const getTasksByProjectId = <T extends TTask>(key: keyof TTask, arrayItems: T[]) => {
    return arrayItems.reduce(
        (accumulator, current) => {
            if (!(current[key] in accumulator)) {
                accumulator[current[key]] = []
            }
            accumulator[current[key]].push(current)
            return accumulator
        },
        {} as Record<string, T[]>
    )
}

const getTaskIdsToTodoListIds = (todoListItems: TTodoListItem[]) => {
    return todoListItems.reduce((accumulator, { taskId, id }) => {
        accumulator[taskId] = id
        return accumulator
    }, {} as Record<string, string>)
}

const ManageTodoListItemsModal = ({ showModal, setShowModal, selectedDate }: ManageTodoListItemsModalProps) => {
    const tasks = useLiveQuery(() => database.tasks.toArray())
    const projects = useLiveQuery(() => database.projects.toArray())
    const todoListItems = useLiveQuery(() => database.todoListItems.where({ todoListDate: selectedDate }).toArray(), [selectedDate])
    const { state: { dateFormat } } = React.useContext(context)

    if (!tasks || !tasks.length || !projects || !projects.length) {
        return <BigBoxOfNothing message="Go create some tasks and/or projects and come back!" />
    }
    const tasksByProjectId = getTasksByProjectId('projectId', tasks)
    const taskIdsToTodoListIds = getTaskIdsToTodoListIds(todoListItems || [])

    const handleAdd = ({ projectId, taskId }: { projectId: string, taskId: string }) => {
        database.todoListItems.add({
            projectId,
            taskId,
            duration: 0,
            id: uuid4(),
            todoListDate: selectedDate
        })
    }

    const handleRemove = async (todoListItemId: string) => {
        await database.todoListItems.where({ id: todoListItemId }).delete()
    }

    return (
        <Modal
            contentLabel={`Add ${formatDateDisplayString(dateFormat, selectedDate)}'s Tasks`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <>
                <Paragraph>Select tasks to add to the todo list.</Paragraph>
                {
                    projects.map(({ title, id: projectId }) => {
                        const tasksByProject = tasksByProjectId[projectId].length ? tasksByProjectId[projectId] : []
                        if (!tasksByProject.length) return null
                        return (
                            <div key={projectId}>
                                <Heading.H2>{title}</Heading.H2>
                                <ButtonWrapper
                                    vertical={tasksByProject.map(({ title: taskTitle, id: taskId }) => {
                                        return (
                                            Object.keys(taskIdsToTodoListIds).includes(taskId)
                                                ? (
                                                    <Button
                                                        key={`${taskId}-remove`}
                                                        fullWidth
                                                        variation="WARNING"
                                                        onClick={() => handleRemove(taskIdsToTodoListIds[taskId])}
                                                    >
                                                        Remove {taskTitle}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        key={`${taskId}-add`}
                                                        fullWidth
                                                        variation="INTERACTION"
                                                        onClick={() => handleAdd({ projectId, taskId })}
                                                    >
                                                        Add {taskTitle}
                                                    </Button>
                                                )
                                        )
                                    })}
                                />
                            </div>
                        )
                    })
                }
                <Heading.H2>Done Adding Tasks?</Heading.H2>
                <Button key="finished" fullWidth variation="INTERACTION" onClick={() => setShowModal(false)}>Done!</Button>
            </>
        </Modal>
    )
}

export default ManageTodoListItemsModal
