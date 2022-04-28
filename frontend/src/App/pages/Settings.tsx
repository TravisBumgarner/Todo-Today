import React from 'react'
import moment, { Moment } from 'moment'

import { TAvailableThemes, TDateFormat, TWeekStart } from 'sharedTypes'
import { Button, ButtonWrapper, Heading, LabelAndInput } from 'sharedComponents'
import { context } from 'Context'
import {dateFormatLookup} from 'utilities'

const dateFormatForUser = (format: TDateFormat, date: Moment) => {
    return {
        [TDateFormat.A]: `${moment(date).format(dateFormatLookup[TDateFormat.A])} `,
        [TDateFormat.B]: `${moment(date).format((dateFormatLookup[TDateFormat.B]))}`,
        [TDateFormat.C]: `${moment(date).format((dateFormatLookup[TDateFormat.C]))} (Month/Day/Year)`,
        [TDateFormat.D]: `${moment(date).format((dateFormatLookup[TDateFormat.D]))} (Day/Month/Year)`,
    }[format]
}

const Settings = () => {
    const { state, dispatch } = React.useContext(context)
    const [weekStart, setWeekStart] = React.useState<TWeekStart>(state.settings.weekStart)
    const [dateFormat, setDateFormat] = React.useState<TDateFormat>(state.settings.dateFormat)
    const [submitDisabled, setSubmitDisabled] = React.useState<boolean>(true)

    const handleSubmit = () => {
        dispatch({type: "EDIT_USER_SETTINGS", payload: { colorTheme: TAvailableThemes.BEACH, weekStart, dateFormat}})
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
