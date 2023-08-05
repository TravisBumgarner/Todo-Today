import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import styled from 'styled-components'
import { Typography } from '@mui/material'

import { EProjectStatus, ETaskStatus } from 'sharedTypes'
import { BigBoxOfNothing, LabelAndInput, PageHeader } from 'sharedComponents'
import { bucketTasksByProject, projectStatusLookup, taskStatusLookup } from 'utilities'
import database from 'database'
import { TasksTable } from './components'

const FilterWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1.5rem 0;

    > div {
        width: fit-content;
    }

    @media (max-width: 1200px) {
        flex-direction: column;
         
        > div {
            margin: 0.5rem 0;
            width: fit-content;
            max-width: 100%;
        }
    }
`

interface TaskFilterProps {
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
                handleChange={({ checked, value }) => {
                    setStatusFilter((prev) => {
                        const previousFilters = { ...prev }
                        previousFilters[value as ETaskStatus] = checked
                        return previousFilters
                    })
                }}
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

interface ProjectFilterProps {
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
                handleChange={({ checked, value }) => {
                    setStatusFilter((prev) => {
                        const previousFilters = { ...prev }
                        previousFilters[value as EProjectStatus] = checked
                        return previousFilters
                    })
                }}
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
    [ETaskStatus.CANCELED]: true,
    [ETaskStatus.COMPLETED]: true,
    [ETaskStatus.BLOCKED]: true
}

const DEFAULT_PROJECT_STATUS_FILTER = {
    [EProjectStatus.INACTIVE]: false,
    [EProjectStatus.ACTIVE]: true
}

const Tasks = () => {
    const projects = useLiveQuery(async () => await database.projects.toArray())
    const tasks = useLiveQuery(async () => await database.tasks.toArray())
    const [taskStatusFilter, setTaskStatusFilter] = React.useState<Record<ETaskStatus, boolean>>(DEFAULT_TASK_STATUS_FILTER)
    const [projectStatusFilter, setProjectStatusFilter] = React.useState<Record<EProjectStatus, boolean>>(DEFAULT_PROJECT_STATUS_FILTER)
    const [searchText, setSearchText] = React.useState<string>('')

    let Contents
    if (!projects || !projects.length) {
        Contents = <BigBoxOfNothing message="Create a project and then come back!" />
    } else if (tasks && tasks.length) {
        const filteredTasks = tasks
            .filter(({ status }) => taskStatusFilter[status])
            .filter(task => task.title.toLowerCase().includes(searchText.toLowerCase()))
        const filteredProjects = projects.filter(({ status }) => projectStatusFilter[status])

        if (filteredTasks.length === 0 || filteredProjects.length === 0) {
            Contents = <BigBoxOfNothing message="Too many filters applied!" />
        } else {
            const bucketedTasksByProject = bucketTasksByProject(filteredProjects, filteredTasks)
            const TasksByProject = filteredProjects
                .sort((a, b) => {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
                    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
                    return 0
                })
                .map((project) => {
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
            <PageHeader>
                <Typography variant="h2">Manage</Typography>
            </PageHeader>
            <FilterWrapper>
                <ProjectFilters statusFilter={projectStatusFilter} setStatusFilter={setProjectStatusFilter} />
                <TaskFilters statusFilter={taskStatusFilter} setStatusFilter={setTaskStatusFilter} />
            </FilterWrapper>
            {Contents}
        </div>
    )
}

export default Tasks