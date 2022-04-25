import * as React from 'react'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { useMutation, useQuery } from '@apollo/client'

import { context } from '.'
import { Task } from '../../../../sharedTypes'
import { ADD_TASK, GET_PROJECTS, GET_TASKS } from '../queries'

type AddTaskProps = {
    setShowAddTask: React.Dispatch<React.SetStateAction<boolean>>

}
const AddTask = ({ setShowAddTask }: AddTaskProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [description, setDescription] = React.useState<string>('')
    const [projectId, setProjectId] = React.useState<string>('')
    console.log(projectId)
    const [createTask] = useMutation(ADD_TASK, {
        variables: {
            title,
            description,
            id: uuidv4(),
            projectId
        },
        refetchQueries: [GET_TASKS]
    })

    const handleSubmit = async () => {

        if (projectId === '') {
            alert("please select a project id")
            return
        }
        await createTask()
        setShowAddTask(false)
    }

    const { loading, error, data } = useQuery(GET_PROJECTS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <label htmlFor='title'>Title</label>
            <input name='title' value={title} onChange={event => setTitle(event.target.value)} />

            <label htmlFor='description'>Description</label>
            <input name='description' value={description} onChange={event => setDescription(event.target.value)} />

            <label htmlFor='Project'>Project</label>
            <select value={projectId} onChange={event => setProjectId(event.target.value)}>
                <option key={'none'} value={''}>Select</option>
                {Object.values(data.projects).map(({ title, id }) => {
                    return <option key={id} value={id}>{title}</option>
                })}
            </select>
            <button onClick={handleSubmit}>Submit</button><button onClick={() => setShowAddTask(false)}>Cancel</button>
        </div>
    )
}

type ShowTaskProps = { task: Task }
const ShowTask = ({ task }: ShowTaskProps) => {
    return (
        <div>
            <h2>Title: {task.title}</h2>
            <p>Description: {task.description}</p>
        </div >
    )
}

type EditTaskProps = {
    task: Task
    setShowEditTask: React.Dispatch<React.SetStateAction<boolean>>
}
const EditTask = ({ task, setShowEditTask }: EditTaskProps) => {
    const [title, setTitle] = React.useState<string>(task.title)
    const [description, setDescription] = React.useState<string>(task.description)

    const handleSubmit = () => {
        // dispatch({ type: "TASK_MODIFIED", data: { title, description, id: task.id, projectId: task.projectId } })
        setShowEditTask(false)
    }

    const handleCancel = () => {
        setShowEditTask(false)
    }

    const handleDelete = () => {
        // dispatch({ type: "TASK_DELETED", data: { id: task.id } })
        setShowEditTask(false)
    }

    return (
        <div>
            <div>
                <label htmlFor="title">Title: </label>
                <input name="title" value={title} onChange={event => setTitle(event.target.value)} />
            </div>

            <div>
                <label htmlFor="description">Description: </label>
                <input name="description" value={description} onChange={event => setDescription(event.target.value)} />
            </div>

            <button onClick={handleSubmit}>Submit</button><button onClick={handleCancel}>Cancel</button><button onClick={handleDelete}>Delete</button>
        </div>
    )
}

type TaskProps = {
    task: Task
}
const Task = ({ task }: TaskProps) => {
    const [showEditTask, setShowEditTask] = React.useState<boolean>(false)

    return <div style={{ border: '2px solid black', padding: '10px' }}>

        {
            showEditTask
                ? (<EditTask setShowEditTask={setShowEditTask} task={task} />)
                : (
                    <>
                        <ShowTask task={task} />
                        <button onClick={() => setShowEditTask(true)}>Edit Taskit </button>
                    </>
                )
        }
    </div>
}

const ManageTasks = () => {
    const [selectedDate, setSelectedDate] = React.useState<moment.Moment>(moment())
    const [showAddTask, setShowAddTask] = React.useState<boolean>(false)
    const { loading, error, data } = useQuery(GET_TASKS);
    console.log(error)
    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
            setSelectedDate(selectedDate.clone().add(-1, 'days'))
        } else if (event.key === "ArrowRight") {
            setSelectedDate(selectedDate.clone().add(1, 'days'))
        }
    }

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [selectedDate])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            {Object.values(data.tasks as Task[]).map(task => <Task key={task.id} task={task} />)}
            <button onClick={() => setShowAddTask(!showAddTask)}>{showAddTask ? 'Cancel' : 'Add Task'}</button>
            {showAddTask && <AddTask setShowAddTask={setShowAddTask} />}
        </div>
    )
}

export default ManageTasks

