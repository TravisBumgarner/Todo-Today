import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import { BigBoxOfNothing, Button, DropdownMenu, LabelAndInput, Paragraph, Table } from 'sharedComponents'
import { formatDateDisplayString, projectStatusLookup } from 'utilities'
import database from 'database'
import { EProjectStatus, TProject } from 'sharedTypes'
import { context } from 'Context'
import {EditProjectModal} from 'sharedModals'

type FilterProps = {
    setStatusFilter: React.Dispatch<React.SetStateAction<Record<EProjectStatus, boolean>>>
    statusFilter: Record<EProjectStatus, boolean>
}

const Filters = ({setStatusFilter, statusFilter}: FilterProps) => {
    return <div>
        <LabelAndInput 
            inputType='checkbox'
            name='projectfilter'
            label='Filter Project Status'
            handleChange={({checked, value}) => setStatusFilter(prev => {
                const previousFilters = {...prev}
                previousFilters[value as EProjectStatus] = checked
                return previousFilters
            })}
            options = {
                Object.values(EProjectStatus).map(status => ({
                    label: projectStatusLookup[status],
                    value: status,
                    checked: statusFilter[status],
                    name: status
                }))
            }

        />
    </div>
}

const DEFAULT_STATUS_FILTER = {[EProjectStatus.NEW]: true, [EProjectStatus.IN_PROGRESS]: true, [EProjectStatus.CANCELED]: false, [EProjectStatus.COMPLETED]: false}

const ProjectsTable = () => {
    const projects = useLiveQuery(() => database.projects.toArray())
    const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
    const { state: { dateFormat } } = React.useContext(context)
    const [statusFilter, setStatusFilter] = React.useState<Record<EProjectStatus, boolean>>(DEFAULT_STATUS_FILTER)
    if (!projects || projects.length === 0) {
        return <BigBoxOfNothing message="Create a project and get going!" />
    }
    return (
        <> 
            <Filters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
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
                    {projects.filter(({status}) => statusFilter[status]).map(({ title, status, startDate, endDate, id }) => (
                        <Table.TableRow key={id}>
                            <Table.TableBodyCell>{title}</Table.TableBodyCell>
                            <Table.TableBodyCell>{projectStatusLookup[status]}</Table.TableBodyCell>
                            <Table.TableBodyCell>{formatDateDisplayString(dateFormat, startDate)}</Table.TableBodyCell>
                            <Table.TableBodyCell>{formatDateDisplayString(dateFormat, endDate)}</Table.TableBodyCell>
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
            { selectedProjectId
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
