import { useState, useCallback } from 'react'
import { Box, Button } from '@mui/material'

import { sendSyncIPCMessage } from 'utilities'
import { ESyncMessageIPCFromRenderer } from 'shared/types'

const Timer = () => {
  const [duration] = useState<number>(60)

  const handleStart = useCallback(async () => {
    await sendSyncIPCMessage({ type: ESyncMessageIPCFromRenderer.StartTimer, body: { duration } })
  }, [duration])

  const handleStop = useCallback(async () => {
    await sendSyncIPCMessage({ type: ESyncMessageIPCFromRenderer.StopTimer, body: null })
  }, [])

  return (
    < Box >
      <Button onClick={handleStart}>Start</Button>
      <Button onClick={handleStop}>Stop</Button>
    </Box >

  )
}

export default Timer
