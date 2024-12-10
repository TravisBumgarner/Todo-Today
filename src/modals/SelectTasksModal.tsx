import CheckIcon from '@mui/icons-material/Check'
import { Box, Button, IconButton, Typography, css } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useMemo } from 'react'
import { v4 as uuid4 } from 'uuid'

import { useSignals } from '@preact/signals-react/runtime'
import database from 'database'
import { EmptyStateDisplay } from 'sharedComponents'
import { ETaskStatus, type TTask } from 'types'
import { getNextSortOrderValue, sortStrings } from 'utilities'
import { activeModalSignal, selectedDateSignal } from '../signals'
import Modal, { MODAL_MAX_HEIGHT } from './Modal'
import { ModalID } from './RenderModal'

interface TaskProps {
  task: TTask
  isSelected: boolean
}

const Task = ({ task, isSelected }: TaskProps) => {
  useSignals()
  const handleSelect = async () => {
    const nextSortOrder = await getNextSortOrderValue(selectedDateSignal.value)

    await database.todoListItems.add({
      taskId: task.id,
      id: uuid4(),
      todoListDate: selectedDateSignal.value,
      sortOrder: nextSortOrder
    })
  }

  const handleDeselect = async () => {
    await database.todoListItems
      .where('taskId').equals(task.id)
      .and(item => item.todoListDate === selectedDateSignal.value)
      .delete()
  }

  return (
    <Box css={tasksHeaderCSS}>
      <Typography variant="body1">{task.title}</Typography>
      <Box css={rightHeaderCSS}>
        <IconButton color={isSelected ? 'secondary' : 'default'} onClick={isSelected ? handleDeselect : handleSelect}>
          <CheckIcon fontSize="small" />
        </IconButton>

      </Box>
    </Box >
  )
}

const rightHeaderCSS = css`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const tasksHeaderCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ManageTodoListItemsModal = () => {
  useSignals()

  const tasks = useLiveQuery(async () => await database.tasks.where('status').anyOf(ETaskStatus.BLOCKED, ETaskStatus.NEW, ETaskStatus.IN_PROGRESS).toArray())

  const todoListItems = useLiveQuery(async () => await database.todoListItems.where({ todoListDate: selectedDateSignal.value }).toArray())
  const selectedTaskIds = todoListItems?.map(({ taskId }) => taskId)

  const showAddNewTaskModal = useCallback(() => {
    activeModalSignal.value = { id: ModalID.ADD_TASK_MODAL }
  }, [])

  const handleClose = useCallback(() => {
    activeModalSignal.value = null
  }, [])

  const content = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return <EmptyStateDisplay message="There are no Tasks to Work On" callToActionButton={<Button
        onClick={showAddNewTaskModal}
        fullWidth
        variant='contained'
      >
        Add New Task
      </Button>} />
    }

    return (
      <Box css={wrapperCSS}>
        <Box css={scrollWrapperCSS}>
          {
            tasks
              .sort((a, b) => sortStrings(a.title, b.title))
              .map(task => (
                <Task
                  key={task.id}
                  task={task}
                  isSelected={selectedTaskIds?.includes(task.id) ?? false}
                />
              ))
          }
          <Button
            fullWidth
            type="button"
            variant='contained'
            key="save"

            onClick={handleClose}
          >
            Done
          </Button>
        </Box>
      </Box>
    )
  }, [selectedTaskIds, tasks, showAddNewTaskModal, handleClose])

  return (
    <Modal
      title='Select Tasks'
      showModal={true}
    >
      {content}
    </Modal>
  )
}

const scrollWrapperCSS = css`
  overflow: auto;
  max-height: ${MODAL_MAX_HEIGHT - 200}px;
`

const wrapperCSS = css`
  height: 100%;
`

export default ManageTodoListItemsModal
