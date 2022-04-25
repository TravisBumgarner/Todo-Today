import React from 'react'
import { useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'

import { ADD_PROJECT, GET_PROJECTS } from '../queries'
import { ProjectStatus } from '../../../../sharedTypes'

type AddNewProjectProps = {
    setShowAddProject: React.Dispatch<React.SetStateAction<boolean>>
}

const AddProject = ({ setShowAddProject }: AddNewProjectProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [description, setDescription] = React.useState<string>('')
    const [status, setStatus] = React.useState<ProjectStatus>(ProjectStatus.ACTIVE)

    const [addProject] = useMutation(ADD_PROJECT, {
        variables: {
            title,
            description,
            status,
            id: uuidv4()
        },
        refetchQueries: [GET_PROJECTS]
    })

    const handleCancel = () => {
        setShowAddProject(false)
    }

    return (
        <div>
            <input value={title} onChange={event => setTitle(event.target.value)} />
            <input value={description} onChange={event => setDescription(event.target.value)} />
            <select value={status} onChange={event => setStatus(event.target.value as ProjectStatus)}>
                <option value={ProjectStatus.ACTIVE}>Active</option>
                <option value={ProjectStatus.INACTIVE}>Inactive</option>
                <option value={ProjectStatus.COMPLETED}>Completed</option>
                <option value={ProjectStatus.CANCELED}>Canceled</option>
            </select>
            <button onClick={() => addProject().then(() => setShowAddProject(false))}>Submit</button><button onClick={handleCancel}>Cancel</button>
        </div>
    )
}

export default AddProject