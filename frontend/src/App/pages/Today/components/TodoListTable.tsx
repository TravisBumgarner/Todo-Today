import React from 'react'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

import { BigBoxOfNothing, Button, DropdownMenu, LabelAndInput, Table } from 'sharedComponents'
import { ETaskStatus, TProject, TTask, TTodoListItem } from 'sharedTypes'
import { taskStatusLookup } from 'utilities'

import { EditTaskModal } from 'sharedModals'

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
    const { details, projectTitle, taskTitle, status, todoListItemId, taskId } = tableRow
    const [modifiedDetails, setModifiedDetails] = React.useState<string>(details)

    React.useEffect(() => {
        database
            .todoListItems
            .where({ id: todoListItemId })
            .modify({ details: modifiedDetails })
    }, [modifiedDetails])

    return (
        <Table.TableRow>
            <Table.TableBodyCell>{projectTitle}</Table.TableBodyCell>
            <Table.TableBodyCell>{taskTitle}</Table.TableBodyCell>
            <Table.TableBodyCell>{taskStatusLookup[status]}</Table.TableBodyCell>
            <Table.TableBodyCell style={{ whiteSpace: 'pre-line' }}>
                {isReadOnly
                    ? (modifiedDetails)
                    : (
                        <LabelAndInput
                            value={modifiedDetails}
                            handleChange={(value) => setModifiedDetails(value)}
                            name="details"
                            inputType="textarea"
                            rows={5}
                        />
                    )}
            </Table.TableBodyCell>
            <Table.TableBodyCell>
                <DropdownMenu openDirection="left" title="Actions">
                    <Button
                        fullWidth
                        key="mark-task-completed"
                        variation="INTERACTION"
                        onClick={async () => {
                            await database.tasks
                                .where({ id: taskId })
                                .modify({ status: ETaskStatus.COMPLETED })
                        }}
                    >
                        Mark Completed
                    </Button>
                    <Button
                        fullWidth
                        key="remove"
                        variation="INTERACTION"
                        onClick={async () => {
                            await database.todoListItems.where({ id: todoListItemId }).delete()
                        }}
                    >
                        Remove
                    </Button>
                </DropdownMenu>
            </Table.TableBodyCell>
        </Table.TableRow>
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
                    <Table.TableHeaderCell width="15%">Status</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="40%">Day&apos;s Details</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="100px">Actions</Table.TableHeaderCell>
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
                                // setSelectedTaskId={setSelectedTaskId}
                                isReadOnly={isReadOnly}
                            />
                        ))
                }
                <Table.TableRow style={{ fontWeight: 900 }}>
                    <Table.TableBodyCell>Summary</Table.TableBodyCell>
                    <Table.TableBodyCell colSpan={3} />
                    <Table.TableBodyCell colSpan={1} />
                </Table.TableRow>
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
