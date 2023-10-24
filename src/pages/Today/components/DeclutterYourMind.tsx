import { Box, Button } from '@mui/material'
import { context } from 'Context'
import { ModalID } from 'modals'
import { useCallback, useContext } from 'react'

const DeclutterYourMind = () => {
  const { dispatch } = useContext(context)

  const showAddNewTaskModal = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_TASK_MODAL } })
  }, [dispatch])

  return (
    <Box>
      <Button
        variant='contained'
        onClick={showAddNewTaskModal}
      >
        Add New Task
      </Button>
    </Box>

  )
}

export default DeclutterYourMind
