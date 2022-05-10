import React from 'react'
import moment, { Moment } from 'moment'

import { TColorTheme, TDateFormat, TSettings, TWeekStart } from 'sharedTypes'
import { Heading, LabelAndInput, Form } from 'sharedComponents'
import { dateFormatLookup } from 'utilities'
import { context } from 'Context'

const dateFormatForUser = (format: TDateFormat, date: Moment) => {
    return {
        [TDateFormat.A]: `${moment(date).format(dateFormatLookup[TDateFormat.A])} `,
        [TDateFormat.B]: `${moment(date).format((dateFormatLookup[TDateFormat.B]))}`,
        [TDateFormat.C]: `${moment(date).format((dateFormatLookup[TDateFormat.C]))} (Month/Day/Year)`,
        [TDateFormat.D]: `${moment(date).format((dateFormatLookup[TDateFormat.D]))} (Day/Month/Year)`,
    }[format]
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

const colorThemeOptionLabels: Record<TColorTheme, string> = {
    [TColorTheme.BEACH]: 'Beach',
    [TColorTheme.FIRE_AND_ICE]: 'Fire & Ice',
    [TColorTheme.NEWSPAPER]: 'Newspaper',
    [TColorTheme.SUNSET]: 'Sunset',
}

enum TTabs {
    USER_PREFERENCES = "USER_PREFERENCES",
    BACKUPS = "BACKUPS",
}

const Settings = () => {
    const { state, dispatch } = React.useContext(context)

    const handleSubmit = (setting: Partial<TSettings>) => {
        dispatch({ type: "EDIT_USER_SETTINGS", payload: setting })
    }
    return (
        <>
            <Heading.H2>Settings</Heading.H2>
            <Form>
                <LabelAndInput
                    inputType="select-enum"
                    name='weekStart'
                    label="Week starts on"
                    value={state.weekStart}
                    handleChange={(value: TWeekStart) => handleSubmit({weekStart: value})}
                    options={TWeekStart}
                    optionLabels={weekStartOptionLabels}
                />
                <LabelAndInput
                    inputType="select-enum"
                    name='dateFormat'
                    label="Preferred Date Format"
                    value={state.dateFormat}
                    handleChange={(value: TDateFormat) => handleSubmit({dateFormat: value})}
                    options={TDateFormat}
                    optionLabels={dateFormatOptionLabels}
                />
                <LabelAndInput
                    inputType="select-enum"
                    name='colorTheme'
                    label="Theme"
                    value={state.colorTheme}
                    handleChange={(value: TColorTheme) => handleSubmit({colorTheme: value})}
                    options={TColorTheme}
                    optionLabels={colorThemeOptionLabels}
                />
            </Form>
        </>
    )
}

export default Settings
