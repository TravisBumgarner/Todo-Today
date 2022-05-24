import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'

import { Modal, Paragraph, Button, Table } from 'sharedComponents'
import { formatDateDisplayString } from 'utilities'
import { TDateISODate, TProject, TTodoListItem } from 'sharedTypes'
import database from 'database'
import { context } from 'Context'

type ManageTodoListItemsModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    selectedDate: TDateISODate
}

const getTaskIdsToTodoListIds = (todoListItems: TTodoListItem[]) => {
    return todoListItems.reduce((accumulator, { taskId, id }) => {
        accumulator[taskId] = id
        return accumulator
    }, {} as Record<string, string>)
}

const ManageTodoListItemsModal = ({ showModal, setShowModal, selectedDate }: ManageTodoListItemsModalProps) => {
    const tasks = useLiveQuery(async () => {
        const items = await database.tasks.toArray()
        return Promise.all(items.map(async (item) => {
            const project = (await database.projects.where({ id: item.projectId }).first()) as TProject
            return {
                projectTitle: project.title,
                ...item
            }
        }))
    })
    const todoListItems = useLiveQuery(() => database.todoListItems.where({ todoListDate: selectedDate }).toArray(), [selectedDate])
    const { state: { dateFormat } } = React.useContext(context)

    if (!tasks || !tasks.length || !todoListItems) {
        return <>This situation is not possible...</>
    }

    const taskIdsToTodoListIds = getTaskIdsToTodoListIds(todoListItems || [])

    const handleAdd = ({ projectId, taskId }: { projectId: string, taskId: string }) => {
        database.todoListItems.add({
            projectId,
            taskId,
            duration: 0,
            id: uuid4(),
            todoListDate: selectedDate,
            details: ''
        })
    }

    const handleRemove = async (todoListItemId: string) => {
        await database.todoListItems.where({ id: todoListItemId }).delete()
    }
    return (
        <Modal
            contentLabel={`Manage Tasks for ${formatDateDisplayString(dateFormat, selectedDate)}`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <>
                <Table.Table>
                    <Table.TableHeader>
                        <Table.TableRow>
                            <Table.TableHeaderCell>Project</Table.TableHeaderCell>
                            <Table.TableHeaderCell>Task</Table.TableHeaderCell>
                            <Table.TableHeaderCell width="110px">Actions</Table.TableHeaderCell>
                        </Table.TableRow>
                    </Table.TableHeader>
                    <Table.TableBody>
                        {
                            tasks.map(({ title, id: taskId, projectId, projectTitle }) => {
                                return (
                                    <Table.TableRow key={taskId}>
                                        <Table.TableBodyCell>{projectTitle}</Table.TableBodyCell>
                                        <Table.TableBodyCell>{title}</Table.TableBodyCell>
                                        <Table.TableBodyCell>
                                            {
                                                Object.keys(taskIdsToTodoListIds).includes(taskId)
                                                    ? (
                                                        <Button
                                                            style={{ width: '100px' }}
                                                            key="remove"
                                                            variation="WARNING"
                                                            onClick={() => handleRemove(taskIdsToTodoListIds[taskId])}
                                                        >
                                                            Remove
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            style={{ width: '100px' }}
                                                            key="add"
                                                            variation="INTERACTION"
                                                            onClick={() => handleAdd({ projectId, taskId })}
                                                        >
                                                            Add
                                                        </Button>
                                                    )
                                            }
                                        </Table.TableBodyCell>
                                    </Table.TableRow>
                                )
                            })
                        }
                    </Table.TableBody>

                </Table.Table>
                <Paragraph>Done Adding Tasks?</Paragraph>
                <Button key="finished" fullWidth variation="INTERACTION" onClick={() => setShowModal(false)}>Done!</Button>
            </>
        </Modal>
    )
}

export default ManageTodoListItemsModal
