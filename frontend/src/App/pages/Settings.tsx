import React from 'react'
import moment, { Moment } from 'moment'

import database from 'database'
import { EColorTheme, EDateFormat, EDaysOfWeek, EBackupInterval } from 'sharedTypes'
import {
    Paragraph,
    ConfirmationModal,
    Heading,
    LabelAndInput,
    Form,
    Modal,
    BigBoxOfNothing,
    Button,
    ButtonWrapper,
    Table,
    DropdownMenu,
    LabelInDisguise
} from 'sharedComponents'
import { dateFormatLookup, formatDurationDisplayString, dayOfWeekLabels, colorThemeOptionLabels, backupIntervalLookup, saveFile } from 'utilities'
import { context } from 'Context'
import { AddReminderIPC, BackupIPC } from '../../../../shared/types'

const { ipcRenderer } = window.require('electron')

const createBackup = async () => {
    const data = {
        projects: await database.projects.toArray(),
        tasks: await database.tasks.toArray(),
        todoListItems: await database.todoListItems.toArray(),
    }
    return data
}

const automatedBackup = (showAutomatedBackupFailedModal: React.Dispatch<React.SetStateAction<boolean>>) => {
    const backupInterval = localStorage.getItem('backupInterval') as EBackupInterval
    if (backupInterval === EBackupInterval.OFF) {
        return
    }
    const lastBackup = localStorage.getItem('lastBackup')

    const lastBackupThreshold = moment().subtract(backupIntervalLookup[backupInterval], 'hours')

    if (!lastBackup || moment(lastBackup) < lastBackupThreshold) {
        createBackup().then(async (data) => {
            const response = await ipcRenderer.invoke(
                'backup',
                { filename: `${moment().toISOString()}.json`, data: JSON.stringify(data) } as BackupIPC
            )
            if (response.isSuccess === true) {
                localStorage.setItem('lastBackup', moment().toString())
            } else {
                showAutomatedBackupFailedModal(true)
            }
        })
    }
}

const dateFormatForUser = (format: EDateFormat, date: Moment) => {
    return {
        [EDateFormat.A]: `${moment(date).format(dateFormatLookup[EDateFormat.A])} `,
        [EDateFormat.B]: `${moment(date).format((dateFormatLookup[EDateFormat.B]))}`,
        [EDateFormat.C]: `${moment(date).format((dateFormatLookup[EDateFormat.C]))} (Month/Day/Year)`,
        [EDateFormat.D]: `${moment(date).format((dateFormatLookup[EDateFormat.D]))} (Day/Month/Year)`,
    }[format]
}

const dateFormatOptionLabels: Record<EDateFormat, string> = {
    [EDateFormat.A]: dateFormatForUser(EDateFormat.A, moment()),
    [EDateFormat.B]: dateFormatForUser(EDateFormat.B, moment()),
    [EDateFormat.C]: dateFormatForUser(EDateFormat.C, moment()),
    [EDateFormat.D]: dateFormatForUser(EDateFormat.D, moment()),
}

type ScheduleMakerModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const ScheduleMakerModal = ({ showModal, setShowModal }: ScheduleMakerModalProps) => {
    const [dayOfWeek, setDayOfWeek] = React.useState<EDaysOfWeek>(EDaysOfWeek.MONDAY)
    const [timeOfDay, setTimeOfDay] = React.useState<any>('17:00')
    const { dispatch } = React.useContext(context)

    const handleSubmit = async () => {
        const [hours, minutes] = timeOfDay.split(':')
        const payload = { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10), dayOfWeek: parseInt(dayOfWeek, 10) } as AddReminderIPC
        const reminderIndex = await ipcRenderer.invoke('add-reminder', payload)

        dispatch({ type: 'ADD_REMINDER', payload: { dayOfWeek, hours, minutes, reminderIndex } })
        setShowModal(false)
    }

    return (
        <Modal
            contentLabel="Add Reminder"
            showModal={showModal}
            closeModal={() => setShowModal(false)}
        >
            <Form>
                <LabelAndInput
                    label="Day"
                    name="dayOfWeek"
                    value={dayOfWeek}
                    inputType="select-enum"
                    options={EDaysOfWeek}
                    optionLabels={dayOfWeekLabels}
                    handleChange={(value: EDaysOfWeek) => setDayOfWeek(value)}
                />
                <LabelAndInput
                    label="Time"
                    name="timeOfDay"
                    value={timeOfDay}
                    inputType="time"
                    handleChange={(value: unknown) => setTimeOfDay(value)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="WARNING" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" variation="INTERACTION" type="button" onClick={handleSubmit}>Save</Button>
                    ]
                }
                />
            </Form>
        </Modal>
    )
}

