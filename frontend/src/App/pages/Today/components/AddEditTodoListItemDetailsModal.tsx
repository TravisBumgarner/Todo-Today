import React from 'react'

import { Button, Modal, ButtonWrapper, LabelAndInput, Form } from 'sharedComponents'
import { TTodoListItem } from 'sharedTypes'
import database from 'database'

type AddEditTodoListItemDetailsModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    todoListItem: {
        id: TTodoListItem['id'],
        details: TTodoListItem['details']
    }
}

const AddEditTodoListItemDetailsModal = ({ showModal, setShowModal, todoListItem }: AddEditTodoListItemDetailsModalProps) => {
    const [details, setDetails] = React.useState<string>(todoListItem.details)

    const handleSubmit = async () => {
        await database
            .todoListItems
            .where({ id: todoListItem.id })
            .modify({ details })
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="What are you working on specifically?"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >

            <Form>
                <LabelAndInput
                    label="Details"
                    name="details"
                    value={details}
                    inputType="textarea"
                    handleChange={(value) => setDetails(value)}
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
                            disabled={details.length === 0}
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

export default AddEditTodoListItemDetailsModal
