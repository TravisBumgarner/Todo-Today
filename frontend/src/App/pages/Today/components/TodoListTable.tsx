import React from 'react'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import styled from 'styled-components'

import { BigBoxOfNothing, Icon, LabelAndInput, Table } from 'sharedComponents'
import { ETaskStatus, TProject, TTask, TTodoListItem } from 'sharedTypes'
import { taskStatusLookup } from 'utilities'

import { EditProjectModal, EditTaskModal } from 'sharedModals'

const HoverWrapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const ICON_SIZE = '1rem'

type TableRow = {
    id: string
    projectTitle: string
    taskTitle: string
    status: ETaskStatus
    taskId: string
    todoListItemId: string
    projectId: string
    details: string
}

type TodoListTableRowProps = {
    tableRow: TableRow
    isReadOnly: boolean
}

const TodoListTableRow = ({ tableRow, isReadOnly }: TodoListTableRowProps) => {
    const { details, projectTitle, projectId, taskTitle, status, todoListItemId, taskId } = tableRow
    const [modifiedDetails, setModifiedDetails] = React.useState<string>(details)
    const [modifiedStatus, setModifiedStatus] = React.useState<string>(status)
    const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
    const [showProjectEdit, setShowProjectEdit] = React.useState<boolean>(false)
    const [showTaskEdit, setShowTaskEdit] = React.useState<boolean>(false)

    React.useEffect(() => {
        database
            .todoListItems
            .where({ id: todoListItemId })
            .modify({ details: modifiedDetails })
    }, [modifiedDetails])

    React.useEffect(() => {
        database
            .tasks
            .where({ id: taskId })
            .modify({ status: modifiedStatus })
    }, [modifiedStatus])

    return (
        <>
            <Table.TableRow>
                <Table.TableBodyCell
                    onMouseEnter={() => setShowProjectEdit(true)}
                    onMouseLeave={() => setShowProjectEdit(false)}
                    style={{ position: 'relative' }}
                >
                    {showProjectEdit ? (
                        <HoverWrapper
                            onClick={() => setSelectedProjectId(projectId)}
                        >
                            <span>
                                <Icon
                                    name="edit"
                                    size={ICON_SIZE}
                                />
                            </span>
                        </HoverWrapper>
                    ) : projectTitle}
                </Table.TableBodyCell>
                <Table.TableBodyCell
                    onMouseEnter={() => setShowTaskEdit(true)}
                    onMouseLeave={() => setShowTaskEdit(false)}
                    style={{ position: 'relative' }}
                >
                    {showTaskEdit ? (
                        <HoverWrapper
                            onClick={() => setSelectedTaskId(taskId)}
                        >
                            <span>
                                <Icon
                                    name="edit"
                                />
                            </span>
                        </HoverWrapper>
                    ) : taskTitle}
                </Table.TableBodyCell>
                <Table.TableBodyCell>
                    <LabelAndInput
                        name="status"
                        value={modifiedStatus}
                        options={ETaskStatus}
                        optionLabels={taskStatusLookup}
                        inputType="select-enum"
                        handleChange={(value: ETaskStatus) => setModifiedStatus(value)}
                    />
                </Table.TableBodyCell>
                <Table.TableBodyCell style={{ whiteSpace: 'pre-line' }}>
                    {isReadOnly
                        ? (modifiedDetails)
                        : (
                            <LabelAndInput
                                value={modifiedDetails}
                                handleChange={(value) => setModifiedDetails(value)}
                                name="details"
                                inputType="textarea"
                                rows={2}
                            />
                        )}
                </Table.TableBodyCell>
                <Table.TableBodyCell>
                    <Icon
                        key="mark-task-removed"
                        name="close"
                        onClick={async () => {
                            await database.todoListItems.where({ id: todoListItemId }).delete()
                        }}
                    />
                </Table.TableBodyCell>
            </Table.TableRow>
            {selectedTaskId
                ? (
                    <EditTaskModal
                        showModal={selectedTaskId !== null}
                        setShowModal={() => setSelectedTaskId(null)}
                        taskId={selectedTaskId}
                    />
                )
                : (null)
            }
            {selectedProjectId
                ? (
                    <EditProjectModal
                        showModal={selectedProjectId !== null}
                        setShowModal={() => setSelectedProjectId(null)}
                        projectId={selectedProjectId}
                    />
                )
                : (null)
            }
        </>
    )
}

type TodoListTableProps = {
    todoListItems: TTodoListItem[] | undefined
    isReadOnly: boolean
}

const TodoListTable = ({ todoListItems, isReadOnly }: TodoListTableProps) => {
    const [selectedTaskId, setSelectedTaskId] = React.useState<TTask['id'] | null>(null)

    const tableRows = useLiveQuery(async () => {
        return Promise.all([...todoListItems || []].map(async (todoListItem) => {
            const task = (await database.tasks.where({ id: todoListItem.taskId }).first()) as TTask
            const project = (await database.projects.where({ id: todoListItem.projectId }).first()) as TProject
            return {
                id: todoListItem.id,
                projectTitle: project.title,
                taskTitle: task.title,
                status: task.status,
                taskId: task.id,
                todoListItemId: todoListItem.id,
                projectId: todoListItem.projectId,
                details: todoListItem.details
            }
        }))
    }, [todoListItems])

    if (!tableRows || tableRows.length === 0) {
        return (
            <BigBoxOfNothing
                message="Click Add Tasks to get started!"
            />
        )
    }

    return (
        <Table.Table>
            <Table.TableHeader>
                <Table.TableRow>
                    <Table.TableHeaderCell width="15%">Project</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="15%">Task</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="20%">Status</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="40%">Day&apos;s Details</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="25px"></Table.TableHeaderCell>
                </Table.TableRow>
            </Table.TableHeader>
            <Table.TableBody>
                {
                    tableRows
                        .sort((a, b) => {
                            if (a.projectTitle.toLowerCase() < b.projectTitle.toLowerCase()) return -1
                            if (a.projectTitle.toLowerCase() > b.projectTitle.toLowerCase()) return 1
                            if (a.taskTitle.toLowerCase() < b.taskTitle.toLowerCase()) return -1
                            if (a.taskTitle.toLowerCase() > b.taskTitle.toLowerCase()) return 1
                            return 0
                        })
                        .map((tableRow) => (
                            <TodoListTableRow
                                key={tableRow.todoListItemId}
                                tableRow={tableRow}
                                isReadOnly={isReadOnly}
                            />
                        ))
                }
            </Table.TableBody>
            {
                selectedTaskId ? (
                    <EditTaskModal
                        showModal={selectedTaskId !== null}
                        setShowModal={() => setSelectedTaskId(null)}
                        taskId={selectedTaskId}
                    />
                ) : (null)
            }
        </Table.Table>

    )
}

export default TodoListTable
