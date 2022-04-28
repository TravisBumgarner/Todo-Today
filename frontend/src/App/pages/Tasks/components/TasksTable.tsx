import React from 'react'

import { Button, Heading, Table, DropdownMenu } from 'sharedComponents'
import { TProject, TTask } from 'sharedTypes'
import EditTaskModal from './EditTaskModal'
import AddTaskModal from './AddTaskModal'
import { projectStatusLookup } from 'utilities'


type TasksTableProps = {
    tasks: TTask[]
    project: TProject
}

const TasksTable = ({ tasks, project }: TasksTableProps) => {
    const [showAddTaskModal, setShowAddTaskModal] = React.useState<boolean>(false)
    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)


    return (
        <>
            <Heading.H3>{project.title}</Heading.H3>
            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell width="35%" scope="col">Task</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">Status</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="20%" scope="col">Actions</Table.TableHeaderCell>
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {tasks.map(({ title, status, id }) => (
                        <Table.TableRow key={id}>
                            <Table.TableBodyCell>{title}</Table.TableBodyCell>
                            <Table.TableBodyCell>{projectStatusLookup[status]}</Table.TableBodyCell>
                            <Table.TableBodyCell>
                                <DropdownMenu title="Actions">{
                                    [<Button fullWidth key="edit" variation="FOREGROUND_PRIMARY" onClick={() => setSelectedTaskId(id)}>Edit</Button>]
                                }</DropdownMenu>

                            </Table.TableBodyCell>
                        </Table.TableRow>
                    ))}
                </Table.TableBody>
            </Table.Table>
            <Button fullWidth key="edit" variation="FOREGROUND_PRIMARY" onClick={() => setShowAddTaskModal(true)}>Add Task to {project.title}</Button>
            <AddTaskModal showModal={showAddTaskModal} project={project} setShowModal={setShowAddTaskModal} />
            {selectedTaskId ?
                (
                    <EditTaskModal
                        showModal={selectedTaskId !== null}
                        setShowModal={() => setSelectedTaskId(null)}
                        taskId={selectedTaskId}
                        project={project}
                    />
                ) :
                (null)
            }
        </>
    )
}

export default TasksTable