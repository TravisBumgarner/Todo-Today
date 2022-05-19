import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { BigBoxOfNothing, Button, DropdownMenu, Table } from 'sharedComponents'
import { formatDateDisplayString, projectStatusLookup } from 'utilities'
import database from 'database'
import { context } from 'Context'
import { EditProjectModal } from 'sharedModals'
import { EProjectStatus } from 'sharedTypes'

type ProjectTableProps = {
    statusFilter: Record<EProjectStatus, boolean>
}

const ProjectsTable = ({ statusFilter }: ProjectTableProps) => {
    const projects = useLiveQuery(() => database.projects.toArray())
    const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
    const { state: { dateFormat } } = React.useContext(context)

    if (!projects || projects.length === 0) {
        return <BigBoxOfNothing message="Create a project and get going!" />
    }

    const filteredProjects = projects.filter(({ status }) => statusFilter[status])
    if (filteredProjects.length === 0) {
        return <BigBoxOfNothing message="Too many filters applied!" />
    }

    return (
        <>
            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell>Project</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="70px" scope="col">Status</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">Start Date</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">End Date</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="100px" scope="col">Actions</Table.TableHeaderCell>
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {filteredProjects.map(({ title, status, startDate, endDate, id }) => (
                        <Table.TableRow key={id}>
                            <Table.TableBodyCell>{title}</Table.TableBodyCell>
                            <Table.TableBodyCell>{projectStatusLookup[status]}</Table.TableBodyCell>
                            <Table.TableBodyCell>{formatDateDisplayString(dateFormat, startDate) || 'Ongoing'}</Table.TableBodyCell>
                            <Table.TableBodyCell>{formatDateDisplayString(dateFormat, endDate) || 'Ongoing'}</Table.TableBodyCell>
                            <Table.TableBodyCell>
                                <DropdownMenu title="Actions">{
                                    [<Button fullWidth key="edit" variation="INTERACTION" onClick={() => setSelectedProjectId(id)}>Edit</Button>]
                                }
                                </DropdownMenu>

                            </Table.TableBodyCell>
                        </Table.TableRow>
                    ))}
                </Table.TableBody>
            </Table.Table>
            {selectedProjectId
                ? (
                    <EditProjectModal
                        showModal={selectedProjectId !== null}
                        setShowModal={() => setSelectedProjectId(null)}
                        projectId={selectedProjectId}
                    />
                )
                : (null)}
        </>
    )
}

export default ProjectsTable
