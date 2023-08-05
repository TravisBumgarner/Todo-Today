import React from 'react'
import moment from 'moment'
import { Box, Button, Typography } from '@mui/material'

import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { type TDateISODate } from 'sharedTypes'
import { TodoList, Successes } from './components'
import { pageHeaderCSS } from 'theme'

const Today = () => {
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
            <Box sx={pageHeaderCSS}>
                <Typography variant="h2">{formatDateDisplayString(selectedDate)}</Typography>
                <Button key="today" onClick={getToday} >Today</Button>
                <Button key="previous" onClick={setPreviousDate} >&lt;</Button>
                <Button key="next" onClick={getNextDate} >&gt;</Button>
            </Box>
            <TodoList selectedDate={selectedDate} />
            <Successes selectedDate={selectedDate} />
        </div>
    )
}

export default Today
