import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'

import { ETaskStatus, TProject, TTask } from 'sharedTypes'
import { BigBoxOfNothing, Button, ButtonWrapper, Heading, LabelAndInput } from 'sharedComponents'
import { bucketTasksByProject, taskStatusLookup } from 'utilities'
import database from 'database'
import { TasksTable } from './components'
import { EditTaskModal, AddTaskModal } from 'sharedModals'

type FilterProps = {
    setStatusFilter: React.Dispatch<React.SetStateAction<Record<ETaskStatus, boolean>>>
    statusFilter: Record<ETaskStatus, boolean>
}

const Filters = ({ setStatusFilter, statusFilter }: FilterProps) => {
    return <div style={{margin: '1rem 0'}}>
        <LabelAndInput
            inputType='checkbox'
            name='projectfilter'
            label='Filter Tasks By Status'
            handleChange={({ checked, value }) => setStatusFilter(prev => {
                const previousFilters = { ...prev }
                previousFilters[value as ETaskStatus] = checked
                return previousFilters
            })}
            options={
                Object.values(ETaskStatus).map(status => ({
                    label: taskStatusLookup[status],
                    value: status,
                    checked: statusFilter[status],
                    name: status
                }))
            }

        />
    </div>
}

const DEFAULT_STATUS_FILTER = { [ETaskStatus.NEW]: true, [ETaskStatus.IN_PROGRESS]: true, [ETaskStatus.CANCELED]: false, [ETaskStatus.COMPLETED]: false }


const Tasks = () => {
    const projects = useLiveQuery(() => database.projects.toArray())
    const tasks = useLiveQuery(() => database.tasks.toArray())
    const [statusFilter, setStatusFilter] = React.useState<Record<ETaskStatus, boolean>>(DEFAULT_STATUS_FILTER)
    const [showAddTaskModal, setShowAddTaskModal] = React.useState<boolean>(false)

    if (!projects || !tasks) {
        return <BigBoxOfNothing message="Create a project and tasks and then come back!" />
    }

    const filteredTasks = tasks.filter(({ status }) => statusFilter[status])

    const tasksByProject = bucketTasksByProject(projects, filteredTasks)

    const TasksByProject = projects.map((project) => {
        return (
            <TasksTable key={project.id} project={project} tasks={tasksByProject[project.id]} />
        )
    })

    return <div>
        <Heading.H2>Tasks</Heading.H2>

        <ButtonWrapper fullWidth={
            <Button fullWidth key="edit" variation="INTERACTION" onClick={() => setShowAddTaskModal(true)}>Add Task</Button>
        }
        />
        <Filters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        {filteredTasks.length === 0 
            ?  <BigBoxOfNothing message="Too many filters applied!" />
            : TasksByProject
        }
        <AddTaskModal showModal={showAddTaskModal} setShowModal={setShowAddTaskModal} />
    </div>
}

export default Tasks
