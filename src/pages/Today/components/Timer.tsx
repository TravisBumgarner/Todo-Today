import { useState, useEffect, useCallback, useContext } from 'react'
import { Box, Button, InputAdornment, TextField, Typography, css } from '@mui/material'

import { ButtonWrapper, Divider } from 'sharedComponents'
import { sendAsyncIPCMessage } from 'utilities'
import { EAsyncMessageIPCFromRenderer } from 'shared/types'
import { context } from 'Context'

const CUSTOM_TIMER_DEFAULT = 10

const Timer = () => {
  const { dispatch } = useContext(context)

  const [minutes, setMinutes] = useState(CUSTOM_TIMER_DEFAULT)
  const [seconds, setSeconds] = useState(0)

  const [isBeingSetup, setIsBeingSetup] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isRunning) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsComplete(true)
            clearInterval(timer)
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    }

    return () => {
      clearInterval(timer)
    }
  }, [isRunning, minutes, seconds])

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resumeTimer = () => {
    setIsRunning(true)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBeingSetup(true)
    setIsComplete(false)
    setMinutes(CUSTOM_TIMER_DEFAULT)
    setSeconds(0)
  }

  const handleMinutesChange = (e: any) => {
    const value = parseInt(e.target.value)
    setMinutes(value)
  }

  const startTimer = useCallback((duration?: number) => {
    if (duration) {
      // If not duration, use duration set by input
      setMinutes(duration)
    }
    setIsBeingSetup(false)
    setIsRunning(true)
  }, [])

  const startInputTimer = useCallback(() => { startTimer() }, [startTimer])
  const start25Timer = useCallback(() => { startTimer(25) }, [startTimer])
  const start50Timer = useCallback(() => { startTimer(50) }, [startTimer])

  useEffect(() => {
    if (!isComplete) return

    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.CreateNotification, body: { title: 'Timer done', body: 'Time for a break' } })
  }, [isComplete])

  return (
    <Box css={wrapperCSS}>
      {
        isBeingSetup
          ? (<>
            <Typography variant='body1'>Set a focus timer</Typography>
            <Box css={setupWrapperCSS}>
              <Button variant='contained' onClick={start25Timer}>25 minutes</Button>
              <Button variant='contained' onClick={start50Timer}>50 minutes</Button>
              <Typography variant='body1'>Or</Typography>
              <TextField
                placeholder="Set a Custom Timer"
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                size="small"
                css={css`width: 120px;`}
                InputProps={{
                  endAdornment: <InputAdornment position="end">min</InputAdornment>
                }}
              />
              <Button variant='contained' onClick={startInputTimer}> Submit</Button>
            </Box>
          </>)
          : (
            <Box css={progressWrapper}>
              <Button color="error" onClick={resetTimer}>New Timer</Button>
              <Typography css={timerCSS} variant='body1'>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </Typography>
              <Button css={css`width:75px`} variant='contained' onClick={isRunning ? pauseTimer : resumeTimer}>{isRunning ? 'Pause' : 'Start'}</Button>
            </Box>)
      }

    </Box >
  )
}

const setupWrapperCSS = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  > * {
    margin-right: 0.5rem;
  }
`

const progressWrapper = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  
  > * {
    margin-right: 0.5rem;
  }
`

const wrapperCSS = css`
  border-radius: 1rem;
  padding: 1rem 0;
  height: 100px;
`

const timerCSS = css`
  font-size: 3rem;
  text-align: center;
  width: 200px;
`

export default Timer
