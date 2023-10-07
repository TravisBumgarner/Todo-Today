import { useCallback, useState, useContext, useEffect } from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
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
    setMinutes(25)
    setSeconds(0)
  }

  return (
    <Modal
      title="Timer"
      showModal={true}
    >
      <p>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
      {isRunning
        ? (<button onClick={pauseTimer}>Pause</button>)
        : (<button onClick={startTimer}>Start</button>)}
      <button onClick={resetTimer}>Reset</button>
      <form>
        <ButtonWrapper>
          <Button color="secondary" variant='contained' fullWidth key="cancel" onClick={handleCancel}>Cancel</Button>
          <Button variant='contained' fullWidth disabled={!isComplete} key="save" onClick={handleSubmit}>Done</Button>
        </ButtonWrapper>
      </form>
    </Modal>
  )
}

export default TimerModal
