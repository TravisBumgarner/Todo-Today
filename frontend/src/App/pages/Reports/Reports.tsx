import moment, { Moment } from 'moment'
import React from 'react'
import styled from 'styled-components'

import { Heading, LabelAndInput, Button } from 'sharedComponents'
import { ReportsTable } from './components'
import { context } from 'Context'
import { TTodoList, TTodoListItem } from 'sharedTypes'
import { stringify } from 'uuid'

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
    const saturday = moment(selectedDate.add(6 - dayOfWeek, 'days'))
    return saturday
}

type CrunchedNumbers = {
    projectId: string,
    projectTitle: string,
    dates: Record<string, number>
}

const crunchTheNumbers = (datesToCrunch: Record<string, TTodoListItem[]>) => {
    const output: Record<string, Record<string, number>> = {}

    Object.keys(datesToCrunch).forEach(date => {
        output[date] = {}

        datesToCrunch[date].forEach(({ duration, projectId }) => {
            if(!(projectId in output[date])){
                output[date][projectId] = 0
            }
            output[date][projectId] += duration
        })
    })

    return output
}

const Reports = () => {
    const { state } = React.useContext(context)
    const [startDate, setStartDate] = React.useState<Moment>(moment().subtract(5, 'days'))
    const [endDate, setEndDate] = React.useState<Moment>(moment().add(5, 'days'))
    const [selectedDate, setSelectedDate] = React.useState<Moment>(moment())
    const [crunchedNumbers, setCrunchedNumbers] = React.useState<Record<string, Record<string, number>>>({})
    
    React.useEffect(() => {
        const datesToCrunch: Record<string, TTodoListItem[]> = {}

        Object
            .keys(state.todoList)
            .filter((date) => moment(date) > startDate && moment(date) < endDate)
            .forEach(date => datesToCrunch[date] = state.todoList[date])
        setCrunchedNumbers(crunchTheNumbers(datesToCrunch))
    }, [startDate, endDate])

    const setQuickFilter = (quickFilter: TQuickFilterOptions) => {
        switch (quickFilter) {
            case TQuickFilterOptions.THIS_WEEK: {
                const sunday = getSundayDateOfWeek(selectedDate)
                const saturday = getSaturdayDateOfWeek(selectedDate)
                setStartDate(moment(sunday))
                setEndDate(moment(saturday))
                return
            }
            case TQuickFilterOptions.LAST_WEEK: {
                const sevenDaysAgo = moment(selectedDate).subtract(7, 'days')
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
                    <LabelInDisguise>Quick Filters</LabelInDisguise>
                    <FiltersWrapper>
                        <Button variation='PRIMARY_BUTTON' onClick={() => setQuickFilter(TQuickFilterOptions.THIS_WEEK)}>This Week</Button>
                        <Button variation='PRIMARY_BUTTON' onClick={() => setQuickFilter(TQuickFilterOptions.LAST_WEEK)} >Last Week</Button>
                    </FiltersWrapper>
                </div>
            </FilterWrapper>
            <Heading.H2>Reports</Heading.H2>
            <ReportsTable startDate={startDate} endDate={endDate} crunchedNumbers={crunchedNumbers} />
        </>
    )
}

export default Reports