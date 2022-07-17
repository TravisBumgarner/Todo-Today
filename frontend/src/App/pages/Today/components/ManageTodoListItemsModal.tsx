import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'

import { Modal, Button, Table, BigBoxOfNothing, ButtonWrapper, Heading } from 'sharedComponents'
import { formatDateDisplayString, taskStatusLookup } from 'utilities'
import { TDateISODate, TProject, TTodoListItem, ETaskStatus, EProjectStatus, TTask } from 'sharedTypes'
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

type TasksByProjectTableProps = {
    project: TProject
    tasks: TTask[]
    taskIdsToTodoListIds: Record<string, string>
    selectedDate: TDateISODate
}

const TasksByProjectTable = ({ project, tasks, taskIdsToTodoListIds, selectedDate }: TasksByProjectTableProps) => {
    const handleSelect = ({ projectId, taskId }: { projectId: string, taskId: string }) => {
        database.todoListItems.add({
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
            <Heading.H4>{project.title}</Heading.H4>
            {
                tasks.length === 0
                    ? (<BigBoxOfNothing message="No tasks for this project!" />)
                    : (
                        <Table.Table>
                            <Table.TableHeader>
                                <Table.TableRow>
                                    <Table.TableHeaderCell>Task</Table.TableHeaderCell>
                                    <Table.TableHeaderCell>Status</Table.TableHeaderCell>
                                    <Table.TableHeaderCell width="110px">Actions</Table.TableHeaderCell>
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
                                                                        variation="WARNING"
                                                                        onClick={() => handleDeselect(taskIdsToTodoListIds[taskId])}
                                                                    >
                                                                        Deselect
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        style={{ width: '100px' }}
                                                                        key="select"
                                                                        variation="INTERACTION"
                                                                        onClick={() => handleSelect({ projectId: project.id, taskId })}
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
            .anyOf(EProjectStatus.ACTIVE, EProjectStatus.BLOCKED, EProjectStatus.REOCURRING)
            .toArray()

        return Promise.all(projects.map(async (project) => {
            const tasks = await database.tasks.where({ projectId: project.id }).toArray()

            return {
                project,
                tasks
            }
        }))
    })

    const tasksWithProject = useLiveQuery(async () => {
        const tasks = await database.tasks.where('status').anyOf(ETaskStatus.NEW, ETaskStatus.IN_PROGRESS).toArray()
        return Promise.all(tasks.map(async (task) => {
            const project = (await database.projects.where({ id: task.projectId }).first()) as TProject
            return {
                projectTitle: project.title,
                ...task
            }
        }))
    })
    const todoListItems = useLiveQuery(() => database.todoListItems.where({ todoListDate: selectedDate }).toArray(), [selectedDate])
    const { state: { dateFormat } } = React.useContext(context)

    const taskIdsToTodoListIds = getTaskIdsToTodoListIds(todoListItems || [])

    let Content

    if (!tasksWithProject || !tasksWithProject.length || !todoListItems || !tasksByProject || !tasksByProject.length) {
        Content = <BigBoxOfNothing message="Looks like you've got nothing to do!" />
    } else {
        Content = (
            <>
                {
                    tasksByProject.map(({ project, tasks }) => (
                        <TasksByProjectTable
                            key={project.id}
                            selectedDate={selectedDate}
                            project={project}
                            tasks={tasks}
                            taskIdsToTodoListIds={taskIdsToTodoListIds}
                        />
                    ))
                }
                <ButtonWrapper
                    right={[
                        <Button key="finished" variation="INTERACTION" onClick={() => setShowModal(false)}>Done!</Button>
                    ]}
                />
            </>
        )
    }

    return (
        <Modal
            contentLabel={`Select Tasks for ${formatDateDisplayString(dateFormat, selectedDate)}`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            {Content}
        </Modal>
    )
}

export default ManageTodoListItemsModal
