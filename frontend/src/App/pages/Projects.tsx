import React from 'react'

import { TProject, TProjectStatus } from 'sharedTypes'
import { Button, DropdownMenu, Table, Heading, Modal, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { projectStatusLookup } from '../utilities'
import moment, { Moment } from 'moment'

const projects: TProject[] = [
    {
        id: "1",
        title: "PTO",
        status: TProjectStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
    },
    {
        id: "2",
        title: "Sick Time",
        status: TProjectStatus.IN_PROGRESS,
        startDate: null,
        endDate: null,
    }
]

type AddProjectModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const AddProjectModal = ({ showModal, setShowModal }: AddProjectModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [startDate, setStartDate] = React.useState<Moment>(moment())
    const [endDate, setEndDate] = React.useState<Moment>(moment())

    return (
        <Modal
            contentLabel="Add Project"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <>
                <LabelAndInput
                    label="Title"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
                />
                <LabelAndInput
                    label="Start Date"
                    name="startDate"
                    value={startDate}
                    type="date"
                    handleChange={(data) => setStartDate(startDate)}
                />
                <LabelAndInput
                    label="End Date"
                    name="endDate"
                    value={endDate}
                    type="date"
                    handleChange={(data) => setStartDate(startDate)}
                />
                <ButtonWrapper right={
                    [
                        <Button variation="primary" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button variation="alert" onClick={() => console.log('save')}>Save</Button>
                    ]
                }
                />
            </>
        </Modal >
    )
}

const Projects = () => {
    const [showAddProjectModal, setShowAddProjectModal] = React.useState<boolean>(false)

    const handleAdd = () => {
        console.log('add project')
    }



    const handleEdit = () => {
        console.log('edit')
    }

    const actions = [
        <Button fullWidth key="edit" variation="primary" onClick={handleEdit}>Edit</Button>
    ]


    return (
        <>
            <Heading.H2>Test</Heading.H2>
            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell width="35%" scope="col">Title</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">Status</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">Start Date</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="15%" scope="col">End Date</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="20%" scope="col">Actions</Table.TableHeaderCell>
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {projects.map(({ title, status, startDate, endDate, id }) => (
                        <Table.TableRow key={id}>
                            <Table.TableBodyCell>{title}</Table.TableBodyCell>
                            <Table.TableBodyCell>{projectStatusLookup[status]}</Table.TableBodyCell>
                            <Table.TableBodyCell>{startDate}</Table.TableBodyCell>
                            <Table.TableBodyCell>{endDate}</Table.TableBodyCell>
                            <Table.TableBodyCell>
                                <DropdownMenu title="Actions">{actions}</DropdownMenu>
                            </Table.TableBodyCell>
                        </Table.TableRow>
                    ))}
                </Table.TableBody>
            </Table.Table>
            <Button fullWidth key="edit" variation="primary" onClick={() => setShowAddProjectModal(true)}>Add Project</Button>
            <AddProjectModal showModal={showAddProjectModal} setShowModal={setShowAddProjectModal} />
        </>
    )
}

export default Projects
