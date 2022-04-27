import { context } from 'Context'
import React from 'react'

import {  Heading } from 'sharedComponents'
import {  TasksTable } from './components'
import { bucketTasksByProject } from 'utilities'

const Tasks = () => {
    const { state } = React.useContext(context)
    
    const tasks = bucketTasksByProject(Object.values(state.tasks))
    
    return (
        <>
            <Heading.H2>Tasks</Heading.H2>
            {Object.keys(tasks).map(projectId => {
                return (
                    <TasksTable key={projectId} project={state.projects[projectId]} tasks={tasks[projectId]} />
                )
            })}

        </>
    )
}

export default Tasks
