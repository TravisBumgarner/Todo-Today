import React from 'react'

import { Project } from 'sharedTypes'
import { Button, DropdownMenu, Table } from 'sharedComponents'
import { projectStatusLookup } from '../utilities'

const projects: Project[] = [
    {
        id: "1",
        title: "PTO",
        status: "IN_PROGRESS",
        startDate: null,
        endDate: null,
    },
    {
        id: "2",
        title: "Sick Time",
        status: "IN_PROGRESS",
        startDate: null,
        endDate: null,
    }
]

const Projects = () => {
    const handleEdit = () => {
        console.log('edit')
    }

    const actions = [
        <Button fullWidth key="edit" variation="primary" onClick={handleEdit}>Edit</Button>
    ]

    return <Table.Table>
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
}

export default Projects
