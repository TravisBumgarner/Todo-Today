import React from 'react'

import { Heading } from 'sharedComponents'
import { TTaskStatus, TTask } from 'sharedTypes'
import { FAKE_TASKS, FAKE_PROJECTS } from '../../fakeData'
import { TasksTable } from './components'

const bucketTasksToProjects = (tasks: TTask[]): Record<string, TTask[]> => {
    return tasks.reduce((accumulator, curr) => {
        if (!(curr.projectId in accumulator)) {
            accumulator[curr.projectId] = []
        }

        accumulator[curr.projectId].push(curr)

        return accumulator
    }, {} as Record<string, TTask[]>)
}

const Tasks = () => {
    const [showAddTaskModal, setShowAddTaskModal] = React.useState<boolean>(false)

    const bucketedTasks = bucketTasksToProjects(Object.values(FAKE_TASKS))
    console.log(bucketedTasks)
    return (
        <>
            <Heading.H2>Tasks</Heading.H2>
            {Object.keys(bucketedTasks).map(projectId => {
                console.log(projectId, bucketedTasks[projectId])
                return (
                    <>
                        <Heading.H3>{FAKE_PROJECTS[projectId].title}</Heading.H3>
                        <TasksTable tasks={bucketedTasks[projectId]} />
                    </>
                )
            })}
        </>
    )
}

export default Tasks
