import React from 'react'

import { TProject, TProjectStatus } from 'sharedTypes'
import { Button, Heading } from 'sharedComponents'
import { AddProjectModal, EditProjectModal, ProjectsTable } from './components'

const FAKE_PROJECTS: Record<string, TProject> = {
    '1': {
        id: "1",
        title: "PTO",
        status: TProjectStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
    },
    '2': {
        id: "2",
        title: "Sick Time",
        status: TProjectStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
    }
}

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
