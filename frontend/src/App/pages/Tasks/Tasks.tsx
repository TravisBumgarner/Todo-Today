import { context } from 'Context'
import React from 'react'

import { BigBoxOfNothing, Heading } from 'sharedComponents'
import { TasksTable } from './components'
import { bucketTasksByProject } from 'utilities'

const Tasks = () => {
    const { state } = React.useContext(context)

    const tasks = bucketTasksByProject(state.projects, state.tasks)

    const TasksByProject = Object.keys(state.projects).map(projectId => {
        return (
            <TasksTable key={projectId} project={state.projects[projectId]} tasks={tasks[projectId]} />
        )
    })

    return (
        <>
            <Heading.H2>Tasks</Heading.H2>
            {Object.values(state.projects).length === 0
                ? <BigBoxOfNothing message="Create a project and then come back!" />
                : TasksByProject
            }

        </>
    )
}

export default Tasks
