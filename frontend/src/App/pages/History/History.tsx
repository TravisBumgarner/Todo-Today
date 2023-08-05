import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import { Box, Typography } from '@mui/material'

import { EProjectStatus, ETaskStatus } from 'sharedTypes'
import { BigBoxOfNothing } from 'sharedComponents'
import { bucketTasksByProject } from 'utilities'
import database from 'database'
import { TasksTable } from './components'
import { pageHeaderCSS } from 'theme'

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
    if (!projects?.length) {
        Contents = <BigBoxOfNothing message="Create a project and then come back!" />
    } else if (tasks?.length) {
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
            <Box sx={pageHeaderCSS}>
                <Typography variant="h2">Manage</Typography>
            </Box>
            {/* <FilterWrapper> */}
            {/* <ProjectFilters statusFilter={projectStatusFilter} setStatusFilter={setProjectStatusFilter} />
                <TaskFilters statusFilter={taskStatusFilter} setStatusFilter={setTaskStatusFilter} /> */}
            {/* </FilterWrapper> */}
            {Contents}
        </div>
    )
}

export default Tasks
