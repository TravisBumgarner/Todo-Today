import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'

import database from 'database'
import { BigBoxOfNothing, Button, DropdownMenu, Table } from 'sharedComponents'
import { TDateISODate, TProject } from 'sharedTypes'
import { EditTaskModal } from 'sharedModals'


type SuccessesTableProps = {
    selectedDate: TDateISODate
}

const SuccessesTable = ({ selectedDate }: SuccessesTableProps) => {
    const tableRows = useLiveQuery(async () => {
        const successes = await database.successes.toArray()

        return Promise.all(successes.map(async (success) => {
            const project = (await database.projects.where({ id: success.projectId }).first()) as TProject
            return {
                projectTitle: project ? project.title : '-',
                ...success
            }
        }))
    }, [])

    if (!tableRows || tableRows.length === 0) {
        return (
            <BigBoxOfNothing
                message="Get to it!"
            />
        )
    }

    return (
        <>
            <Table.Table>
                <Table.TableHeader>
                    <Table.TableRow>
                        <Table.TableHeaderCell width="20%">Project</Table.TableHeaderCell>
                        <Table.TableHeaderCell>Description</Table.TableHeaderCell>
                        <Table.TableHeaderCell width="100px">Actions</Table.TableHeaderCell>
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {
                        tableRows
                            .sort((a, b) => {
                                if (a.projectTitle.toLowerCase() < b.projectTitle.toLowerCase()) return -1
                                if (a.projectTitle.toLowerCase() > b.projectTitle.toLowerCase()) return 1
                                return 0
                            })
                            .map(({ id, projectTitle, description }) => {
                                return (
                                    <Table.TableRow key={id}>
                                        <Table.TableBodyCell>{projectTitle}</Table.TableBodyCell>
                                        <Table.TableBodyCell>{description}</Table.TableBodyCell>
                                        <Table.TableBodyCell>
                                            <DropdownMenu title="Actions">
                                                <Button
                                                    fullWidth
                                                    key="edit"
                                                    variation="INTERACTION"
                                                    onClick={() => console.log('hi')}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    key="remove"
                                                    variation="INTERACTION"
                                                    onClick={() => console.log('hi')}
                                                >
                                                    Remove
                                                </Button>
                                            </DropdownMenu>
                                        </Table.TableBodyCell>
                                    </Table.TableRow>
                                )
                            })
                    }
                </Table.TableBody>
            </Table.Table>
        </>
    )
}

export default SuccessesTable
