import React from 'react'

import { Heading } from 'sharedComponents'
import { TTaskStatus, TTask } from 'sharedTypes'

const FAKE_TASKS: Record<string, TTask> = {
    '1': {
        id: "1",
        title: "PTO",
        status: TTaskStatus.NEW,
        projectId: "1"
    },
    '2': {
        id: "2",
        title: "Sick Time",
        status: TTaskStatus.IN_PROGRESS,
        projectId: "1"
    }
}

const Projects = () => {
    const [showAddTaskModal, setShowAddTaskModal] = React.useState<boolean>(false)
    return (
        <>
            <Heading.H2>Tasks</Heading.H2>
        </>
    )
}

export default Projects
