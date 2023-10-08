import { useState, useEffect } from 'react'
import { Button, Typography, css } from '@mui/material'

import Modal from './Modal'
import { ButtonWrapper } from 'sharedComponents'
import { useLiveQuery } from 'dexie-react-hooks'
import database from 'database'
import { sendIPCMessage } from 'utilities'
import { ENotificationIPC } from 'shared/types'

const TimerModal = ({ taskId }: { taskId: string }) => {
  const task = useLiveQuery(async () => await database.tasks.where('id').equals(taskId).first()
  )

  const [minutes, setMinutes] = useState(0)
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
    setMinutes(0)
    setSeconds(0)
  }

  useEffect(() => {
    if (!isComplete) return

    void sendIPCMessage({ type: ENotificationIPC.Notification, body: { title: 'Timer done', body: 'Time for a break' } })
  }, [isComplete])

  return (
    <Modal
      title={`Timer for ${task?.title}`}
      showModal={true}
      disableEscapeKeyDown
      disableBackdropClick
    >
      {
        isBeingSetup
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
    </Modal >
  )
}

const timerCSS = css`
  font-size: 3rem;
  text-align: center;
`

export default TimerModal
