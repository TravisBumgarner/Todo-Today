import { useState, useEffect, type ChangeEvent, useCallback, useContext } from 'react'
import { Button, TextField, Typography, css } from '@mui/material'

import Modal from './Modal'
import { ButtonWrapper, Divider } from 'sharedComponents'
import { useLiveQuery } from 'dexie-react-hooks'
import database from 'database'
import { sendAsyncIPCMessage, sendSyncIPCMessage } from 'utilities'
import { EAsyncMessageIPCFromRenderer, ESyncMessageIPCFromRenderer } from 'shared/types'
import { ETaskStatus, type TTask } from 'types'
import { context } from 'Context'

const TimerModal = ({ taskId }: { taskId: string }) => {
  const { dispatch } = useContext(context)

  const [details, setDetails] = useState('') // Undo doesn't work if synced directly to DB. Might be a more elegant solution, but for now, this works.
  const [task, setTask] = useState<TTask | null>(null)
  useLiveQuery(
    async () => {
      const task = await database.tasks.where('id').equals(taskId).first()
      if (!task) {
        setTask({
          title: 'Unable to find task',
          status: ETaskStatus.CANCELED,
          id: '',
          projectId: '',
          details: ''
        })
        return
      }

      setTask(task)
      setDetails(task.details ?? '')
    })

  const handleDetailsChange = useCallback(async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!task) return

    void database.tasks.where('id').equals(task.id).modify({ details: event.target.value })
    setDetails(event.target.value)
  }, [task])

  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(5)

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
    setMinutes(10)
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
                <Button variant='contained' onClick={() => { setMinutes(0); setIsBeingSetup(false) }}>25 minutes</Button>
                <Button variant='contained' onClick={() => { setMinutes(50); setIsBeingSetup(false) }}>50 minutes</Button>
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
              <Divider />
              <TextField
                multiline
                fullWidth
                label="Task Details"
                name="details"
                value={details}
                margin='normal'
                onChange={handleDetailsChange}
              />
              <ButtonWrapper>
                <Button fullWidth variant='contained' color="secondary" onClick={closeTimer}>Done</Button>
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
