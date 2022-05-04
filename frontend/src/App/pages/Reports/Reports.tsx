import moment, { Moment } from 'moment'
import React from 'react'
import styled from 'styled-components'
import { useLiveQuery } from 'dexie-react-hooks'

import database from 'database'
import { Heading, LabelAndInput, Button, BigBoxOfNothing } from 'sharedComponents'
import { ReportsTable } from './components'
import { TTodoListItem } from 'sharedTypes'
import { formatDateKeyLookup } from 'utilities'

const FilterWrapper = styled.div`
    display: flex;

    > div {
        margin-right: 1rem;
        box-sizing: border-box;
    }
`

const LabelInDisguise = styled.p`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.FOREGROUND_TEXT};
    margin: 0.5rem 0;
`

const FiltersWrapper = styled.div`
    ${Button}{
        margin-right: 1rem;
        height: 40px;
    }
`

enum TQuickFilterOptions {
    THIS_WEEK = "THIS_WEEK",
    LAST_WEEK = "LAST_WEEK"
}

const getSundayDateOfWeek = (selectedDate: Moment) => {
    const dayOfWeek = selectedDate.day()
    const sunday = moment(selectedDate.subtract(dayOfWeek, 'days'))
    return sunday
}

const getSaturdayDateOfWeek = (selectedDate: Moment) => {
    const dayOfWeek = selectedDate.day()
    const saturday = moment(selectedDate.add(7 - dayOfWeek, 'days'))
    return saturday
}

type CrunchedNumbers = {
    projectId: string,
    projectTitle: string,
    dates: Record<string, number>
}

const crunchTheNumbers = (todoListItems: TTodoListItem[]) => {
    return todoListItems.reduce((accumulator, { projectId, duration, todoListDate }) => {
        if (!(projectId in accumulator)) {
            accumulator[projectId] = {}
        }

        if (!(todoListDate in accumulator[projectId])) {
            accumulator[projectId][todoListDate] = 0
        }

        accumulator[projectId][todoListDate] += duration

        return accumulator

    }, {} as Record<string, Record<string, number>>)
}

const Reports = () => {
    const [startDate, setStartDate] = React.useState<Moment>(getSundayDateOfWeek(moment()))
    const [endDate, setEndDate] = React.useState<Moment>(getSaturdayDateOfWeek(moment()))

    const filteredTodoListItems = useLiveQuery(async () => {
        return database.todoListItems.where('todoListDate').between(formatDateKeyLookup(startDate), formatDateKeyLookup(endDate), true, true).toArray()
    }, [startDate, endDate])

    const setQuickFilter = (quickFilter: TQuickFilterOptions) => {
        switch (quickFilter) {
            case TQuickFilterOptions.THIS_WEEK: {
                const sunday = getSundayDateOfWeek(moment())
                const saturday = getSaturdayDateOfWeek(moment())
                setStartDate(moment(sunday))
                setEndDate(moment(saturday))
                return
            }
            case TQuickFilterOptions.LAST_WEEK: {
                const sevenDaysAgo = moment(moment()).subtract(7, 'days')
                const sunday = getSundayDateOfWeek(sevenDaysAgo)
                const saturday = getSaturdayDateOfWeek(sevenDaysAgo)
                setStartDate(moment(sunday))
                setEndDate(moment(saturday))
                return
            }
        }
    }

    return (
        <>
            <FilterWrapper>
                <LabelAndInput
                    label="Start Date"
                    name="startDate"
                    value={startDate.format('YYYY-MM-DD')}
                    inputType="date"
                    handleChange={(date) => setStartDate(moment(date))}
                />
                <LabelAndInput
                    label="End Date"
                    name="endDate"
                    value={endDate.format('YYYY-MM-DD')}
                    inputType="date"
                    handleChange={(date) => setEndDate(moment(date))}
                />
                <div style={{ margin: '2rem 1rem 2rem 0rem' }}>
                    <LabelInDisguise>Quick Reports</LabelInDisguise>
                    <FiltersWrapper>
                        <Button variation='PRIMARY_BUTTON' onClick={() => setQuickFilter(TQuickFilterOptions.THIS_WEEK)}>This Week</Button>
                        <Button variation='PRIMARY_BUTTON' onClick={() => setQuickFilter(TQuickFilterOptions.LAST_WEEK)} >Last Week</Button>
                    </FiltersWrapper>
                </div>
            </FilterWrapper>
            <Heading.H2>Reports</Heading.H2>
            {
                !filteredTodoListItems || !filteredTodoListItems.length
                    ? <BigBoxOfNothing message="No data exists for these dates." />
                    : <ReportsTable startDate={startDate} endDate={endDate} crunchedNumbers={crunchTheNumbers(filteredTodoListItems)} />
            }
        </>
    )
}

export default Reports