import { useState, useEffect, useCallback, useContext } from 'react'
import { Box, Button, TextField, Typography, css } from '@mui/material'

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

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
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

  const closeTimer = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  useEffect(() => {
    if (!isComplete) return

    sendAsyncIPCMessage({ type: EAsyncMessageIPCFromRenderer.CreateNotification, body: { title: 'Timer done', body: 'Time for a break' } })
  }, [isComplete])

  return (
    <Box css={wrapperCSS}>
      {
        isBeingSetup
          ? (
            <>
              <Typography variant='body1'>How long do you want to work?</Typography>
              <ButtonWrapper isHorizontal>
                <Button fullWidth variant='contained' onClick={() => { setMinutes(25); setIsBeingSetup(false) }}>25 minutes</Button>
                <Button fullWidth variant='contained' onClick={() => { setMinutes(50); setIsBeingSetup(false) }}>50 minutes</Button>
              </ButtonWrapper>
              <Divider text="Or" />
              <TextField
                label="Set a Custom Timer"
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                fullWidth
              />
              <ButtonWrapper>
                <Button fullWidth variant='contained' onClick={() => { setIsBeingSetup(false) }}> Submit</Button>
              </ButtonWrapper>
            </>)
          : (
            <>
              <Typography css={timerCSS} variant='body1'>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </Typography>
              <ButtonWrapper isHorizontal>
                <Button fullWidth variant='contained' color="error" onClick={resetTimer}>Reset</Button>
                {
                  isRunning
                    ? (<Button fullWidth variant='contained' onClick={pauseTimer}>Pause</Button>)
                    : (<Button fullWidth variant='contained' onClick={startTimer}>Start</Button>)
                }
              </ButtonWrapper>
              <ButtonWrapper>
                <Button fullWidth variant='contained' color="secondary" onClick={closeTimer}>Done</Button>
              </ButtonWrapper>
            </>)
      }

    </Box >
  )
}

const wrapperCSS = css`
  border: var(--mui-palette-primary-main) solid 3px;
  border-radius: 1rem;
  padding: 1rem;
`

const timerCSS = css`
  font-size: 3rem;
  text-align: center;
`

export default Timer
