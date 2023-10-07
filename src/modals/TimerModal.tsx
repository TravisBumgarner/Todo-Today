import { useCallback, useState, useContext, useEffect, useMemo } from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, css } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'

import Modal from './Modal'
import { type TProject } from 'types'
import database from 'database'
import { context } from 'Context'
import { ButtonWrapper } from 'sharedComponents'
import { sortStrings } from 'utilities'

const TimerModal = ({ taskId }: { taskId: string }) => {
  const { state, dispatch } = useContext(context)
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)

  const [isBeingSetup, setIsBeingSetup] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = useCallback(async () => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isRunning && (minutes > 0 || seconds > 0)) {
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer)
            setIsComplete(true)
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
    setMinutes(0)
    setSeconds(0)
  }

  return (
    <Modal
      title="Timer"
      showModal={true}
      disableEscapeKeyDown
      disableBackdropClick
    >
      {isBeingSetup
        ? (
          <>
            <Typography variant='body1'>How long do you want to work?</Typography>
            <ButtonWrapper isHorizontal>
              <Button variant='contained' onClick={() => { setMinutes(25); setIsBeingSetup(false) }}>25 minutes</Button>
              <Button variant='contained' onClick={() => { setMinutes(50); setIsBeingSetup(false) }}>50 minutes</Button>
              <Button variant='contained' onClick={() => { setMinutes(90); setIsBeingSetup(false) }}>90 minutes</Button>
            </ButtonWrapper>
          </>)
        : (
          <>
            <Typography css={timerCSS} variant='body1'>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Typography>
            <ButtonWrapper>
              <Button fullWidth variant='contained' color="secondary" onClick={resetTimer}>Reset</Button>
              {
                isRunning
                  ? (<Button fullWidth variant='contained' onClick={pauseTimer}>Pause</Button>)
                  : (<Button fullWidth variant='contained' onClick={startTimer}>Start</Button>)
              }
            </ButtonWrapper>
          </>)
      }
    </Modal>
  )
}

const timerCSS = css`
  font-size: 3rem;
  text-align: center;

`

export default TimerModal
