import React from 'react'
import moment, { Moment } from 'moment'

import { Heading, LabelAndInput } from 'sharedComponents'
import { context } from 'Context'

const dateFormatForUser = (format: 'a' | 'b' | 'c' | 'd', date: Moment) => {
    return {
        'a': `${moment(date).format('MMMM Do YYYY')} (Month Day Year)`,
        'b': `${moment(date).format('MMMM Do')} (Month Day)`,
        'c': `${moment(date).format('MM/DD/YY')} (Month/Day/Year)`,
        'd': `${moment(date).format('DD/MM/YY')} (Day/Month/Year)`,
    }[format]
    
    
}

const Settings = () => {
    const { state, dispatch } = React.useContext(context)

    const [weekStart, setWeekStart] = React.useState<string>('sunday')
    const [preferredDateFormat, setPreferredDateFormat] = React.useState<string>('a')


    return (
        <>
            <Heading.H2>Settings</Heading.H2>
            <LabelAndInput
                inputType="select"
                name='weekStart'
                label="Week starts on"
                value={weekStart}
                handleChange={(value: string) => setWeekStart(value)}
                options={[
                    { label: "Monday", value: "monday" },
                    { label: "Sunday", value: "sunday" }
                ]}
            />
            <LabelAndInput
                inputType="select"
                name='preferredDateFormat'
                label="Preferred Date Format"
                value={preferredDateFormat}
                handleChange={(value: string) => setPreferredDateFormat(value)}
                options={[
                    { label: dateFormatForUser('a', moment()), value: "a" },
                    { label: dateFormatForUser('b', moment()), value: "a" },
                    { label: dateFormatForUser('c', moment()), value: "b" },
                    { label: dateFormatForUser('d', moment()), value: "d" },
                ]}
            />
        </>
    )
}

export default Settings
