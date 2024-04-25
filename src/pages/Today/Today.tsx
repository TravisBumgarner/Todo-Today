import { Box, FormControlLabel, Switch } from '@mui/material'
import { useContext } from 'react'

import { QueueMode, DoMode2 } from './components'
import { pageCSS } from 'theme'
import { context } from 'Context'

const Today = () => {
  const { state: { workMode }, dispatch } = useContext(context)

  const handleWorkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_WORK_MODE', payload: { workMode: event.target.checked ? 'do' : 'queue' } })
  }

  return (
    <Box css={pageCSS}>
      <FormControlLabel control={<Switch
        checked={workMode === 'do'}
        onChange={handleWorkModeChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />} label={workMode === 'do' ? 'Focus Mode' : 'Queue Mode'} />
      {workMode === 'do' ? <DoMode2 /> : <QueueMode />}
    </Box>
  )
}

export default Today
