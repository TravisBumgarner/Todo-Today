import React from 'Context'
import { ConfirmationModal } from 'sharedComponents'

const AutomatedBackupFailureModal = () => {
  return (
    <ConfirmationModal
      body="The automated backup failed to run."
      title="Heads Up!"
    />
  )
}

export default AutomatedBackupFailureModal
