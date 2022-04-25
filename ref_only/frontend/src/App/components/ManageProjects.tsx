import * as React from 'react'
import Modal from 'react-modal'

import { useMutation, useQuery } from "@apollo/client";

import { AddProject } from '.';
import { Project, ProjectStatus } from '../../../../sharedTypes'
import { GET_PROJECTS, EDIT_PROJECT, DELETE_PROJECT } from '../queries'

type EditProjectProps = {
    project: Project
    setShowEditProject: React.Dispatch<React.SetStateAction<boolean>>
}
const EditProject = ({ project, setShowEditProject }: EditProjectProps) => {
    const [title, setTitle] = React.useState<string>(project.title)
    const [description, setDescription] = React.useState<string>(project.description)
    const [status, setStatus] = React.useState<ProjectStatus>(project.status)

    const [editProject] = useMutation(EDIT_PROJECT, {
        variables: {
            title,
            description,
            status,
            id: project.id
        },
        refetchQueries: [GET_PROJECTS]
    })

    const [deleteProject] = useMutation(DELETE_PROJECT, {
        variables: {
            id: project.id
        },
        refetchQueries: [GET_PROJECTS]
    })

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
            <div>
                <label htmlFor="status">Status: </label>
                <select name="status" value={status} onChange={event => setStatus(event.target.value as ProjectStatus)}>
                    <option value={ProjectStatus.ACTIVE}>Active</option>
                    <option value={ProjectStatus.INACTIVE}>Inactive</option>
                    <option value={ProjectStatus.COMPLETED}>Completed</option>
                    <option value={ProjectStatus.CANCELED}>Canceled</option>
                </select>
            </div>
            <button onClick={() => editProject().then(() => setShowEditProject(false))}>Submit</button>
            <button onClick={() => { setShowEditProject(false) }}>Cancel</button>
            <button onClick={() => { deleteProject().then(() => setShowEditProject(false)) }}>Delete</button>
        </div>
    )
}

type ShowProjectProps = { project: Project }
const ShowProject = ({ project }: ShowProjectProps) => {
    return (
        <div>
            <h2>Title: {project.title}</h2>
            <p>Description: {project.description}</p>
            <p>Status: {project.status}</p>
        </div >
    )
}

type ProjectProps = {
    project: Project
}

const Project = ({ project }: ProjectProps) => {
    const [showEditProject, setShowEditProject] = React.useState<boolean>(false)

    return <div style={{ border: '2px solid black', padding: '10px' }}>
        {
            showEditProject
                ? (<Modal
                    isOpen={showEditProject}
                    onRequestClose={() => setShowEditProject(false)}
                    contentLabel="Add Project"
                >
                    <EditProject setShowEditProject={setShowEditProject} project={project} />
                </Modal>)
                : (
                    <>
                        <ShowProject project={project} />
                        <button onClick={() => setShowEditProject(true)}>Edit Project</button>
                    </>
                )
        }
    </div>
}


const ManageProjects = () => {
    const [showAddProject, setShowAddProject] = React.useState<boolean>(false)
    const { loading, error, data } = useQuery(GET_PROJECTS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
            <p>Project List</p>
            <ul>
                {Object.keys(data.projects).map(id => {
                    return <Project key={id} project={data.projects[id]} />
                })}
            </ul>
            <button onClick={() => setShowAddProject(!showAddProject)}>{showAddProject ? 'Cancel' : 'Add Project'}</button>
            {showAddProject && (
                <Modal
                    isOpen={showAddProject}
                    onRequestClose={() => setShowAddProject(false)}
                    contentLabel="Add Project"
                >
                    <AddProject setShowAddProject={setShowAddProject} />
                </Modal>)
            }
        </>
    )
}
export default ManageProjects