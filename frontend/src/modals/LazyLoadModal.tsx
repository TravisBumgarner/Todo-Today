import React, { type FC, useContext } from 'react'
import { context } from 'Context'
import AddTaskModal from './AddTaskModal'
import AddProjectModal from './AddProjectModal'
import EditTaskModal from './EditTaskModal'
import EditProjectModal from './EditProjectModal'
import ManageTasksModal from './ManageTasksModal'
import AddSuccessModal from './AddSuccessModal'
import EditSuccessModal from './EditSuccessModal'

export enum ModalID {
  ADD_TASK = 'ADD_TASK',
  EDIT_TASK = 'EDIT_TASK',
  ADD_PROJECT = 'ADD_PROJECT',
  EDIT_PROJECT = 'EDIT_PROJECT',
  MANAGE_TASKS = 'MANAGE_TASKS',
  BACKUP_FAILURE_MODAL = 'BACKUP_FAILURE_MODAL',
  ADD_SUCCESS_MODAL = 'ADD_SUCCESS_MODAL',
  EDIT_SUCCESS_MODAL = 'EDIT_SUCCESS_MODAL',
}

const LazyLoadModal: FC = () => {
  const { state } = useContext(context)

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
    case ModalID.ADD_SUCCESS_MODAL:
      return <AddSuccessModal />
    case ModalID.EDIT_SUCCESS_MODAL:
      return <EditSuccessModal />
    default:
      return null
  }
}

export default LazyLoadModal
