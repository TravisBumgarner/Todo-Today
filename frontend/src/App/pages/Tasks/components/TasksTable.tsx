import React from 'react'

import { Button, DropdownMenu, Table } from 'sharedComponents'
import { TTask } from 'sharedTypes'
// import EditProjectModal from './EditProjectModal'
import { projectStatusLookup } from 'utilities'


type TasksTableProps = {
    tasks: TTask[]
    // setProjects: React.Dispatch<React.SetStateAction<Record<string, TTask>>>
}

const TasksTable = ({ tasks }: TasksTableProps) => {
    // const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)

    return (
        <>

            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell width="35%" scope="col">Title</Table.TableHeaderCell>
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