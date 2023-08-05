import * as React from 'react'
import { context } from 'Context'
import AddTaskModal from './AddTaskModal'
import AddProjectModal from './AddProjectModal'
import EditTaskModal from './EditTaskModal'
import EditProjectModal from './EditProjectModal'
import ManageTasksModal from './ManageTasksModal'
import BackupFailureModal from './BackupFailureModal'

export enum ModalID {
  ADD_TASK = 'ADD_TASK',
  EDIT_TASK = 'EDIT_TASK',
  ADD_PROJECT = 'ADD_PROJECT',
  EDIT_PROJECT = 'EDIT_PROJECT',
  MANAGE_TASKS = 'MANAGE_TASKS',
  BACKUP_FAILURE_MODAL = 'BACKUP_FAILURE_MODAL',
  // CONFIRMATION = 'CONFIRMATION',
  // NOTHING_TO_COPY = 'NOTHING_TO_COPY',
  // NOTHING_TO_DELETE = 'NOTHING_TO_DELETE'

}

const LazyLoadModal: React.FC = () => {
  const { state } = React.useContext(context)

  if (!state.activeModal?.id) return null
  console.log('new modal', state.activeModal)
  switch (state.activeModal.id) {
    case ModalID.ADD_TASK:
      return <AddTaskModal />
    case ModalID.EDIT_TASK:
      return <EditTaskModal />
    case ModalID.ADD_PROJECT:
      return <AddProjectModal />
    case ModalID.EDIT_PROJECT:
      return <EditProjectModal />
    case ModalID.MANAGE_TASKS:
      return <ManageTasksModal />
    case ModalID.BACKUP_FAILURE_MODAL:
      return <BackupFailureModal />
    default:
      return null
  }
}

export default LazyLoadModal