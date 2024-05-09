import { useState, useCallback, useContext } from 'react'
import { Box, Button, InputLabel, ToggleButton, ToggleButtonGroup } from '@mui/material'

import Modal from './Modal'
import { ButtonWrapper } from 'sharedComponents'
import { context } from 'Context'
import { sendAsyncIPCMessage } from 'utilities'
import { EAsyncMessageIPCFromRenderer } from 'shared/async-message-types'

enum EDuration {
  TwentyFive = 'twentyfive',
  Fifty = 'fifty'
}

const durationLookup = {
  [EDuration.TwentyFive]: 25 * 60,
  [EDuration.Fifty]: 50 * 60
}

const TimerSetupModal = () => {
  const { dispatch } = useContext(context)
  const [duration, setDuration] = useState<EDuration>(EDuration.TwentyFive)

  const startTimer = useCallback(() => {
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.StartTimer, body: { duration: durationLookup[duration] } })
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [duration, dispatch])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleAddToTodayChange = useCallback((event: React.MouseEvent<HTMLElement>, newValue: EDuration) => {
    if (newValue === null) return

    setDuration(newValue)
  }, [])

  return (
    <Modal title="Setup Timer" showModal={true}>
      <Box m="1rem 0 0 0" css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <InputLabel>Duration</InputLabel>
        <ToggleButtonGroup value={duration} exclusive onChange={handleAddToTodayChange}>
          <ToggleButton color="primary" value={EDuration.TwentyFive} >
            25 min
          </ToggleButton>
          <ToggleButton color="primary" value={EDuration.Fifty}>
            50 min
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ButtonWrapper>
        <Button
          key="cancel"
          fullWidth
          variant='contained'
          color='secondary'
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          type="button"
          variant='contained'
          key="start"
          onClick={startTimer}
        >
          Start
        </Button>
      </ButtonWrapper>
    </Modal>
  )
}

export default TimerSetupModal
