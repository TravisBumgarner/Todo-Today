import { useCallback, useContext } from 'react'
import { Box, Button, Typography } from '@mui/material'

import { sendAsyncIPCMessage } from 'utilities'
import { EAsyncMessageIPCFromRenderer } from 'shared/async-message-types'
import { context } from 'Context'

const Timer = () => {
  const { state: { timerDuration } } = useContext(context)

  const handleStart = useCallback(async () => {
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.StartTimer, body: { duration: 60 } })
  }, [])

  const handleStop = useCallback(async () => {
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.StopTimer, body: null })
  }, [])

  const handlePause = useCallback(async () => {
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.PauseTimer, body: null })
  }, [])

  const handleReset = useCallback(async () => {
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.ResetTimer, body: null })
  }, [])

  const handleResume = useCallback(async () => {
    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.ResumeTimer, body: null })
  }, [])

  return (
    < Box >
      <Typography>{timerDuration}</Typography>
      <Button onClick={handleStart}>Start</Button>
      <Button onClick={handleStop}>Stop</Button>
      <Button onClick={handlePause}>Pause</Button>
      <Button onClick={handleReset}>Reset</Button>
      <Button onClick={handleResume}>Resume</Button>
    </Box >

  )
}

export default Timer
