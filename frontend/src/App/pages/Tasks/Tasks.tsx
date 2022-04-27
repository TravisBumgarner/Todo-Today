import React from 'react'

import { Button, Heading } from 'sharedComponents'
import { TTaskStatus, TTask } from 'sharedTypes'
import { FAKE_TASKS, FAKE_PROJECTS } from '../../fakeData'
import { AddTaskModal, TasksTable } from './components'

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
    const [tasks, setTasks] = React.useState<Record<string, TTask[]>>(bucketTasksByProject(Object.values(FAKE_TASKS)))
    
    return (
        <>
            <Heading.H2>Tasks</Heading.H2>
            {Object.keys(tasks).map(projectId => {
                return (
                    <TasksTable setTasks={setTasks} project={FAKE_PROJECTS[projectId]} tasks={tasks[projectId]} />
                )
            })}

        </>
    )
}

export default Tasks
