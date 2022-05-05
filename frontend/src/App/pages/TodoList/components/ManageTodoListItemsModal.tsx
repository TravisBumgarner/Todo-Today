import React from 'react'
import { v4 as uuid4 } from 'uuid'
import { useLiveQuery } from 'dexie-react-hooks'

import { Modal, Paragraph, BigBoxOfNothing, Button, Heading, ButtonWrapper } from 'sharedComponents'
import {  formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { TDateISODate, TTask, TTodoListItem } from 'sharedTypes'
import database from 'database'

type ManageTodoListItemsModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    selectedDate: TDateISODate
}

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
    const todoListItems = useLiveQuery(() => database.todoListItems.where({todoListDate: selectedDate}).toArray(), [selectedDate])

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
            todoListDate: selectedDate
        })
    }

    return (
        <Modal
            contentLabel={`Add ${formatDateDisplayString(selectedDate)}'s Tasks`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <>
                <Paragraph>Select tasks to add to the todo list.</Paragraph>
                {
                    projects.map(({title, id: projectId}) => {
                        const tasks = tasksByProjectId[projectId].length ? tasksByProjectId[projectId] : []
                        if(!tasks.length) return null
                        return (
                            <div key={projectId}>
                            <Heading.H2>{title}</Heading.H2>
                            <ButtonWrapper
                                vertical={tasks.map(({title, id: taskId}) => {
                                    return <Button key={taskId} fullWidth disabled={todoListTaskIds.includes(taskId)} variation="PRIMARY_BUTTON" onClick={() => handleAdd({projectId, taskId})}>{title}</Button>
                                })}
                            />
                                
                            </div>
                        )
                    })
                }
            </>
        </Modal >
    )
}

export default ManageTodoListItemsModal