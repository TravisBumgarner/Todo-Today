import React from 'react'

import { BigBoxOfNothing } from 'sharedComponents'
import { TasksTable } from './components'
import { bucketTasksByProject } from 'utilities'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

const Tasks = () => {
    const projects = useLiveQuery(() => database.projects.toArray())
    const tasks = useLiveQuery(() => database.tasks.toArray())

    if(!projects){
        return <BigBoxOfNothing message="Create a project and then come back!" />
    }

    const tasksByProject = bucketTasksByProject(projects, tasks)

    const TasksByProject = projects.map(project => {
        return (
            <TasksTable key={project.id} project={project} tasks={tasksByProject[project.id]} />
        )
    })

    return <div>{TasksByProject}</div>
}

export default Tasks
