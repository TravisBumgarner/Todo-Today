import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button, Typography } from '@mui/material'

import { Modal, Table, BigBoxOfNothing } from 'sharedComponents'
import { formatDateDisplayString, taskStatusLookup } from 'utilities'
import { type TDateISODate, type TProject, type TTodoListItem, ETaskStatus, EProjectStatus, type TTask } from 'sharedTypes'
import database from 'database'

interface ManageTodoListItemsModalProps {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    selectedDate: TDateISODate
}

const getTaskIdsToTodoListIds = (todoListItems: TTodoListItem[]) => {
    return todoListItems.reduce<Record<string, string>>((accumulator, { taskId, id }) => {
        accumulator[taskId] = id
        return accumulator
    }, {})
}

interface TasksByProjectTableProps {
    project: TProject
    tasks: TTask[]
    taskIdsToTodoListIds: Record<string, string>
    selectedDate: TDateISODate
}

const TasksByProjectTable = ({ project, tasks, taskIdsToTodoListIds, selectedDate }: TasksByProjectTableProps) => {
    const handleSelect = async ({ projectId, taskId }: { projectId: string, taskId: string }) => {
        await database.todoListItems.add({
            projectId,
            taskId,
            id: uuid4(),
            todoListDate: selectedDate,
            details: ''
        })
    }

    const handleDeselect = async (todoListItemId: string) => {
        await database.todoListItems.where({ id: todoListItemId }).delete()
    }

    return (
        <>
            <Typography variant="h4">{project.title}</Typography>
            {
                tasks.length === 0
                    ? (<BigBoxOfNothing message="No tasks for this project!" />)
                    : (
                        <Table.Table>
                            <Table.TableHeader>
                                <Table.TableRow>
                                    <Table.TableHeaderCell>Task</Table.TableHeaderCell>
                                    <Table.TableHeaderCell>Status</Table.TableHeaderCell>
                                    <Table.TableHeaderCell width="110px"></Table.TableHeaderCell>
                                </Table.TableRow>
                            </Table.TableHeader>
                            <Table.TableBody>
                                {
                                    tasks
                                        .sort((a, b) => {
                                            if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
                                            if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
                                            return 0
                                        })
                                        .map(({ title, id: taskId, status }) => {
                                            return (
                                                <Table.TableRow key={taskId}>
                                                    <Table.TableBodyCell>{title}</Table.TableBodyCell>
                                                    <Table.TableBodyCell>{taskStatusLookup[status]}</Table.TableBodyCell>
                                                    <Table.TableBodyCell>
                                                        {
                                                            Object.keys(taskIdsToTodoListIds).includes(taskId)
                                                                ? (
                                                                    <Button
                                                                        style={{ width: '100px' }}
                                                                        key="deselect"

                                                                        onClick={async () => { await handleDeselect(taskIdsToTodoListIds[taskId]) }}
                                                                    >
                                                                        Deselect
                                                                    </Button>
                                                                )
                                                                : (
                                                                    <Button
                                                                        style={{ width: '100px' }}
                                                                        key="select"

                                                                        onClick={async () => { await handleSelect({ projectId: project.id, taskId }) }}
                                                                    >
                                                                        Select
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
                    )
            }
        </>
    )
}

const ManageTodoListItemsModal = ({ showModal, setShowModal, selectedDate }: ManageTodoListItemsModalProps) => {
    const tasksByProject = useLiveQuery(async () => {
        const projects = await database
            .projects
            .where('status')
            .anyOf(EProjectStatus.ACTIVE)
            .toArray()

        return await Promise.all(projects.map(async (project) => {
            const tasks = await database.tasks
                .where({ projectId: project.id })
                .and((item) => [
                    ETaskStatus.NEW,
                    ETaskStatus.IN_PROGRESS,
                    ETaskStatus.BLOCKED
                ].includes(item.status))
                .toArray()

            return {
                project,
                tasks
            }
        }))
    }, [])

    const tasksWithProject = useLiveQuery(async () => {
        const tasks = await database.tasks.where('status').anyOf(ETaskStatus.NEW, ETaskStatus.IN_PROGRESS).toArray()
        return await Promise.all(tasks.map(async (task) => {
            const project = (await database.projects.where({ id: task.projectId }).first()) as TProject
            return {
                projectTitle: project.title,
                ...task
            }
        }))
    })
    const todoListItems = useLiveQuery(async () => await database.todoListItems.where({ todoListDate: selectedDate }).toArray(), [selectedDate])

    const taskIdsToTodoListIds = getTaskIdsToTodoListIds(todoListItems || [])

    let Content

    if (!tasksWithProject?.length || !todoListItems || !tasksByProject || !tasksByProject.length) {
        Content = <BigBoxOfNothing message="Looks like you've got nothing to do!" />
    } else {
        Content = (
            <>
                {
                    tasksByProject
                        .filter(({ tasks }) => tasks.length > 0)
                        .map(({ project, tasks }) => (
                            <TasksByProjectTable
                                key={project.id}
                                selectedDate={selectedDate}
                                project={project}
                                tasks={tasks}
                                taskIdsToTodoListIds={taskIdsToTodoListIds}
                            />
                        ))
                }
                <Button fullWidth variant='contained' key="finished" onClick={() => { setShowModal(false) }}>Done!</Button>
            </>
        )
    }

    return (
        <Modal
            contentLabel={`Select Tasks for ${formatDateDisplayString(selectedDate)}`}
            showModal={showModal}
            closeModal={() => { setShowModal(false) }}
        >
            {Content}
        </Modal>
    )
}

export default ManageTodoListItemsModal
