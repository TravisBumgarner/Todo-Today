import React from 'react'
import { Button, Typography } from '@mui/material'

import AddSuccessModal from './AddSuccessModal'
import SuccessesTable from './SuccessesTable'

const Successes = () => {
  const [showSuccessModal, setShowSuccessModal] = React.useState<boolean>(false)

  return (
    <div>
      <Typography variant="h3">Successes</Typography>
      <Button key="add" onClick={() => { setShowSuccessModal(true) }} >Add New Success</Button>
      <SuccessesTable />
      {
        showSuccessModal
          ? <AddSuccessModal showModal={showSuccessModal} setShowModal={setShowSuccessModal} />
          : null
      }

    </div>
  )
}

export default Successes
