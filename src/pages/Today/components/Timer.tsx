import { Box, Button, IconButton, Tooltip, Typography, css } from '@mui/material'
import { useCallback, useContext, useEffect, useState } from 'react'

import { Close, Pause, PlayArrow } from '@mui/icons-material'
import { context } from 'Context'
import { ModalID } from 'modals'
import { EAsyncMessageIPCFromRenderer } from 'shared/async-message-types'
import { sendAsyncIPCMessage } from 'utilities'

const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

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
    return (
      <Box>
        <Button
          variant='contained'
          onClick={showTimerSetupModal}
        >
          Add Timer
        </Button>
      </Box>
    )
  }

  return (
    <Box css={wrapperCSS}>
      <IconButton color="primary" onClick={handleReset}>
        <Tooltip title="Cancel Timer">
          <Close />
        </Tooltip>
      </IconButton>
      <Typography css={typographyCSS}>{formatDuration(timerDuration)}</Typography>
      <IconButton color="primary" onClick={status === ETimerStatus.Paused ? handleResume : handlePause} >
        <Tooltip title={status === ETimerStatus.Paused ? 'Resume Timer' : 'Pause Timer'} >
          {status === ETimerStatus.Paused ? <PlayArrow /> : <Pause />}
        </Tooltip>
      </IconButton>
    </Box>
  )
}

const typographyCSS = css`
  width: 50px;
  text-align: center;
  position: relative;
  top: 1px;
`

const wrapperCSS = css`
  width: 130px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default Timer
