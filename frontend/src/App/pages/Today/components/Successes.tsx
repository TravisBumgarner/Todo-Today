import React from 'react'
import { Button, Typography } from '@mui/material'

import { type TDateISODate } from 'sharedTypes'
import AddSuccessModal from './AddSuccessModal'
import SuccessesTable from './SuccessesTable'

interface SuccessesProps {
    selectedDate: TDateISODate
}

const Successes = ({ selectedDate }: SuccessesProps) => {
    const [showSuccessModal, setShowSuccessModal] = React.useState<boolean>(false)

    return (
        <div>
            <Typography variant="h3">Successes</Typography>
            <Button key="add" onClick={() => { setShowSuccessModal(true) }} >Add New Success</Button>
            <SuccessesTable selectedDate={selectedDate} />
            {
                showSuccessModal
                    ? <AddSuccessModal selectedDate={selectedDate} showModal={showSuccessModal} setShowModal={setShowSuccessModal} />
                    : null
            }

        </div>
    )
}

export default Successes
