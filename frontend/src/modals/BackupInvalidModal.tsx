import React from 'Context'
import { ConfirmationModal } from 'sharedComponents'

const BackupFailureModal = () => {
  return (
    <ConfirmationModal
    body="That backup is invalid."
    title="Heads Up!"
    />
  )
}

export default BackupFailureModal
