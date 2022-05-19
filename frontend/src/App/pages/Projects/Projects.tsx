import React from 'react'

import { ButtonWrapper, Heading, Button, LabelAndInput, LabelInDisguise } from 'sharedComponents'
import { AddProjectModal } from 'sharedModals'
import { projectStatusLookup } from 'utilities'
import { EProjectStatus } from 'sharedTypes'
import { ProjectsTable } from './components'

const DEFAULT_STATUS_FILTER = {
    [EProjectStatus.NEW]: true,
    [EProjectStatus.IN_PROGRESS]: true,
    [EProjectStatus.CANCELED]: false,
    [EProjectStatus.COMPLETED]: false
}

type FilterProps = {
    setStatusFilter: React.Dispatch<React.SetStateAction<Record<EProjectStatus, boolean>>>
    statusFilter: Record<EProjectStatus, boolean>
}

const Filters = ({ setStatusFilter, statusFilter }: FilterProps) => {
    return (
        <div style={{ margin: '1.5rem 0' }}>
            <LabelAndInput
                inputType="checkbox"
                name="projectfilter"
                label="Filter Projects By Status"
                handleChange={({ checked, value }) => setStatusFilter((prev) => {
                    const previousFilters = { ...prev }
                    previousFilters[value as EProjectStatus] = checked
                    return previousFilters
                })}
                options={
                    Object.values(EProjectStatus).map((status) => ({
                        label: projectStatusLookup[status],
                        value: status,
                        checked: statusFilter[status],
                        name: status
                    }))
                }

            />
        </div>
    )
}

const Projects = () => {
    const [showAddProjectModal, setShowAddProjectModal] = React.useState<boolean>(false)
    const [statusFilter, setStatusFilter] = React.useState<Record<EProjectStatus, boolean>>(DEFAULT_STATUS_FILTER)

    return (
        <>
            <Heading.H2>Projects</Heading.H2>
            <Filters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
            <ButtonWrapper
                left={[<Button key="edit" variation="INTERACTION" onClick={() => setShowAddProjectModal(true)}>Add Project</Button>]}
            />

            <ProjectsTable statusFilter={statusFilter} />

            <AddProjectModal showModal={showAddProjectModal} setShowModal={setShowAddProjectModal} />
        </>
    )
}

export default Projects
