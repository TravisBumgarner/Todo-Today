import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'

import { Modal, Paragraph, Button, Heading, ButtonWrapper } from 'sharedComponents'
import { formatDateDisplayString } from 'utilities'
import { TDateISODate, TTask, TTodoListItem } from 'sharedTypes'
import database from 'database'
import { context } from 'Context'
import styled from 'styled-components'

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

const RowWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;

    ${Paragraph} {
        margin: 0 1rem 0 0;
    }

    ${Button} {
        width: 200px;
        min-width: 200px;
        max-width: 200px;
    }
`

const ManageTodoListItemsModal = ({ showModal, setShowModal, selectedDate }: ManageTodoListItemsModalProps) => {
    const tasks = useLiveQuery(() => database.tasks.toArray())
    const projects = useLiveQuery(() => database.projects.toArray())
    const todoListItems = useLiveQuery(() => database.todoListItems.where({ todoListDate: selectedDate }).toArray(), [selectedDate])
    const { state: { dateFormat } } = React.useContext(context)

    if (!tasks || !tasks.length || !projects || !projects.length) {
        return <>This situation is not possible...</>
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
                        const tasksByProject = tasksByProjectId[projectId] && tasksByProjectId[projectId].length ? tasksByProjectId[projectId] : []
                        if (!tasksByProject.length) return null
                        return (
                            <div key={projectId}>
                                <Heading.H2>{title}</Heading.H2>
                                {tasksByProject.map(({ title: taskTitle, id: taskId }) => {
                                    return (
                                        <RowWrapper>
                                            <Paragraph>{taskTitle}</Paragraph>
                                            {Object.keys(taskIdsToTodoListIds).includes(taskId)
                                                ? (
                                                    <Button
                                                        key={`${taskId}-remove`}
                                                        variation="WARNING"
                                                        onClick={() => handleRemove(taskIdsToTodoListIds[taskId])}
                                                    >
                                                        Remove
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        key={`${taskId}-add`}
                                                        variation="INTERACTION"
                                                        onClick={() => handleAdd({ projectId, taskId })}
                                                    >
                                                        Add
                                                    </Button>
                                                )
                                            }
                                        </RowWrapper>

                                    )
                                })}
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
