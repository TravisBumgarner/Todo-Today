import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

import { context } from 'Context'
import { Modal, Paragraph, LabelAndInput, BigBoxOfNothing, Heading } from 'sharedComponents'
import { bucketTasksByProject, formatDateKeyLookup } from 'utilities'
import { TTask } from 'sharedTypes'

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

const ManageTodoListItemsModal = ({ showModal, setShowModal, selectedDate }: ManageTodoListItemsModalProps) => {
    const { state, dispatch } = React.useContext(context)

    const tasksByProject = bucketTasksByProject(state.projects, state.tasks)

    const mapTasksToCheckboxItems = (tasks: TTask[]) => {
        return tasks.map(({ title, id, projectId }) => ({
            label: title,
            name: title,
            value: id,
            checked: state // I'm sorry for having written this lol. 
                .todoList[formatDateKeyLookup(selectedDate)]
                .some((todoListItem) => todoListItem.taskId === id && todoListItem.projectId === projectId)
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
                    if (tasksByProject[projectId].length === 0) {
                        return (
                            <React.Fragment key={projectId}>
                                <LabelInDisguise>{state.projects[projectId].title}</LabelInDisguise>
                                <BigBoxOfNothing message='This project has no tasks. :(' />
                            </React.Fragment>
                        )
                    }

                    return (
                        <div key={projectId}>
                            <LabelAndInput
                                handleChange={({ value, checked }) => {
                                    dispatch({
                                        type: "TOGGLE_TODO_LIST_ITEM_FOR_SELECTED_DATE",
                                        payload: { shouldExistOnSelectedDate: checked, projectId, taskId: `${value}`, selectedDate: formatDateKeyLookup(selectedDate) }
                                    })
                                }
                                }
                                options={mapTasksToCheckboxItems(tasksByProject[projectId])}
                                name="foo"
                                value="foo"
                                label={state.projects[projectId].title}
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