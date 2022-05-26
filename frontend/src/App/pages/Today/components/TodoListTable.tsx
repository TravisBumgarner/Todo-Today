import React from 'react'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

import { BigBoxOfNothing, Button, DropdownMenu, LabelAndInput, Table } from 'sharedComponents'
import { ETaskStatus, TProject, TTask, TTodoListItem } from 'sharedTypes'
import { taskStatusLookup, formatDurationDisplayString, sumArray } from 'utilities'

import { EditTaskModal } from 'sharedModals'
import EditTodoListItemModal from './AddEditTodoListItemDetailsModal'

type TableRow = {
    id: string
    projectTitle: string
    taskTitle: string
    status: ETaskStatus
    duration: number
    taskId: string
    todoListItemId: string
    projectId: string
    details: string
}

type TodoListTableProps = {
    todoListItems: TTodoListItem[] | undefined
    setLastEditedDuration: React.Dispatch<React.SetStateAction<string | null>>
}

// It is what it is. lol
const AVAILABLE_DURATIONS = [
    { value: 0, label: '0H00' },
    { value: 15, label: '0H15' },
    { value: 30, label: '0H30' },
    { value: 45, label: '0H45' },
    { value: 60, label: '1H00' },
    { value: 75, label: '1H15' },
    { value: 90, label: '1H30' },
    { value: 105, label: '1H45' },
    { value: 120, label: '2H00' },
    { value: 135, label: '2H15' },
    { value: 150, label: '2H30' },
    { value: 165, label: '2H45' },
    { value: 180, label: '3H00' },
    { value: 195, label: '3H15' },
    { value: 210, label: '3H30' },
    { value: 225, label: '3H45' },
    { value: 240, label: '4H00' },
    { value: 255, label: '4H15' },
    { value: 270, label: '4H30' },
    { value: 285, label: '4H45' },
    { value: 300, label: '5H00' },
    { value: 315, label: '5H15' },
    { value: 330, label: '5H30' },
    { value: 345, label: '5H45' },
    { value: 360, label: '6H00' },
    { value: 375, label: '6H15' },
    { value: 390, label: '6H30' },
    { value: 405, label: '6H45' },
    { value: 420, label: '7H00' },
    { value: 435, label: '7H15' },
    { value: 450, label: '7H30' },
    { value: 465, label: '7H45' },
    { value: 480, label: '8H00' },
    { value: 495, label: '8H15' },
    { value: 510, label: '8H30' },
    { value: 525, label: '8H45' },
    { value: 540, label: '9H00' },
    { value: 555, label: '9H15' },
    { value: 570, label: '9H30' },
    { value: 585, label: '9H45' },
    { value: 600, label: '10H00' },
    { value: 615, label: '10H15' },
    { value: 630, label: '10H30' },
    { value: 645, label: '10H45' },
    { value: 660, label: '11H00' },
    { value: 675, label: '11H15' },
    { value: 690, label: '11H30' },
    { value: 705, label: '11H45' },
    { value: 720, label: '12H00' },
    { value: 735, label: '12H15' },
    { value: 750, label: '12H30' },
    { value: 765, label: '12H45' },
    { value: 780, label: '13H00' },
    { value: 795, label: '13H15' },
    { value: 810, label: '13H30' },
    { value: 825, label: '13H45' },
    { value: 840, label: '14H00' },
    { value: 855, label: '14H15' },
    { value: 870, label: '14H30' },
    { value: 885, label: '14H45' },
    { value: 900, label: '15H00' },
    { value: 915, label: '15H15' },
    { value: 930, label: '15H30' },
    { value: 945, label: '15H45' },
    { value: 960, label: '16H00' },
    { value: 975, label: '16H15' },
    { value: 990, label: '16H30' },
    { value: 1005, label: '16H45' },
    { value: 1020, label: '17H00' },
    { value: 1035, label: '17H15' },
    { value: 1050, label: '17H30' },
    { value: 1065, label: '17H45' },
    { value: 1080, label: '18H00' },
    { value: 1095, label: '18H15' },
    { value: 1110, label: '18H30' },
    { value: 1125, label: '18H45' },
    { value: 1140, label: '19H00' },
    { value: 1155, label: '19H15' },
    { value: 1170, label: '19H30' },
    { value: 1185, label: '19H45' },
    { value: 1200, label: '20H00' },
    { value: 1215, label: '20H15' },
    { value: 1230, label: '20H30' },
    { value: 1245, label: '20H45' },
    { value: 1260, label: '21H00' },
    { value: 1275, label: '21H15' },
    { value: 1290, label: '21H30' },
    { value: 1305, label: '21H45' },
    { value: 1320, label: '22H00' },
    { value: 1335, label: '22H15' },
    { value: 1350, label: '22H30' },
    { value: 1365, label: '22H45' },
    { value: 1380, label: '23H00' },
    { value: 1395, label: '23H15' },
    { value: 1410, label: '23H30' },
    { value: 1425, label: '23H45' },
    { value: 1440, label: '24H00' }
]

