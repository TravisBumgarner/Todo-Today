import { context } from 'Context'
import React from 'react'

import { BigBoxOfNothing, Heading } from 'sharedComponents'
import { TasksTable } from './components'
import { bucketTasksByProject } from 'utilities'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

const Tasks = () => {
    const { state } = React.useContext(context)
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

    // return (
    //     <>
    //         <Heading.H2>Tasks</Heading.H2>
    //         {Object.values(state.projects).length === 0
    //             ? 
    //             : TasksByProject
    //         }

    //     </>
    // )
}

export default Tasks
