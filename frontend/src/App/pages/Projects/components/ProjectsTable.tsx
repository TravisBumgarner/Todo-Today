import React from 'react'

import { BigBoxOfNothing, Button, DropdownMenu, Table } from 'sharedComponents'
import EditProjectModal from './EditProjectModal'
import { formatDateDisplayString, projectStatusLookup } from 'utilities'
import {context} from "Context"
import moment from 'moment'

const ProjectsTable = () => {
    const { dispatch, state } = React.useContext(context)

    const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)

    if(Object.values(state.projects).length === 0){
        return <BigBoxOfNothing message="Create a project and get going!" />
    }

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
                    {Object.values(state.projects).map(({ title, status, startDate, endDate, id }) => (
                        <Table.TableRow key={id}>
                            <Table.TableBodyCell>{title}</Table.TableBodyCell>
                            <Table.TableBodyCell>{projectStatusLookup[status]}</Table.TableBodyCell>
                            <Table.TableBodyCell>{formatDateDisplayString(moment(startDate))}</Table.TableBodyCell>
                            <Table.TableBodyCell>{formatDateDisplayString(moment(endDate))}</Table.TableBodyCell>
                            <Table.TableBodyCell>
                                <DropdownMenu title="Actions">{
                                    [<Button fullWidth key="edit" variation="PRIMARY_BUTTON" onClick={() => setSelectedProjectId(id)}>Edit</Button>]
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
                    selectedProjectId={selectedProjectId}
                />
                ) : 
                (null)
            }
        </>
    )
}

export default ProjectsTable