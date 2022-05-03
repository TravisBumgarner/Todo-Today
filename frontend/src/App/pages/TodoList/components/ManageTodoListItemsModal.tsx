import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

import { Modal, Paragraph, LabelAndInput, BigBoxOfNothing, Heading } from 'sharedComponents'
import { bucketTasksByProject, formatDateKeyLookup } from 'utilities'
import { TTask, TTodoListItem } from 'sharedTypes'
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

    if(!projects){
        return <div>No projects</div>
    }

    const tasksByProject = bucketTasksByProject(projects, tasks)
  

    const mapTasksToCheckboxItems = (tasks: TTask[]) => {
        return tasks.map(({ title, id }) => ({
            label: title,
            name: title,
            value: id,
            checked: false
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
                        return (
                            <React.Fragment key={projectId}>
                                <LabelInDisguise>hi</LabelInDisguise>
                                {/* <LabelInDisguise>{state.projects[projectId].title}</LabelInDisguise> */}
                                <BigBoxOfNothing message='This project has no tasks. :(' />
                            </React.Fragment>
                        )
                    }

                    return (
                        <div key={projectId}>
                            <LabelAndInput
                                handleChange={({ value, checked }) => {
                                    console.log('item checked')
                                    // dispatch({
                                    //     type: "TOGGLE_TODO_LIST_ITEM_FOR_SELECTED_DATE",
                                    //     payload: { shouldExistOnSelectedDate: checked, projectId, taskId: `${value}`, selectedDate: formatDateKeyLookup(selectedDate) }
                                    // })
                                }
                                }
                                options={options}
                                name="foo"
                                value="foo"
                                label={"FOO!"  } //state.projects[projectId].title
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