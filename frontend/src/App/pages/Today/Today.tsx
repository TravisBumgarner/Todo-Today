import React from 'react'
import moment from 'moment'
import { Button } from '@mui/material'

import { Heading, ButtonWrapper, PageHeader } from 'sharedComponents'
import { formatDateDisplayString, formatDateKeyLookup } from 'utilities'
import { type TDateISODate } from 'sharedTypes'
import { TodoList, Successes } from './components'

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
      <PageHeader>
        <Heading.H2>{formatDateDisplayString(selectedDate)}</Heading.H2>
        <ButtonWrapper
          left={[
            <Button key="today" onClick={getToday} >Today</Button>,
            <Button key="previous" onClick={setPreviousDate} >&lt;</Button>,
            <Button key="next" onClick={getNextDate} >&gt;</Button>
          ]}
        />
      </PageHeader>
      <TodoList selectedDate={selectedDate} />
      <Successes selectedDate={selectedDate} />
    </div>
  )
}

export default Today
