import React, { useCallback, useMemo } from 'react'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import styled from 'styled-components'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { InputLabel, MenuItem, Select, TextField } from '@mui/material'

import { BigBoxOfNothing, Table } from 'sharedComponents'
import { ETaskStatus, type TDateISODate, type TTask } from 'sharedTypes'
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

interface TodoListTableRowProps {
    todoListItemId: string
    taskId: string
    projectId: string
}

const TodoListTableRow = ({ todoListItemId, projectId, taskId }: TodoListTableRowProps) => {
    const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
    const [showProjectEdit, setShowProjectEdit] = React.useState<boolean>(false)
    const [showTaskEdit, setShowTaskEdit] = React.useState<boolean>(false)

    // Ahhhhhhhhhhhhhhhhh
    // I for the life of me cannot get useLiveQuery to retrigger without this state update.
    // It's ugly, it works, I'm moving on.
    const [refresh, triggerRefresh] = React.useState<boolean>(false)

    const todoListItem = useLiveQuery(async () => await database.todoListItems.where('id').equals(todoListItemId).first(), [refresh])
    const task = useLiveQuery(async () => await database.tasks.where('id').equals(taskId).first(), [refresh])
    const project = useLiveQuery(async () => await database.projects.where('id').equals(projectId).first(), [refresh])

    const handleDetailsChange = useCallback(async (details: string) => {
        triggerRefresh(prev => !prev)
        if (!todoListItem) return

        await database.todoListItems.where('id').equals(todoListItemId).modify({ details })
    }, [todoListItemId, todoListItem])

    const handleStatusChange = useCallback(async (value: ETaskStatus) => {
        triggerRefresh(prev => !prev)
        if (!task) return null
        await database.tasks.where('id').equals(taskId).modify({ status: value })
    }, [taskId, task])

    const conditionalStyles = useMemo(() => {
        if ([ETaskStatus.CANCELED, ETaskStatus.COMPLETED].includes(task?.status ?? ETaskStatus.NEW)) {
            return { textDecoration: 'line-through' }
        } else {
            return {}
        }
    }, [task?.status])

    if (!todoListItem || !project || !task) {
        return <BigBoxOfNothing message="Could not find that todo list item" />
    }

    return (
        <>
            <Table.TableRow style={{ ...conditionalStyles }}>
                <Table.TableBodyCell
                    onMouseEnter={() => { setShowProjectEdit(true) }}
                    onMouseLeave={() => { setShowProjectEdit(false) }}
                    style={{ position: 'relative' }}
                >
                    {showProjectEdit
                        ? (
                            <HoverWrapper
                                onClick={() => { setSelectedProjectId(project.id) }}
                            >
                                <span>
                                    <EditIcon />
                                </span>
                            </HoverWrapper>
                        )
                        : project.title}
                </Table.TableBodyCell>
                <Table.TableBodyCell
                    onMouseEnter={() => { setShowTaskEdit(true) }}
                    onMouseLeave={() => { setShowTaskEdit(false) }}
                    style={{ position: 'relative' }}
                >
                    {showTaskEdit
                        ? (
                            <HoverWrapper
                                onClick={() => { setSelectedTaskId(task.id) }}
                            >
                                <span>
                                    <EditIcon
                                        name="edit"
                                    />
                                </span>
                            </HoverWrapper>
                        )
                        : task.title}
                </Table.TableBodyCell>
                <Table.TableBodyCell>
                    <InputLabel id="status">Status</InputLabel>
                    <Select
                        labelId="status"
                        value={projectId}
                        label="Project Status"
                        onChange={async (event) => { await handleStatusChange(event.target.value as ETaskStatus) }}
                    >
                        {Object.keys(ETaskStatus).map((key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}
                    </Select>
                </Table.TableBodyCell>
                <Table.TableBodyCell style={{ whiteSpace: 'pre-line' }}>
                    <TextField
                        value={todoListItem.details}
                        onChange={async event => { await handleDetailsChange(event.target.value) }}
                        name="details"
                        rows={2}
                    />
                </Table.TableBodyCell>
                <Table.TableBodyCell>
                    <CloseIcon
                        onClick={async () => {
                            await database.todoListItems.where({ id: todoListItem.id }).delete()
                        }}
                    />
                </Table.TableBodyCell>
            </Table.TableRow>
            {
                selectedTaskId
                    ? (
                        <EditTaskModal
                            showModal={selectedTaskId !== null}
                            setShowModal={() => { setSelectedTaskId(null) }}
                            taskId={selectedTaskId}
                        />
                    )
                    : (null)
            }
            {
                selectedProjectId
                    ? (
                        <EditProjectModal
                            showModal={selectedProjectId !== null}
                            setShowModal={() => { setSelectedProjectId(null) }}
                            projectId={selectedProjectId}
                        />
                    )
                    : (null)
            }
        </>
    )
}

interface TodoListTableProps {
    selectedDate: TDateISODate
}

const TodoListTable = ({ selectedDate }: TodoListTableProps) => {
    const [selectedTaskId, setSelectedTaskId] = React.useState<TTask['id'] | null>(null)

    const todoListItems = useLiveQuery(async () => {
        return await database.todoListItems.where('todoListDate').equals(selectedDate).toArray()
    }, [selectedDate])

    if (!todoListItems || todoListItems.length === 0) {
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
                    <Table.TableHeaderCell width="20%">Project</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="30%">Task</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="15%">Status</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="30%">Day&apos;s Details</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="5%"></Table.TableHeaderCell>
                </Table.TableRow>
            </Table.TableHeader>
            <Table.TableBody>
                {
                    todoListItems
                        .map((todoListItem) => (
                            <TodoListTableRow
                                key={todoListItem.id}
                                todoListItemId={todoListItem.id}
                                projectId={todoListItem.projectId}
                                taskId={todoListItem.taskId}
                            />
                        ))
                }
            </Table.TableBody>
            {
                selectedTaskId
                    ? (
                        <EditTaskModal
                            showModal={selectedTaskId !== null}
                            setShowModal={() => { setSelectedTaskId(null) }}
                            taskId={selectedTaskId}
                        />
                    )
                    : (null)
            }
        </Table.Table>

    )
}

export default TodoListTable
