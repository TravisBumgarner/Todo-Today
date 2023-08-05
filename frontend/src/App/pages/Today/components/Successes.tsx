import React, { useCallback, useContext } from 'react'
import { Button, Typography } from '@mui/material'

import SuccessesTable from './SuccessesTable'
import { ModalID } from 'modals'
import { context } from 'Context'

const Successes = () => {
  const { dispatch } = useContext(context)

  const handleSuccess = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_SUCCESS_MODAL } })
  }, [dispatch])

  return (
    <div>
      <Typography variant="h3">Successes</Typography>
      <Button key="add" onClick={handleSuccess} >Add Success</Button>
      <SuccessesTable />
    </div>
  )
}

export default Successes
