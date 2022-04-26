import React from 'react'

import { Heading } from 'sharedComponents'
import { TTaskStatus, TTask } from 'sharedTypes'
import { FAKE_TASKS, FAKE_PROJECTS } from '../../fakeData'


const Tasks = () => {
    const [showAddTaskModal, setShowAddTaskModal] = React.useState<boolean>(false)
    return (
        <>
            <Heading.H2>Tasks</Heading.H2>
        </>
    )
}

export default Tasks
