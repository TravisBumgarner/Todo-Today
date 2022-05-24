import React from 'react'
import { v4 as uuid4 } from 'uuid'
import moment from 'moment'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TProject, ETaskStatus } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { formatDateKeyLookup } from 'utilities'

type AddTaskModalProps = {
    showModal: boolean
    project?: TProject
    setShowModal: (showModal: boolean) => void
    addToTodayDefaultValue: 'yes' | 'no'
}

const AddTaskModal = ({ showModal, setShowModal, project, addToTodayDefaultValue }: AddTaskModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [projectId, setProjectId] = React.useState<TProject['id'] | ''>(project ? project.id : '')
    const [addToToday, setAddToToday] = React.useState<'yes' | 'no'>(addToTodayDefaultValue)

    const projects = useLiveQuery(async () => {
        return database.projects.toArray()
    }, [])

    const handleSubmit = async () => {
        const taskId = uuid4()

        const newTask = {
            title,
            status: ETaskStatus.NEW,
            id: taskId,
            projectId
        }
        await database.tasks.add(newTask)

        if (addToToday === 'yes') {
            await database.todoListItems.add({
                projectId,
                taskId,
                duration: 0,
                id: taskId,
                todoListDate: formatDateKeyLookup(moment()),
                details: ''
            })
        }
        setShowModal(false)
    }

    const projectSelectOptions = projects ? projects.map((p) => ({ value: p.id, label: p.title })) : []
    projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

    return (
        <Modal
            contentLabel="Add Task"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <Form>
                <LabelAndInput
                    label="Task"
                    name="title"
                    value={title}
                    handleChange={(data) => setTitle(data)}
                />
                <LabelAndInput
                    name="project"
                    value={projectId}
                    options={projectSelectOptions}
                    inputType="select-array"
                    label="Project"
                    handleChange={(value) => setProjectId(value)}
                />
                <LabelAndInput
                    name="addtotoday"
                    value={addToToday}
                    options={[
                        { value: 'no', label: 'No' },
                        { value: 'yes', label: 'Yes' },
                    ]}
                    inputType="select-array"
                    label="Add to today's tasks?"
                    handleChange={(value: 'yes' | 'no') => setAddToToday(value)}
                />

                <ButtonWrapper right={
                    [
                        <Button
                            key="cancel"
                            variation="WARNING"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>,
                        <Button
                            type="button"
                            disabled={title.length === 0 || projectId.length === 0}
                            key="save"
                            variation="INTERACTION"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

export default AddTaskModal
