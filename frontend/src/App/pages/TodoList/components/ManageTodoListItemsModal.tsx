import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { v4 as uuid4 } from 'uuid'

import { Modal, Paragraph, LabelAndInput, BigBoxOfNothing, Heading } from 'sharedComponents'
import { bucketTasksByProject, formatDateKeyLookup } from 'utilities'
import { TProject, TTask, TTodoListItem } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

type ManageTodoListItemsModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    selectedDate: moment.Moment
}

const LabelInDisguise = styled.p`
    font-family: 'Comfortaa',cursive;
    font-size: 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({theme}) => theme.FOREGROUND_TEXT};
`

const getTasksByProjectId = <T extends TTask>(key: keyof TTask, arrayItems: T[]) => {
    return arrayItems.reduce((accumulator, current) => {
        if(!(current[key] in accumulator)){
            accumulator[current[key]] = []
        }
        accumulator[current[key]].push(current)
        return accumulator
    },
    {} as Record<string, T[]>)
}


const ManageTodoListItemsModal = ({ showModal, setShowModal, selectedDate }: ManageTodoListItemsModalProps) => {
    const tasks = useLiveQuery(() => database.tasks.toArray())
    const projects = useLiveQuery(() => database.projects.toArray())
    const todoListItems = useLiveQuery(() => database.todoListItems.toArray())

    if(!tasks || !tasks.length || !projects || !projects.length){
        return <BigBoxOfNothing message='Go create some tasks and/or projects and come back!' />
    }
    const tasksByProjectId = getTasksByProjectId('projectId', tasks)

    const handleAdd = ({projectId, taskId}: {projectId: string, taskId: string}) => {
        database.todoListItems.add({
            projectId,
            taskId,
            duration: 0,
            id: uuid4(),
            todoListDate: formatDateKeyLookup(selectedDate)
        })
    }

    return (
        <Modal
            contentLabel={`Manage ${selectedDate.format('dddd')}'s Tasks`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <>
                <Paragraph>Select tasks to add to the todo list.</Paragraph>
                {
                    projects.map(({title, id: projectId}) => {
                        return (
                            <div key={projectId}>
                            {title}
                            <ul>
                                {tasksByProjectId[projectId].map(({title, id: taskId}) => {
                                    return <li key={taskId}><button onClick={() => handleAdd({projectId, taskId})}>{title}</button></li>
                                })}
                            </ul>
                            </div>
                        )
                    })
                }
            </>
        </Modal >
    )
}

export default ManageTodoListItemsModal