import React from 'react'
import moment from 'moment'
import { Box, Button, Typography } from '@mui/material'

import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { TodoList, Successes } from './components'
import { pageHeaderCSS } from 'theme'
import { context } from 'Context'

const Today = () => {
  const { state, dispatch } = React.useContext(context)

  const setPreviousDate = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment(state.selectedDate).subtract(1, 'day')) } })
  }

  const getNextDate = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment(state.selectedDate).add(1, 'day')) } })
  }

  const getToday = () => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: { date: formatDateKeyLookup(moment()) } })
  }

  return (
    <div>
      <Box sx={pageHeaderCSS}>
        <Typography variant="h2">{formatDateDisplayString(state.selectedDate)}</Typography>
        <Button key="today" onClick={getToday} >Today</Button>
        <Button key="previous" onClick={setPreviousDate} >&lt;</Button>
        <Button key="next" onClick={getNextDate} >&gt;</Button>
      </Box>
      <TodoList />
      <Successes />
    </div>
  )
}

export default Today
