import { context } from 'Context'
import React from 'react'

import {  Heading } from 'sharedComponents'
import { TTask } from 'sharedTypes'
import {  TasksTable } from './components'

const bucketTasksByProject = (tasks: TTask[]): Record<string, TTask[]> => {
    return tasks.reduce((accumulator, curr) => {
        if (!(curr.projectId in accumulator)) {
            accumulator[curr.projectId] = []
        }

        accumulator[curr.projectId].push(curr)

        return accumulator
    }, {} as Record<string, TTask[]>)
}

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
