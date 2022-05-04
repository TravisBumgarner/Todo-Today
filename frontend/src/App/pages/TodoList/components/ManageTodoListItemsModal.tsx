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
    todoListItemsByProjectId: Record<string, TTodoListItem[]>
    selectedDate: moment.Moment
}

const LabelInDisguise = styled.p`
    font-family: 'Comfortaa',cursive;
    font-size: 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({theme}) => theme.FOREGROUND_TEXT};
`

const ManageTodoListItemsModal = ({ showModal, setShowModal, todoListItemsByProjectId, selectedDate }: ManageTodoListItemsModalProps) => {
    const projects = useLiveQuery(() => database.projects.toArray())
    const tasks = useLiveQuery(() => database.tasks.toArray())
    const todoListItems = useLiveQuery(() => database.todoListItems.toArray())

    if(!projects){
        return <div>No projects</div>
    }

    const tasksByProject = bucketTasksByProject(projects, tasks)

    const mapTasksToCheckboxItems = (tasks: TTask[]) => {
        return tasks.map(({ title, id }) => ({
            label: title,
            name: title,
            value: id,
            checked: !!todoListItems && todoListItems.some(item => item.taskId === id)
        }))
    }

    return (
        <Modal
            contentLabel={`Manage ${selectedDate.format('dddd')}'s Tasks`}
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <>
                <Paragraph>Select tasks to add to the todo list.</Paragraph>
                {Object.keys(tasksByProject).map(projectId => {
                    const options = mapTasksToCheckboxItems(tasksByProject[projectId])
                    if (tasksByProject[projectId].length === 0) {
                        const projectDetails = projects.find(({id}) => id === projectId) as TProject
                        return (
                            <React.Fragment key={projectId}>
                                <LabelInDisguise>{projectDetails.title}</LabelInDisguise>
                                <BigBoxOfNothing message='This project has no tasks. :(' />
                            </React.Fragment>
                        )
                    }

                    return (
                        <div key={projectId}>
                            <LabelAndInput
                                handleChange={({ value, checked }) => {
                                    if (checked){
                                        database.todoListItems.add({
                                            duration: 0,
                                            projectId,
                                            id: uuid4(),
                                            taskId: value as string,
                                            date:  formatDateKeyLookup(selectedDate)
                                        })
                                    } else {
                                        // cant delete by a key that's not primary
                                        database.todoListItems.where({taskId: value, date: formatDateKeyLookup(selectedDate)}).delete()
                                    }
                                }}
                                options={options}
                                name="foo"
                                value="foo"
                                label={ (projects.find(({id}) => id === projectId) as TProject).title  } 
                                inputType='checkbox'
                            />
                        </div>
                    )
                })}
            </>
        </Modal >
    )
}

export default ManageTodoListItemsModal