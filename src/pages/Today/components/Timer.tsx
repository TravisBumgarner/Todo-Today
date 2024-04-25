import { useState, useEffect, useCallback } from 'react'
import { Box, Button, InputAdornment, TextField, Typography, css } from '@mui/material'

import { sendAsyncIPCMessage } from 'utilities'
import { EAsyncMessageIPCFromRenderer } from 'shared/types'

const CUSTOM_TIMER_DEFAULT = 5

enum Status {
  Setup = 'Setup',
  Running = 'Running',
  Paused = 'Paused',
  Complete = 'Complete',
}

enum CountdownType {
  Work = 'Work',
  Break = 'Break',
}

const Timer = () => {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(CUSTOM_TIMER_DEFAULT)

  const [status, setStatus] = useState<Status>(Status.Setup)
  const [countdownType, setCountdownType] = useState<CountdownType>(CountdownType.Work)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (status === Status.Running) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setStatus(Status.Setup)
            setCountdownType(countdownType === CountdownType.Work ? CountdownType.Break : CountdownType.Work)
            sendAsyncIPCMessage({
              type: EAsyncMessageIPCFromRenderer.CreateNotification,
              body: {
                title: 'Timer done',
                body: countdownType === CountdownType.Work ? 'Time for a break' : 'Time to get back to work'
              }
            })
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
  }, [status, minutes, seconds, countdownType])

  const pauseTimer = () => {
    setStatus(Status.Paused)
  }

  const resumeTimer = () => {
    setStatus(Status.Running)
  }

  const resetTimer = () => {
    setStatus(Status.Setup)
    setMinutes(0)
    setSeconds(CUSTOM_TIMER_DEFAULT)
  }

  const handleMinutesChange = (e: any) => {
    const value = parseInt(e.target.value)
    setMinutes(value)
  }

  const startTimer = useCallback((countdownType: CountdownType, duration?: number) => {
    if (duration) {
      // If not duration, use duration set by input
      setSeconds(duration)
    } else {
      setSeconds(CUSTOM_TIMER_DEFAULT)
    }
    setCountdownType(countdownType)
    setStatus(Status.Running)
  }, [])

  // This feels a bit repetitive.
  const startBreakInputTimer = useCallback(() => { startTimer(CountdownType.Break) }, [startTimer])
  const startBreak5Timer = useCallback(() => { startTimer(CountdownType.Break, 5) }, [startTimer])
  const startBreak10Timer = useCallback(() => { startTimer(CountdownType.Break, 10) }, [startTimer])

  const startWorkInputTimer = useCallback(() => { startTimer(CountdownType.Work) }, [startTimer])
  const startWork25Timer = useCallback(() => { startTimer(CountdownType.Work, 25) }, [startTimer])
  const startWork50Timer = useCallback(() => { startTimer(CountdownType.Work, 50) }, [startTimer])

  console.log(status, countdownType)

  if (status === Status.Setup && countdownType === CountdownType.Work) {
    return (
      <Box css={componentWrapperCSS}>
        <Typography variant='h1'>Focus Time</Typography>
        <Box css={wrapperCSS}>
          <Box css={setupWrapperCSS}>
            <Button variant='contained' onClick={startWork25Timer}>25 minutes</Button>
            <Button variant='contained' onClick={startWork50Timer}>50 minutes</Button>
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
            <Button variant='contained' onClick={startWorkInputTimer}> Submit</Button>
          </Box>
        </Box>
      </Box>
    )
  }

  if (status === Status.Setup && countdownType === CountdownType.Break) {
    return (
      <Box css={componentWrapperCSS}>
        <Typography variant='h1'>Break Time</Typography>
        <Box css={wrapperCSS}>
          <Box css={setupWrapperCSS}>
            <Button variant='contained' onClick={startBreak5Timer}>5 minutes</Button>
            <Button variant='contained' onClick={startBreak10Timer}>10 minutes</Button>
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
            <Button variant='contained' onClick={startBreakInputTimer}> Submit</Button>
          </Box>
        </Box>
      </Box>
    )
  }

  if (status === Status.Running) {
    return (
      <Box css={componentWrapperCSS}>
        <Typography variant='h1'>{countdownType === CountdownType.Break ? 'Break Time' : 'Focus Time'}</Typography>
        <Box css={wrapperCSS}>
          <Box css={progressWrapper}>
            <Button color="error" onClick={resetTimer}>New Timer</Button>
            <Typography css={timerCSS} variant='body1'>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Typography>
            <Button css={css`width:75px`} variant='contained' onClick={pauseTimer}>Pause</Button>
          </Box>
        </Box>
      </Box>
    )
  }

  if (status === Status.Paused) {
    return (
      <Box css={componentWrapperCSS}>
        <Box css={wrapperCSS}>
          <Box css={progressWrapper}>
            <Button color="error" onClick={resetTimer}>New Timer</Button>
            <Typography css={timerCSS} variant='body1'>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Typography>
            <Button css={css`width:75px`} variant='contained' onClick={resumeTimer}>Resume</Button>
          </Box>
        </Box>
      </Box>
    )
  }
}

const setupWrapperCSS = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  > * {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`

const progressWrapper = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  
  > * {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`

const componentWrapperCSS = css`
  height: 100px;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const wrapperCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;

  & > * {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`

const timerCSS = css`
  font-size: 3rem;
  text-align: center;
  width: 200px;
`

export default Timer
