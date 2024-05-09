import { useCallback, useContext } from 'react'
import { Box, Button, Typography } from '@mui/material'

import { sendAsyncIPCMessage } from 'utilities'
import { EAsyncMessageIPCFromRenderer } from 'shared/async-message-types'
import { context } from 'Context'

const Timer = () => {
  const { state: { timerDuration } } = useContext(context)

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
      <Button onClick={handleStop}>Stop</Button>
      <Button onClick={handlePause}>Pause</Button>
      <Button onClick={handleReset}>Reset</Button>
      <Button onClick={handleResume}>Resume</Button>
    </Box >

  )
}

export default Timer
