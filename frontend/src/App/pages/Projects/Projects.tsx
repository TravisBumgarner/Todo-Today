import React from 'react'

import { TProject } from 'sharedTypes'
import { Button, Heading } from 'sharedComponents'
import { AddProjectModal, ProjectsTable } from './components'

import { FAKE_PROJECTS } from '../../fakeData'

const Projects = () => {
    const [showAddProjectModal, setShowAddProjectModal] = React.useState<boolean>(false)
    const [projects, setProjects] = React.useState<Record<string, TProject>>({...FAKE_PROJECTS})


    return (
        <>
            <Heading.H2>Projects</Heading.H2>
            <ProjectsTable projects={projects} setProjects={setProjects} />
            <Button fullWidth key="edit" variation="FOREGROUND_PRIMARY" onClick={() => setShowAddProjectModal(true)}>Add Project</Button>
            <AddProjectModal showModal={showAddProjectModal} setShowModal={setShowAddProjectModal} setProjects={setProjects} />
        </>
    )
}

export default Projects
