import React from 'react'

import { Button, ButtonWrapper, Heading } from 'sharedComponents'
import { AddProjectModal } from 'sharedModals'
import { ProjectsTable } from './components'

const Projects = () => {
    const [showAddProjectModal, setShowAddProjectModal] = React.useState<boolean>(false)

    return (
        <>
            <Heading.H2>Projects</Heading.H2>
            <ProjectsTable />
            <ButtonWrapper fullWidth={
                <Button fullWidth key="edit" variation="INTERACTION" onClick={() => setShowAddProjectModal(true)}>Add Project</Button>
            }
            />

            <AddProjectModal showModal={showAddProjectModal} setShowModal={setShowAddProjectModal} />
        </>
    )
}

export default Projects
