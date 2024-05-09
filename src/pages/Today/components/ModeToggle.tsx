import { FormControlLabel, Switch } from '@mui/material'
import { useContext } from 'react'

import { context } from 'Context'

const ModeToggle = () => {
  const { state: { workMode }, dispatch } = useContext(context)

  const handleWorkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_WORK_MODE', payload: { workMode: event.target.checked ? 'do' : 'queue' } })
  }

  return (
    <FormControlLabel
      css={{ width: '170px' }}
      control={
        <Switch
          checked={workMode === 'do'}
          onChange={handleWorkModeChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      } label={workMode === 'do' ? 'Focus Mode' : 'Queue Mode'} />
  )
}

export default ModeToggle
