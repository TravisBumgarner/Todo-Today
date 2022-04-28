import React from 'react'
import moment, { Moment } from 'moment'

import { TSettings, TDateFormat, TWeekStart } from 'sharedTypes'
import { Button, ButtonWrapper, Heading, LabelAndInput } from 'sharedComponents'
import { context } from 'Context'

const dateFormatForUser = (format: TDateFormat, date: Moment) => {
    return {
        [TDateFormat.A]: `${moment(date).format('MMMM Do YYYY')} (Month Day Year)`,
        [TDateFormat.B]: `${moment(date).format('MMMM Do')} (Month Day)`,
        [TDateFormat.C]: `${moment(date).format('MM/DD/YY')} (Month/Day/Year)`,
        [TDateFormat.D]: `${moment(date).format('DD/MM/YY')} (Day/Month/Year)`,
    }[format]
}

const Settings = () => {
    const { state, dispatch } = React.useContext(context)
    const [weekStart, setWeekStart] = React.useState<TWeekStart>(state.settings.weekStart)
    const [dateFormat, setDateFormat] = React.useState<TDateFormat>(state.settings.dateFormat)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)

    const handleSubmit = () => {
        console.log('dispatching', weekStart, dateFormat)
        dispatch({type: "EDIT_USER_SETTINGS", payload: {weekStart, dateFormat}})
        setSubmitDisabled(true)
    }

    const weekStartOptionLabels: Record<TWeekStart, string> = {
        [TWeekStart.MONDAY]: 'Monday',
        [TWeekStart.SUNDAY]: 'Sunday',
    }

    const dateFormatOptionLabels: Record<TDateFormat, string> = {
        [TDateFormat.A]: dateFormatForUser(TDateFormat.A, moment()),
        [TDateFormat.B]: dateFormatForUser(TDateFormat.B, moment()),
        [TDateFormat.C]: dateFormatForUser(TDateFormat.C, moment()),
        [TDateFormat.D]: dateFormatForUser(TDateFormat.D, moment()),
    }

    return (
        <>
            <Heading.H2>Settings</Heading.H2>
            <form onChange={() => setSubmitDisabled(false)}>
            <LabelAndInput
                inputType="select-enum"
                name='weekStart'
                label="Week starts on"
                value={weekStart}
                handleChange={(value: TWeekStart) => setWeekStart(value)}
                options={TWeekStart}
                optionLabels={weekStartOptionLabels}
            />
            <LabelAndInput
                inputType="select-enum"
                name='dateFormat'
                label="Preferred Date Format"
                value={dateFormat}
                handleChange={(value: TDateFormat) => setDateFormat(value)}
                options={TDateFormat}
                optionLabels={dateFormatOptionLabels}
            />
            <ButtonWrapper fullWidth={
                <Button type="button" fullWidth disabled={submitDisabled} key="edit" variation="PRIMARY_BUTTON" onClick={handleSubmit}>Submit</Button>
            }/>
            </form>
        </>
    )
}

export default Settings
