import React from 'react'
import moment from 'moment'

import { Button, ButtonWrapper, Heading, LabelAndInput, Modal, Paragraph, Form, ConfirmationModal } from 'sharedComponents'
import { saveFile } from 'utilities'
import database from 'database'
import { TBackupInterval } from 'sharedTypes'
import { context } from 'Context'

const { ipcRenderer } = window.require('electron')

const backupIntervalOptions: Record<TBackupInterval, string> = {
    [TBackupInterval.HOURLY]: 'Hourly',
    [TBackupInterval.DAILY]: 'Daily',
    [TBackupInterval.WEEKLY]: 'Weekly',
    [TBackupInterval.MONTHLY]: 'Monthly',
    [TBackupInterval.OFF]: 'Off',
}

const createBackup = async () => {
    const data = {
        projects: await database.projects.toArray(),
        tasks: await database.tasks.toArray(),
        todoListItems: await database.todoListItems.toArray(),
    }
    return data
}

const automatedBackup = (showAutomatedBackupFailedModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    const backupInterval = localStorage.getItem('backupInterval') as TBackupInterval
    if (backupInterval === TBackupInterval.OFF) {
        return
    }
    const lastBackup = localStorage.getItem('lastBackup')
    const backupIntervalLookup = {
        [TBackupInterval.HOURLY]: 1,
        [TBackupInterval.DAILY]: 24,
        [TBackupInterval.WEEKLY]: 24 * 7,
        [TBackupInterval.MONTHLY]: 24 * 30
    }

    const lastBackupThreshold = moment().subtract(backupIntervalLookup[backupInterval], 'hours')

    if (!lastBackup || moment(lastBackup) < lastBackupThreshold) {
        createBackup().then(async (data) => {
            const response = await ipcRenderer.invoke('backup', { filename: `${moment().toISOString()}.json`, data: JSON.stringify(data) })
            if (response.isSuccess === true) {
                localStorage.setItem('lastBackup', moment().toString())
            } else {
                showAutomatedBackupFailedModal(true)
            }
        })
    }
}

const Backups = () => {
    const { state, dispatch } = React.useContext(context)
    const [restore, setRestore] = React.useState<File | null>(null)
    const [showRestoreConfirmModal, setShowRestoreConfirmModal] = React.useState<boolean>(false)
    const [showNoDataModal, setShowNoDataModal] = React.useState<boolean>(false)
    const [showInvalidBackupModal, setShowInvalidBackupModal] = React.useState<boolean>(false)

    const handleBackup = () => {
        const data = createBackup()
        if (!data) {
            setShowNoDataModal(true)
        } else {
            saveFile(`${moment().toISOString()}.json`, data)
        }
    }

    const handleRestore = () => {
        if (restore) {
            const reader = new FileReader()
            reader.readAsText(restore, 'UTF-8')
            reader.onload = async function (event) {
                if (event.target && event.target.result) {
                    const newStore = JSON.parse(event.target.result as string)

                    await Promise.all([
                        database.projects.clear(),
                        database.tasks.clear(),
                        database.todoListItems.clear(),
                    ])

                    await Promise.all([
                        database.projects.bulkAdd(newStore.projects),
                        database.tasks.bulkAdd(newStore.tasks),
                        database.todoListItems.bulkAdd(newStore.todoListItems)
                    ])
                    setRestore(null)
                } else {
                    setShowInvalidBackupModal(true)
                }
            }
        }
        setShowRestoreConfirmModal(false)
    }

    return (
        <div>
            <Heading.H2>Manual Backup</Heading.H2>
            <Paragraph>Create a copy of the entire database.</Paragraph>
            <ButtonWrapper fullWidth={<Button onClick={() => handleBackup()} fullWidth variation="PRIMARY_BUTTON">Backup</Button>} />

            <Heading.H2>
                Automated Backup
            </Heading.H2>
            <LabelAndInput
                inputType="select-enum"
                name="weekStart"
                label={`How often would you like automated backups to run? (Last Backup: ${localStorage.getItem('lastBackup')})`}
                value={state.backupInterval}
                handleChange={(value: TBackupInterval) => dispatch({ type: 'EDIT_USER_SETTINGS', payload: { backupInterval: value } })}
                options={TBackupInterval}
                optionLabels={backupIntervalOptions}
            />

            <Heading.H2>Restore</Heading.H2>
            <Form>
                <LabelAndInput handleChange={(file) => setRestore(file)} label="Restore database with a backup copy." name="file" inputType="file" />
                <ButtonWrapper
                    fullWidth={(
                        <Button
                            disabled={!restore}
                            onClick={() => setShowRestoreConfirmModal(true)}
                            fullWidth
                            variation="PRIMARY_BUTTON"
                        >
                            Restore from Backup
                        </Button>
                    )}
                />
            </Form>
            <Modal
                contentLabel="Restore?"
                showModal={showRestoreConfirmModal}
                closeModal={() => setShowRestoreConfirmModal(false)}
            >
                <Paragraph>If you have data you have not created a backup for, please do that first.</Paragraph>
                <Paragraph>Clicking restore will erase everything currently stored in the application.</Paragraph>
                <ButtonWrapper
                    right={[
                        <Button
                            key="cancel"
                            variation="PRIMARY_BUTTON"
                            onClick={() => setShowRestoreConfirmModal(false)}
                        >Cancel
                        </Button>,
                        <Button key="restore" variation="ALERT_BUTTON" onClick={() => handleRestore()}>Restore</Button>
                    ]}
                />
            </Modal>
            <ConfirmationModal
                body="There is no data to backup."
                title="Heads Up!"
                confirmationCallback={() => setShowNoDataModal(false)}
                showModal={showNoDataModal}
                setShowModal={setShowNoDataModal}
            />
            <ConfirmationModal
                body="That backup is invalid."
                title="Heads Up!"
                confirmationCallback={() => setShowInvalidBackupModal(false)}
                showModal={showInvalidBackupModal}
                setShowModal={setShowInvalidBackupModal}
            />

        </div>
    )
}

export default Backups
export { automatedBackup }
