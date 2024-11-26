import { Box, Button, ButtonGroup, Typography, css } from '@mui/material'
import { useCallback, useContext } from 'react'
import { v4 as uuid4 } from 'uuid'

import { context } from 'Context'
import database from 'database'
import { ModalID } from 'modals'
import { ETaskStatus } from 'types'
import { emptyTodoListCSS } from './sharedCSS'

const EmptyTodoList = () => {
    const { state: { selectedDate, activeWorkspaceId }, dispatch } = useContext(context)

    const getPreviousDatesTasks = useCallback(async () => {
        const lastEntry = (await database.todoListItems.where('workspaceId').equals(activeWorkspaceId).sortBy('todoListDate')).filter(entry => entry.todoListDate < selectedDate).reverse()[0]

        if (lastEntry) {
            const previousDay = await database.todoListItems
                .where({
                    todoListDate: lastEntry.todoListDate,
                    workspaceId: activeWorkspaceId
                })
                .toArray()

            if (previousDay.length === 0) {
                dispatch({
                    type: 'SET_ACTIVE_MODAL',
                    payload: {
                        id: ModalID.CONFIRMATION_MODAL,
                        title: 'Something went Wrong',
                        body: 'There is nothing to copy from the previous day'
                    }
                })
            } else {
                void previousDay.map(async ({ taskId }) => {
                    const task = await database.tasks.where('id').equals(taskId).first()

                    if (
                        task?.status === ETaskStatus.NEW ||
                        task?.status === ETaskStatus.IN_PROGRESS ||
                        task?.status === ETaskStatus.BLOCKED
                    ) {
                        await database.todoListItems.add({
                            taskId,
                            id: uuid4(),
                            todoListDate: selectedDate,
                            workspaceId: activeWorkspaceId
                        })
                    }
                })
            }
        } else {
            dispatch({
                type: 'SET_ACTIVE_MODAL',
                payload: {
                    id: ModalID.CONFIRMATION_MODAL,
                    title: 'Something went Wrong',
                    body: 'There is nothing to copy from the previous day'
                }
            })
        }
    }, [selectedDate, dispatch, activeWorkspaceId])

    const showManagementModal = useCallback(() => {
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.SELECT_TASKS_MODAL } })
    }, [dispatch])

    const showAddNewTaskModal = useCallback(() => {
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK_MODAL } })
    }, [dispatch])

    return (
        <Box css={emptyTodoListCSS}>
            <Box>
                <Typography css={typographyCSS} variant='h2'>What will you do today?</Typography>
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

const typographyCSS = css`margin-bottom: 1rem`

export default EmptyTodoList
