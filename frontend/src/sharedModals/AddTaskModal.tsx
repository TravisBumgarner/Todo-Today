import React from 'react'
import { v4 as uuid4 } from 'uuid'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TProject, ETaskStatus, EProjectStatus, TDateISODate } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'

type AddTaskModalProps = {
    showModal: boolean
    project?: TProject
    setShowModal: (showModal: boolean) => void
    selectedDate: TDateISODate
}

const AddTaskModal = ({ showModal, setShowModal, project, selectedDate }: AddTaskModalProps) => {
    const [title, setTitle] = React.useState<string>('')
    const [projectId, setProjectId] = React.useState<TProject['id'] | ''>(project ? project.id : '')
    const [addToSelectedDate, setAddToSelectedDate] = React.useState<'yes' | 'no'>('yes')

    const projects = useLiveQuery(async () => {
        return await database
            .projects
            .where('status')
            .anyOf(EProjectStatus.ACTIVE)
            .toArray()
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

        if (addToSelectedDate === 'yes') {
            await database.todoListItems.add({
                projectId,
                taskId,
                id: taskId,
                todoListDate: selectedDate,
                details: ''
            })
        }
        setShowModal(false)
    }

    const projectSelectOptions = projects ? projects.map((p) => ({ value: p.id, label: p.title })) : []
    projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

    return (
        <Modal
            contentLabel="Add New Task"
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
                    name="addtoSelectedDate"
                    value={addToSelectedDate}
                    options={[
                        { value: 'no', label: 'No' },
                        { value: 'yes', label: 'Yes' },
                    ]}
                    inputType="select-array"
                    label="Add to selected date's tasks?"
                    handleChange={(value: 'yes' | 'no') => setAddToSelectedDate(value)}
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
