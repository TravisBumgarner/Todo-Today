import React from 'react'
import moment, { Moment } from 'moment'
import styled from 'styled-components'

import { EColorTheme, EDateFormat, TSettings, EWeekStart, EDaysOfWeek } from 'sharedTypes'
import { Heading, LabelAndInput, Form, Modal, BigBoxOfNothing, Button, ButtonWrapper, Table, DropdownMenu } from 'sharedComponents'
import { dateFormatLookup } from 'utilities'
import { context } from 'Context'
import { AddReminderIPC } from '../../../../shared/types'

const { ipcRenderer } = window.require('electron')


const dateFormatForUser = (format: EDateFormat, date: Moment) => {
    return {
        [EDateFormat.A]: `${moment(date).format(dateFormatLookup[EDateFormat.A])} `,
        [EDateFormat.B]: `${moment(date).format((dateFormatLookup[EDateFormat.B]))}`,
        [EDateFormat.C]: `${moment(date).format((dateFormatLookup[EDateFormat.C]))} (Month/Day/Year)`,
        [EDateFormat.D]: `${moment(date).format((dateFormatLookup[EDateFormat.D]))} (Day/Month/Year)`,
    }[format]
}

const weekStartOptionLabels: Record<EWeekStart, string> = {
    [EWeekStart.MONDAY]: 'Monday',
    [EWeekStart.SUNDAY]: 'Sunday',
}

const dayOfWeekLabels: Record<EDaysOfWeek, string> = {
    [EDaysOfWeek.SUNDAY]: 'Sunday',
    [EDaysOfWeek.MONDAY]: 'Monday',
    [EDaysOfWeek.TUESDAY]: 'Tuesday',
    [EDaysOfWeek.WEDNESDAY]: 'Wednesday',
    [EDaysOfWeek.THURSDAY]: 'Thursday',
    [EDaysOfWeek.FRIDAY]: 'Friday',
    [EDaysOfWeek.SATURDAY]: 'Saturday',
}

const dateFormatOptionLabels: Record<EDateFormat, string> = {
    [EDateFormat.A]: dateFormatForUser(EDateFormat.A, moment()),
    [EDateFormat.B]: dateFormatForUser(EDateFormat.B, moment()),
    [EDateFormat.C]: dateFormatForUser(EDateFormat.C, moment()),
    [EDateFormat.D]: dateFormatForUser(EDateFormat.D, moment()),
}

const colorThemeOptionLabels: Record<EColorTheme, string> = {
    [EColorTheme.BEACH]: 'Beach',
    [EColorTheme.FIRE_AND_ICE]: 'Fire & Ice',
    [EColorTheme.NEWSPAPER]: 'Newspaper',
    [EColorTheme.SUNSET]: 'Sunset',
}

type ScheduleMakerModalProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
}

const ScheduleMakerModal = ({ showModal, setShowModal }: ScheduleMakerModalProps) => {
    const [dayOfWeek, setDayOfWeek] = React.useState<EDaysOfWeek>(EDaysOfWeek.SUNDAY)
    const [timeOfDay, setTimeOfDay] = React.useState<any>('00:00')
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
                    handleChange={(dayOfWeek: EDaysOfWeek) => setDayOfWeek(dayOfWeek)}
                />
                <LabelAndInput
                    label="Time"
                    name="timeOfDay"
                    value={timeOfDay}
                    inputType="time"
                    handleChange={(timeOfDay: unknown) => setTimeOfDay(timeOfDay)}
                />
                <ButtonWrapper right={
                    [
                        <Button key="cancel" variation="ALERT_BUTTON" onClick={() => setShowModal(false)}>Cancel</Button>,
                        <Button key="save" variation="PRIMARY_BUTTON" type='button' onClick={handleSubmit}>Save</Button>
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
                        <Table.TableBodyCell>{dayOfWeek}</Table.TableBodyCell>
                        <Table.TableBodyCell>{hours}:{minutes}</Table.TableBodyCell>
                        <Table.TableBodyCell>
                            <DropdownMenu title="Actions">{
                                [<Button fullWidth key="edit" variation="PRIMARY_BUTTON" onClick={() => handleDelete(reminderIndex)}>Remove</Button>]
                            }
                            </DropdownMenu>

                        </Table.TableBodyCell>
                    </Table.TableRow>
                ))}
            </Table.TableBody>
        </Table.Table>
    )

}

const FakeLabel = styled.p`
    font-family: 'Comfortaa',cursive;
    font-size: 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.ALERT_BUTTON};
    margin: 0.5rem 0;
`

const Settings = () => {
    const { state, dispatch } = React.useContext(context)
    const [showModal, setShowModal] = React.useState<boolean>(false)

    const handleSubmit = (setting: Partial<Omit<TSettings, 'reminders'>>) => {
        dispatch({ type: 'EDIT_USER_SETTINGS', payload: setting })
    }
    return (
        <>
            <Heading.H2>Settings</Heading.H2>
            <Form>
                <LabelAndInput
                    inputType="select-enum"
                    name="weekStart"
                    label="Week starts on"
                    value={state.weekStart}
                    handleChange={(value: EWeekStart) => handleSubmit({ weekStart: value })}
                    options={EWeekStart}
                    optionLabels={weekStartOptionLabels}
                />
                <LabelAndInput
                    inputType="select-enum"
                    name="dateFormat"
                    label="Preferred Date Format"
                    value={state.dateFormat}
                    handleChange={(value: EDateFormat) => handleSubmit({ dateFormat: value })}
                    options={EDateFormat}
                    optionLabels={dateFormatOptionLabels}
                />
                <LabelAndInput
                    inputType="select-enum"
                    name="colorTheme"
                    label="Theme"
                    value={state.colorTheme}
                    handleChange={(value: EColorTheme) => handleSubmit({ colorTheme: value })}
                    options={EColorTheme}
                    optionLabels={colorThemeOptionLabels}
                />
            </Form>
            <div style={{ marginTop: "2rem" }}>
                <FakeLabel>Schedule Reminders</FakeLabel>
                {state.reminders.length === 0
                    ? <BigBoxOfNothing message="No Reminders yet, click Add Reminder Below" />
                    : <RemindersTable />
                }
                <Button key="addSchedule" fullWidth onClick={() => setShowModal(true)} variation="PRIMARY_BUTTON">Add Reminder</Button>
            </div>
            <ScheduleMakerModal setShowModal={setShowModal} showModal={showModal} />
        </>
    )
}

export default Settings