type TodoListTableRowProps = {
    tableRow: TableRow,
    setLastEditedDuration: React.Dispatch<React.SetStateAction<string | null>>
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string | null>>
}

const TodoListTableRow = ({ tableRow, setLastEditedDuration, setSelectedTaskId }: TodoListTableRowProps) => {
    const [showEditDetailsModal, setShowEditDetailsModal] = React.useState<boolean>(false)

    const { id, details, duration, projectTitle, taskTitle, status, todoListItemId, taskId } = tableRow

    return (
        <Table.TableRow>
            <Table.TableBodyCell>{projectTitle}</Table.TableBodyCell>
            <Table.TableBodyCell>{taskTitle}</Table.TableBodyCell>
            <Table.TableBodyCell style={{ whiteSpace: 'pre-line' }}>{details}</Table.TableBodyCell>
            <Table.TableBodyCell>{taskStatusLookup[status]}</Table.TableBodyCell>
            <Table.TableBodyCell>
                <LabelAndInput
                    name="duration"
                    value={`${duration}`}
                    options={AVAILABLE_DURATIONS}
                    inputType="select-array"
                    handleChange={async (value) => {
                        await database.todoListItems
                            .where({ id: todoListItemId })
                            .modify({ duration: parseInt(value, 10) })
                        setLastEditedDuration(todoListItemId) // This feels bad. lol
                        setLastEditedDuration(null)
                    }}
                />
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
                        key="edit-task"
                        variation="INTERACTION"
                        onClick={async () => setSelectedTaskId(taskId)}
                    >
                        Edit Task
                    </Button>
                    <Button
                        fullWidth
                        key="edit-details"
                        variation="INTERACTION"
                        onClick={async () => setShowEditDetailsModal(true)}
                    >
                        Add or Edit Details
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
            <EditTodoListItemModal todoListItem={{ details, id }} showModal={showEditDetailsModal} setShowModal={setShowEditDetailsModal} />
        </Table.TableRow>
    )
}

const TodoListTable = ({ setLastEditedDuration, todoListItems }: TodoListTableProps) => {
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
                duration: todoListItem.duration,
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

    const hoursWorkedSelectedDate = todoListItems
        ? `${formatDurationDisplayString(sumArray(todoListItems.map(({ duration }) => duration)))} Worked`
        : ''

    return (
        <Table.Table>
            <Table.TableHeader>
                <Table.TableRow>
                    <Table.TableHeaderCell width="15%">Project</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="15%">Task</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="30%">Details</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="60px">Status</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="110px">Duration</Table.TableHeaderCell>
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
                                setLastEditedDuration={setLastEditedDuration}
                                key={tableRow.todoListItemId}
                                tableRow={tableRow}
                                setSelectedTaskId={setSelectedTaskId}
                            />
                        ))
                }
                <Table.TableRow style={{ fontWeight: 900 }}>
                    <Table.TableBodyCell>Summary</Table.TableBodyCell>
                    <Table.TableBodyCell colSpan={3} />
                    <Table.TableBodyCell>{hoursWorkedSelectedDate}</Table.TableBodyCell>
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
