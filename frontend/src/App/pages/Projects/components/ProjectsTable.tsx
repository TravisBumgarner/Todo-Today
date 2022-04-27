import React from 'react'

import { Button, DropdownMenu, Table } from 'sharedComponents'
import { TProject } from 'sharedTypes'
import EditProjectModal from './EditProjectModal'
import { formatDateDisplayString, projectStatusLookup } from 'utilities'


type ProjectsTableProps = {
    projects: Record<string, TProject>
    setProjects: React.Dispatch<React.SetStateAction<Record<string, TProject>>>
}

const ProjectsTable = ({ projects, setProjects }: ProjectsTableProps) => {
    const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)

    return (
        <>

            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell width="35%" scope="col">Project</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">Status</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">Start Date</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">End Date</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="20%" scope="col">Actions</Table.TableHeaderCell>
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {Object.values(projects).map(({ title, status, startDate, endDate, id }) => (
                        <Table.TableRow key={id}>
                            <Table.TableBodyCell>{title}</Table.TableBodyCell>
                            <Table.TableBodyCell>{projectStatusLookup[status]}</Table.TableBodyCell>
                            <Table.TableBodyCell>{formatDateDisplayString(startDate)}</Table.TableBodyCell>
                            <Table.TableBodyCell>{formatDateDisplayString(endDate)}</Table.TableBodyCell>
                            <Table.TableBodyCell>
                                <DropdownMenu title="Actions">{
                                    [<Button fullWidth key="edit" variation="FOREGROUND_PRIMARY" onClick={() => setSelectedProjectId(id)}>Edit</Button>]
                                }</DropdownMenu>
                                
                            </Table.TableBodyCell>
                        </Table.TableRow>
                    ))}
                </Table.TableBody>
            </Table.Table>
            { selectedProjectId ? 
                (
                <EditProjectModal
                    showModal={selectedProjectId !== null}
                    setShowModal={() => setSelectedProjectId(null)}
                    project={projects[selectedProjectId]}
                    setProjects={setProjects}
                />
                ) : 
                (null)
            }
        </>
    )
}

export default ProjectsTable