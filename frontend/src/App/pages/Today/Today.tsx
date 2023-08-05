import React, { useContext } from 'react'
import moment from 'moment'
import { Box, Button, ButtonGroup, Typography } from '@mui/material'

import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { TodoList, Successes } from './components'
import { pageHeaderCSS } from 'theme'
import { context } from 'Context'

const Today = () => {
  const { state, dispatch } = useContext(context)

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
        <ButtonGroup>
          <Button onClick={setPreviousDate} >&lt;</Button>
          <Button onClick={getToday} >Today</Button>
          <Button onClick={getNextDate} >&gt;</Button>
        </ButtonGroup>
      </Box>
      <TodoList />
      <Successes />
    </div>
  )
}

export default Today
