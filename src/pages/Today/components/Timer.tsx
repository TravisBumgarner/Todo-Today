import { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, IconButton, Tooltip, Typography, css } from '@mui/material'

import { sendAsyncIPCMessage } from 'utilities'
import { EAsyncMessageIPCFromRenderer } from 'shared/async-message-types'
import { context } from 'Context'
import { ModalID } from 'modals'
import { Close, Pause, PlayArrow } from '@mui/icons-material'

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
      <Box css={wrapperCSS}>
        <Button
          variant='contained'
          onClick={showTimerSetupModal}
        >
          Add Timer
        </Button>
      </Box>
    )
  }

  if (status === ETimerStatus.Running) {
    return (
      <Box css={wrapperCSS}>
        <Typography css={typographyCSS}>{formatDuration(timerDuration)}</Typography>
        <IconButton color="primary" onClick={handlePause} >
          <Tooltip title="Pause Timer">
            <Pause />
          </Tooltip>
        </IconButton>
      </Box>
    )
  }

  if (status === ETimerStatus.Paused) {
    return (
      <Box css={wrapperCSS}>
        <Typography css={typographyCSS}>{formatDuration(timerDuration)}</Typography>
        <IconButton color="primary" onClick={handleResume} >
          <Tooltip title="Resume Timer">
            <PlayArrow />
          </Tooltip>
        </IconButton>
        <IconButton color="primary" onClick={handleReset}>
          <Tooltip title="Cancel Timer">
            <Close />
          </Tooltip>
        </IconButton>
      </Box>
    )
  }
}

const typographyCSS = css`
  width: 50px;
`

const wrapperCSS = css`
  width: 130px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
`

export default Timer
