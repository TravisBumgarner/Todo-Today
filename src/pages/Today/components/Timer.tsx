import { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'

import { sendAsyncIPCMessage } from 'utilities'
import { EAsyncMessageIPCFromRenderer } from 'shared/async-message-types'
import { context } from 'Context'
import { ModalID } from 'modals'

enum ETimerStatus {
  Setup = 'setup',
  Running = 'running',
  Paused = 'paused',
}

const Timer = () => {
  const { dispatch, state: { timerDuration } } = useContext(context)
  const [status, setStatus] = useState(ETimerStatus.Setup)

  useEffect(() => {
    if (status === ETimerStatus.Setup && timerDuration > 0) {
      setStatus(ETimerStatus.Running)
    }

    if (status === ETimerStatus.Running && timerDuration === 0) {
      setStatus(ETimerStatus.Setup)
    }
  }, [timerDuration, status])

  const handlePause = useCallback(async () => {
    setStatus(ETimerStatus.Paused)
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.PauseTimer, body: null })
  }, [])

  const handleReset = useCallback(async () => {
    setStatus(ETimerStatus.Setup)
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.ResetTimer, body: null })
  }, [])

  const handleResume = useCallback(async () => {
    setStatus(ETimerStatus.Running)
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.ResumeTimer, body: null })
  }, [])

  const showTimerSetupModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.TIMER_SETUP_MODAL } })
  }, [dispatch])

  if (status === ETimerStatus.Setup) {
    return (<Button
      variant='contained'
      onClick={showTimerSetupModal}
    >
      Add a Timer
    </Button>)
  }

  if (status === ETimerStatus.Running) {
    return <Box><Typography>{timerDuration}</Typography><Button onClick={handlePause}>Pause</Button></Box>
  }

  if (status === ETimerStatus.Paused) {
    return (
      <Box>
        <Typography>{timerDuration}</Typography>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleResume}>Resume</Button>
      </Box>
    )
  }
}

export default Timer
