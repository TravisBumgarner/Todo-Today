import { Box, Button, ButtonGroup, css, Typography } from '@mui/material'
import { useCallback } from 'react'

import { useSignals } from '@preact/signals-react/runtime'
import { queries } from 'database'
import { ModalID } from 'modals'
import { activeModalSignal, messageSignal, selectedDateSignal } from '../signals'

const EmptyTodoList = () => {
    useSignals()
    const getPreviousDatesTasks = useCallback(async () => {
        const previousDayActiveTasks = await queries.getPreviousDayActiveTasks(selectedDateSignal.value)
        if (!previousDayActiveTasks || previousDayActiveTasks.length === 0) {
            messageSignal.value = {
                severity: 'error',
                text: 'No tasks to copy from previous day'
            }
            return
        }

        await queries.getAndCreateIfNotExistsTodoList(selectedDateSignal.value)
        await queries.addTodoList(selectedDateSignal.value, previousDayActiveTasks)
    }, [])

    const showManagementModal = useCallback(() => {
        activeModalSignal.value = { id: ModalID.SELECT_TASKS_MODAL }
    }, [])

    const showAddNewTaskModal = useCallback(() => {
        activeModalSignal.value = { id: ModalID.ADD_TASK_MODAL }
    }, [])

    return (
        <Box css={emptyTodoListCSS}>
            <Box>
                <Typography css={{ marginBottom: '1rem' }} variant='h2'>What will you do today?</Typography>
                <ButtonGroup>
                    <Button
                        variant='contained'
                        onClick={getPreviousDatesTasks}
                    >
                        Copy Previous Day
                    </Button>
                    <Button
                        variant='contained'
                        onClick={showManagementModal}
                    >
                        Select Tasks
                    </Button>
                    <Button
                        variant='contained'
                        onClick={showAddNewTaskModal}
                    >
                        Add New Task
                    </Button>
                </ButtonGroup>
            </Box>
        </Box>
    )
}

const emptyTodoListCSS = css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > div {
      height: 80px;
      text-align: center;
    }
`

export default EmptyTodoList
