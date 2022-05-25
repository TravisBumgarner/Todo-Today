import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import styled from 'styled-components'

import { EProjectStatus, ETaskStatus } from 'sharedTypes'
import { BigBoxOfNothing, Button, ButtonWrapper, Heading, LabelAndInput } from 'sharedComponents'
import { bucketTasksByProject, projectStatusLookup, taskStatusLookup } from 'utilities'
import database from 'database'
import { AddTaskModal } from 'sharedModals'
import { TasksTable } from './components'

const FilterWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1.5rem 0;

    > div {
        max-width: 48%;
        width: fit-content;
    }

    @media (max-width: 1100px) {
        flex-direction: column;
         
        > div {
            margin: 0.5rem 0;
            width: fit-content;
            max-width: 100%;
        }
    }
`

type TaskFilterProps = {
    setStatusFilter: React.Dispatch<React.SetStateAction<Record<ETaskStatus, boolean>>>
    statusFilter: Record<ETaskStatus, boolean>
}

const TaskFilters = ({ setStatusFilter, statusFilter }: TaskFilterProps) => {
    return (
        <div>
            <LabelAndInput
                inputType="checkbox"
                name="projectfilter"
                label="Filter Tasks By Status"
                handleChange={({ checked, value }) => setStatusFilter((prev) => {
                    const previousFilters = { ...prev }
                    previousFilters[value as ETaskStatus] = checked
                    return previousFilters
                })}
                options={
                    Object.values(ETaskStatus).map((status) => ({
                        label: taskStatusLookup[status],
                        value: status,
                        checked: statusFilter[status],
                        name: status
                    }))
                }

            />
        </div>
    )
}

type ProjectFilterProps = {
    setStatusFilter: React.Dispatch<React.SetStateAction<Record<EProjectStatus, boolean>>>
    statusFilter: Record<EProjectStatus, boolean>
}

const ProjectFilters = ({ setStatusFilter, statusFilter }: ProjectFilterProps) => {
    return (
        <div>
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

const DEFAULT_TASK_STATUS_FILTER = {
    [ETaskStatus.NEW]: true,
    [ETaskStatus.IN_PROGRESS]: true,
    [ETaskStatus.CANCELED]: false,
    [ETaskStatus.COMPLETED]: false
}

const DEFAULT_PROJECT_STATUS_FILTER = {
    [EProjectStatus.NEW]: true,
    [EProjectStatus.IN_PROGRESS]: true,
    [EProjectStatus.CANCELED]: false,
    [EProjectStatus.COMPLETED]: false
}

const Tasks = () => {
    const projects = useLiveQuery(() => database.projects.toArray())
    const tasks = useLiveQuery(() => database.tasks.toArray())
    const [taskStatusFilter, setTaskStatusFilter] = React.useState<Record<ETaskStatus, boolean>>(DEFAULT_TASK_STATUS_FILTER)
    const [projectStatusFilter, setProjectStatusFilter] = React.useState<Record<ETaskStatus, boolean>>(DEFAULT_PROJECT_STATUS_FILTER)
    const [showAddTaskModal, setShowAddTaskModal] = React.useState<boolean>(false)



    let Contents
    if (!projects || !projects.length) {
        Contents = <BigBoxOfNothing message="Create a project and then come back!" />
    } else if (tasks && tasks.length) {
        const filteredTasks = tasks.filter(({ status }) => taskStatusFilter[status])
        const filteredProjects = projects.filter(({ status }) => projectStatusFilter[status])

        if (filteredTasks.length === 0 || filteredProjects.length === 0) {
            Contents = <BigBoxOfNothing message="Too many filters applied!" />
        } else {
            const bucketedTasksByProject = bucketTasksByProject(filteredProjects, filteredTasks)
            const TasksByProject = filteredProjects.map((project) => {
                return (
                    <TasksTable key={project.id} project={project} tasks={bucketedTasksByProject[project.id]} />
                )
            })
            Contents = TasksByProject
        }
    } else {
        Contents = <BigBoxOfNothing message="Create a task!" />
    }

    return (
        <div>
            <Heading.H2>Manage</Heading.H2>
            <FilterWrapper>
                <ProjectFilters statusFilter={projectStatusFilter} setStatusFilter={setProjectStatusFilter} />
                <TaskFilters statusFilter={taskStatusFilter} setStatusFilter={setTaskStatusFilter} />
            </FilterWrapper>
            <ButtonWrapper
                left={[
                    <Button
                        type="button"
                        fullWidth
                        key="edit"
                        variation="INTERACTION"
                        onClick={() => setShowAddTaskModal(true)}
                    >
                        Add New Task
                    </Button>
                ]}
            />
            {Contents}
            {showAddTaskModal
                ? <AddTaskModal addToTodayDefaultValue="no" showModal={showAddTaskModal} setShowModal={setShowAddTaskModal} />
                : null
            }
        </div>
    )
}

export default Tasks
