import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

import { Heading, Button, ButtonWrapper, PageHeader } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { TDateISODate } from 'sharedTypes'
import { context } from 'Context'
import { TodoList, Successes } from './components'

const Today = () => {
    const { state: { dateFormat } } = React.useContext(context)
    const [selectedDate, setSelectedDate] = React.useState<TDateISODate>(formatDateKeyLookup(moment()))

    const setPreviousDate = () => {
        setSelectedDate(formatDateKeyLookup(moment(selectedDate).subtract(1, 'day')))
    }

    const getNextDate = () => {
        setSelectedDate(formatDateKeyLookup(moment(selectedDate).add(1, 'day')))
    }

    const getToday = () => {
        setSelectedDate(formatDateKeyLookup(moment()))
    }

    return (
        <div>
            <PageHeader>
                <Heading.H2>{formatDateDisplayString(dateFormat, selectedDate)}</Heading.H2>
                <ButtonWrapper
                    left={[
                        <Button key="today" onClick={getToday} variation="INTERACTION">Today</Button>,
                        <Button key="previous" onClick={setPreviousDate} variation="INTERACTION">&lt;</Button>,
                        <Button key="next" onClick={getNextDate} variation="INTERACTION">&gt;</Button>,
                    ]}
                />
            </PageHeader>
            <TodoList selectedDate={selectedDate} />
            <Successes selectedDate={selectedDate} />
        </div>
    )
}

export default Today
