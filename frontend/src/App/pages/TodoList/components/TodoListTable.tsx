import React from 'react'

import { Button, DropdownMenu, Heading, LabelAndInput, Table } from 'sharedComponents'
import { TProject, TTask, TTodoListItem } from 'sharedTypes'
// import EditProjectModal from './EditProjectModal'
import { formatDateDisplayString, formatDateKeyLookup, projectStatusLookup, formatDurationDisplayString } from 'utilities'
import { context } from "Context"
import moment from 'moment'

type TodoListTableProps = {
    projectId: string,
    todoListItems: TTodoListItem[]
    selectedDate: moment.Moment
}

// It is what it is. lol
const AVAILABLE_DURATIONS = [
    { label: '00:00', value: '0' },
    { label: '00:15', value: '15' },
    { label: '00:30', value: '30' },
    { label: '00:45', value: '45' },
    { label: '01:00', value: '60' },
    { label: '01:15', value: '75' },
    { label: '01:30', value: '90' },
    { label: '01:45', value: '105' },
    { label: '02:00', value: '120' },
    { label: '02:15', value: '135' },
    { label: '02:30', value: '150' },
    { label: '02:45', value: '165' },
    { label: '03:00', value: '180' },
    { label: '03:15', value: '195' },
    { label: '03:30', value: '210' },
    { label: '03:45', value: '225' },
    { label: '04:00', value: '240' },
    { label: '04:15', value: '255' },
    { label: '04:30', value: '270' },
    { label: '04:45', value: '285' },
    { label: '05:00', value: '300' },
    { label: '05:15', value: '315' },
    { label: '05:30', value: '330' },
    { label: '05:45', value: '345' },
    { label: '06:00', value: '360' },
    { label: '06:15', value: '375' },
    { label: '06:30', value: '390' },
    { label: '06:45', value: '405' },
    { label: '07:00', value: '420' },
    { label: '07:15', value: '435' },
    { label: '07:30', value: '450' },
    { label: '07:45', value: '465' },
    { label: '08:00', value: '480' },
    { label: '08:15', value: '495' },
    { label: '08:30', value: '510' },
    { label: '08:45', value: '525' },
    { label: '09:00', value: '540' },
    { label: '09:15', value: '555' },
    { label: '09:30', value: '570' },
    { label: '09:45', value: '585' },
    { label: '10:00', value: '600' },
    { label: '10:15', value: '615' },
    { label: '10:30', value: '630' },
    { label: '10:45', value: '645' },
    { label: '11:00', value: '660' },
    { label: '11:15', value: '675' },
    { label: '11:30', value: '690' },
    { label: '11:45', value: '705' },
    { label: '12:00', value: '720' },
    { label: '12:15', value: '735' },
    { label: '12:30', value: '750' },
    { label: '12:45', value: '765' },
    { label: '13:00', value: '780' },
    { label: '13:15', value: '795' },
    { label: '13:30', value: '810' },
    { label: '13:45', value: '825' },
    { label: '14:00', value: '840' },
    { label: '14:15', value: '855' },
    { label: '14:30', value: '870' },
    { label: '14:45', value: '885' },
    { label: '15:00', value: '900' },
    { label: '15:15', value: '915' },
    { label: '15:30', value: '930' },
    { label: '15:45', value: '945' },
    { label: '16:00', value: '960' },
    { label: '16:15', value: '975' },
    { label: '16:30', value: '990' },
    { label: '16:45', value: '1005' },
    { label: '17:00', value: '1020' },
    { label: '17:15', value: '1035' },
    { label: '17:30', value: '1050' },
    { label: '17:45', value: '1065' },
    { label: '18:00', value: '1080' },
    { label: '18:15', value: '1095' },
    { label: '18:30', value: '1110' },
    { label: '18:45', value: '1125' },
    { label: '19:00', value: '1140' },
    { label: '19:15', value: '1155' },
    { label: '19:30', value: '1170' },
    { label: '19:45', value: '1185' },
    { label: '20:00', value: '1200' },
    { label: '20:15', value: '1215' },
    { label: '20:30', value: '1230' },
    { label: '20:45', value: '1245' },
    { label: '21:00', value: '1260' },
    { label: '21:15', value: '1275' },
    { label: '21:30', value: '1290' },
    { label: '21:45', value: '1305' },
    { label: '22:00', value: '1320' },
    { label: '22:15', value: '1335' },
    { label: '22:30', value: '1350' },
    { label: '22:45', value: '1365' },
    { label: '23:00', value: '1380' },
    { label: '23:15', value: '1395' },
    { label: '23:30', value: '1410' },
    { label: '23:45', value: '1425' },
    { label: '24:00', value: '1440' }
]

const TodoListTable = ({ projectId, todoListItems, selectedDate }: TodoListTableProps) => {
    const { dispatch, state } = React.useContext(context)

    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
    const project = state.projects[projectId]
    const tasksAndDurations = todoListItems.map(({ taskId, duration }) => ({ ...state.tasks[taskId], duration }))
    
    return (
        <>

            <Heading.H3>{project.title}</Heading.H3>
            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell width="35%" scope="col">Task</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">Status</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="20%" scope="col">Duration</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="20%" scope="col">Actions</Table.TableHeaderCell>
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {tasksAndDurations
                        .sort((a, b) => a.title > b.title ? 1 : -1)
                        .map(({ title, status, id, duration }) => (
                            <Table.TableRow key={id}>
                                <Table.TableBodyCell>{title}</Table.TableBodyCell>
                                <Table.TableBodyCell>{projectStatusLookup[status]}</Table.TableBodyCell>
                                <Table.TableBodyCell>
                                    <LabelAndInput
                                        label="Duration"
                                        name="duration"
                                        value={`${duration}`}
                                        options={AVAILABLE_DURATIONS}
                                        inputType="select"
                                        handleChange={(value: string) => dispatch({ type: "EDIT_TODO_ITEM", payload: { todoListItem: { projectId, taskId: id, duration: parseInt(value, 10) }, selectedDate: formatDateKeyLookup(selectedDate) } })}
                                    /></Table.TableBodyCell>
                                <Table.TableBodyCell>
                                    <DropdownMenu title="Actions">{
                                        [<Button fullWidth key="edit" variation="FOREGROUND_PRIMARY" onClick={() => setSelectedTaskId(id)}>Edit</Button>]
                                    }</DropdownMenu>

                                </Table.TableBodyCell>
                            </Table.TableRow>
                        ))}
                </Table.TableBody>
            </Table.Table>
        </>
    )
}

export default TodoListTable