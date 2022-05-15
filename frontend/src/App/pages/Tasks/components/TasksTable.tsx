import React from 'react'

import { Button, Heading, Table, DropdownMenu, BigBoxOfNothing, ButtonWrapper, LabelAndInput } from 'sharedComponents'
import { ETaskStatus, TProject, TTask } from 'sharedTypes'
import { projectStatusLookup } from 'utilities'
import { EditTaskModal } from 'sharedModals'

type TasksTableProps = {
    tasks: TTask[] | null
    project: TProject
}

const TasksTable = ({ tasks, project }: TasksTableProps) => {
    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)


    if (!tasks) {
        return <BigBoxOfNothing message="Create a task and then come back!" />
    }

    const TasksTableOnly = (
        <Table.Table>
            <Table.TableHeader>
                <Table.TableRow>
                    <Table.TableHeaderCell>Task</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="70px">Status</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="110px">Actions</Table.TableHeaderCell>
                </Table.TableRow>
            </Table.TableHeader>
            <Table.TableBody>
                {tasks.map(({ title, status, id }) => (
                    <Table.TableRow key={id}>
                        <Table.TableBodyCell>{title}</Table.TableBodyCell>
                        <Table.TableBodyCell>{projectStatusLookup[status]}</Table.TableBodyCell>
                        <Table.TableBodyCell>
                            <DropdownMenu title="Actions">{
                                [<Button fullWidth key="edit" variation="INTERACTION" onClick={() => setSelectedTaskId(id)}>Edit</Button>]
                            }
                            </DropdownMenu>

                        </Table.TableBodyCell>
                    </Table.TableRow>
                ))}
            </Table.TableBody>
        </Table.Table>
    )

    return (
        <>
            <Heading.H3>{project.title}</Heading.H3>
            {

                tasks.length === 0
                    ? (<BigBoxOfNothing message="Create a tasks and get going!" />)
                    : (TasksTableOnly)
            }

            
            {selectedTaskId
                ? (
                    <EditTaskModal
                        showModal={selectedTaskId !== null}
                        setShowModal={() => setSelectedTaskId(null)}
                        taskId={selectedTaskId}
                    />
                )
                : (null)}
        </>
    )
}

export default TasksTable
