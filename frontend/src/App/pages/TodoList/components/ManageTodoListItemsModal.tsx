import React from 'react'
import moment from 'moment'

import { context } from 'Context'
import { Modal, Paragraph, LabelAndInput } from 'sharedComponents'
import { bucketTasksByProject, formatDateKeyLookup } from 'utilities'
import { TTask } from 'sharedTypes'

type ManageTodoListItemsModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    selectedDate: moment.Moment
}

const ManageTodoListItemsModal = ({ showModal, setShowModal, selectedDate }: ManageTodoListItemsModalProps) => {
    const { state, dispatch } = React.useContext(context)

    const handleSubmit = () => {
        console.log('hi')
    }

    const tasksByProject = bucketTasksByProject(Object.values(state.tasks))

    const mapTasksToCheckboxItems = (tasks: TTask[]) => {
        return tasks.map(({ title, id, projectId }) => ({
            label: title,
            name: title,
            value: title,
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
                <Paragraph>Hi.</Paragraph>
                {Object.keys(tasksByProject).map(projectId => {
                    return (
                        <div key={projectId}>
                            <ul>
                                <LabelAndInput
                                    handleChange={({ name, checked }) => {
                                        console.log('payload', { duration: 0, selectedDate: formatDateKeyLookup(selectedDate), taskId: name, isChecked: checked, projectId })
                                        dispatch({
                                            type: "EDIT_TODO_LIST_ITEM",
                                            payload: { duration: 0, selectedDate: formatDateKeyLookup(selectedDate), taskId: name, isChecked: checked, projectId }
                                        })
                                    }
                                    }
                                    options={mapTasksToCheckboxItems(tasksByProject[projectId])}
                                    name="foo"
                                    value="foo"
                                    label={state.projects[projectId].title}
                                    inputType='checkbox'
                                />
                            </ul>
                        </div>
                    )
                })}
            </>
        </Modal >
    )
}

export default ManageTodoListItemsModal