const RemindersTable = () => {
    const { state, dispatch } = React.useContext(context)

    const handleDelete = async (reminderIndex: string) => {
        const deletedReminderIndex = await ipcRenderer.invoke('remove-reminder', reminderIndex)

        dispatch({ type: 'DELETE_REMINDER', payload: { deletedReminderIndex } })
    }
    return (
        <Table.Table>
            <Table.TableHeader>
                <Table.TableRow>
                    <Table.TableHeaderCell>Day Of Week</Table.TableHeaderCell>
                    <Table.TableHeaderCell>Time of Day</Table.TableHeaderCell>
                    <Table.TableHeaderCell width="100px">Actions</Table.TableHeaderCell>
                </Table.TableRow>
            </Table.TableHeader>
            <Table.TableBody>
                {state.reminders.map(({ dayOfWeek, minutes, hours, reminderIndex }) => (
                    <Table.TableRow key={reminderIndex}>
                        <Table.TableBodyCell>{dayOfWeekLabels[dayOfWeek]}</Table.TableBodyCell>
                        <Table.TableBodyCell>{formatDurationDisplayString(parseInt(hours, 10) * 60 + parseInt(minutes, 10))}</Table.TableBodyCell>
                        <Table.TableBodyCell>
                            <DropdownMenu title="Actions">{
                                [<Button fullWidth key="edit" variation="INTERACTION" onClick={() => handleDelete(reminderIndex)}>Remove</Button>]
                            }
                            </DropdownMenu>

                        </Table.TableBodyCell>
                    </Table.TableRow>
                ))}
            </Table.TableBody>
        </Table.Table>
    )
}

const Settings = () => {
    const { state, dispatch } = React.useContext(context)
    const [showScheduleMakerModal, setShowScheduleMakerModal] = React.useState<boolean>(false)
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

    const handleSubmit = ({ key, value }: { key: string, value: string }) => {
        dispatch({ type: 'EDIT_USER_SETTING', payload: { key, value } })
    }
    return (
        <>
            <Heading.H2>User Preferences</Heading.H2>
            <Form>
                <LabelAndInput
                    inputType="select-enum"
                    name="dateFormat"
                    label="Preferred Date Format"
                    value={state.dateFormat}
                    handleChange={(value: EDateFormat) => handleSubmit({ key: 'dateFormat', value })}
                    options={EDateFormat}
                    optionLabels={dateFormatOptionLabels}
                />
                <LabelAndInput
                    inputType="select-enum"
                    name="colorTheme"
                    label="Theme"
                    value={state.colorTheme}
                    handleChange={(value: EColorTheme) => handleSubmit({ key: 'colorTheme', value })}
                    options={EColorTheme}
                    optionLabels={colorThemeOptionLabels}
                />
            </Form>
            <div style={{ marginTop: '2rem' }}>
                <LabelInDisguise>Schedule Reminders</LabelInDisguise>
                {state.reminders.length === 0
                    ? <BigBoxOfNothing message="No Reminders yet, click Add Reminder Below" />
                    : <RemindersTable />}
                <Button key="addSchedule" fullWidth onClick={() => setShowScheduleMakerModal(true)} variation="INTERACTION">Add Reminder</Button>
            </div>
            <ScheduleMakerModal setShowModal={setShowScheduleMakerModal} showModal={showScheduleMakerModal} />
            <div>
                <Heading.H2>Backups</Heading.H2>
                <Heading.H3>Manual Backup</Heading.H3>
                <Paragraph>Create a copy of the entire database.</Paragraph>
                <ButtonWrapper fullWidth={<Button onClick={() => handleBackup()} fullWidth variation="INTERACTION">Backup</Button>} />

                <Heading.H3>
                    Automated Backup
                </Heading.H3>
                <LabelAndInput
                    inputType="select-enum"
                    name="weekStart"
                    label={`How often would you like automated backups to run? (Last Backup: ${localStorage.getItem('lastBackup')})`}
                    value={state.backupInterval}
                    handleChange={(value: EBackupInterval) => dispatch({ type: 'EDIT_USER_SETTING', payload: { key: 'backupInterval', value } })}
                    options={EBackupInterval}
                    optionLabels={backupIntervalLookup}
                />
                <Heading.H3>Restore</Heading.H3>
                <Form>
                    <LabelAndInput
                        handleChange={(file) => setRestore(file)}
                        label="Restore database with a backup copy."
                        name="file"
                        inputType="file"
                    />
                    <ButtonWrapper
                        fullWidth={(
                            <Button
                                disabled={!restore}
                                onClick={() => setShowRestoreConfirmModal(true)}
                                fullWidth
                                variation="INTERACTION"
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
                                variation="INTERACTION"
                                onClick={() => setShowRestoreConfirmModal(false)}
                            >Cancel
                            </Button>,
                            <Button key="restore" variation="WARNING" onClick={() => handleRestore()}>Restore</Button>
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
        </>
    )
}

export default Settings
export { automatedBackup }
