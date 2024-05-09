import { Box, FormControlLabel, Switch } from '@mui/material'
import { useContext } from 'react'

import { context } from 'Context'
import { pageCSS } from 'theme'
import { DoMode, QueueMode } from './components'

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
      {workMode === 'do' ? <DoMode /> : <QueueMode />}
    </Box>
  )
}

export default Today
