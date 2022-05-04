import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'

import { Modal, Paragraph, BigBoxOfNothing, Button } from 'sharedComponents'
import {  formatDateKeyLookup } from 'utilities'
import { TTask, TTodoList, TTodoListItem } from 'sharedTypes'
import database from 'database'

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

const getTodoListTaskIds = (todoListItems: TTodoListItem[]) => todoListItems.map(({taskId}) => taskId)

const ManageTodoListItemsModal = ({ showModal, setShowModal, selectedDate }: ManageTodoListItemsModalProps) => {
    const tasks = useLiveQuery(() => database.tasks.toArray())
    const projects = useLiveQuery(() => database.projects.toArray())
    const todoListItems = useLiveQuery(() => database.todoListItems.where({todoListDate: formatDateKeyLookup(selectedDate)}).toArray(), [selectedDate])

    if(!tasks || !tasks.length || !projects || !projects.length){
        return <BigBoxOfNothing message='Go create some tasks and/or projects and come back!' />
    }
    const tasksByProjectId = getTasksByProjectId('projectId', tasks)
    const todoListTaskIds = getTodoListTaskIds(todoListItems || [])

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
            contentLabel={`Add ${selectedDate.format('dddd')}'s Tasks`}
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
                                {tasksByProjectId[projectId].length && tasksByProjectId[projectId].map(({title, id: taskId}) => {
                                    return <li key={taskId}><Button disabled={todoListTaskIds.includes(taskId)} variation="PRIMARY_BUTTON" onClick={() => handleAdd({projectId, taskId})}>{title}</Button></li>
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