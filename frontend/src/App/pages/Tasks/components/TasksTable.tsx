import React from 'react'

import { Button, Heading, Table } from 'sharedComponents'
import { TProject, TTask } from 'sharedTypes'
// import EditProjectModal from './EditProjectModal'
import AddTaskModal from './AddTaskModal'
import { projectStatusLookup } from 'utilities'


type TasksTableProps = {
    tasks: TTask[]
    project: TProject
    setTasks: React.Dispatch<React.SetStateAction<Record<string, TTask[]>>>
}

const TasksTable = ({ tasks, project, setTasks}: TasksTableProps) => {
    const [showAddTaskModal, setShowAddTaskModal] = React.useState<boolean>(false)

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
                                {/* <DropdownMenu title="Actions">{
                                    // [<Button fullWidth key="edit" variation="FOREGROUND_PRIMARY" onClick={() => setSelectedProjectId(id)}>Edit</Button>]
                                }</DropdownMenu> */}
                                
                            </Table.TableBodyCell>
                        </Table.TableRow>
                    ))}
                </Table.TableBody>
            </Table.Table>
            <Button fullWidth key="edit" variation="FOREGROUND_PRIMARY" onClick={() => setShowAddTaskModal(true)}>Add Task to {project.title}</Button>
            <AddTaskModal showModal={showAddTaskModal} project={project} setShowModal={setShowAddTaskModal} setTasks={setTasks} />
            {/* { selectedProjectId ? 
                (
                <EditProjectModal
                    showModal={selectedProjectId !== null}
                    setShowModal={() => setSelectedProjectId(null)}
                    project={projects[selectedProjectId]}
                    setProjects={setProjects}
                />
                ) : 
                (null)
            } */}
        </>
    )
}

export default TasksTable