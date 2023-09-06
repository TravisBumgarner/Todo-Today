import React, { type FC, useContext } from 'react'
import { type State, context } from 'Context'
import AddTaskModal from './AddTaskModal'
import EditTaskModal from './EditTaskModal'
import EditProjectModal from './EditProjectModal'
import ManageTasksModal from './ManageTasksModal'
import AddSuccessModal from './AddSuccessModal'
import EditSuccessModal from './EditSuccessModal'
import SettingsModal from './SettingsModal'

export enum ModalID {
  ADD_TASK = 'ADD_TASK',
  EDIT_TASK = 'EDIT_TASK',
  EDIT_PROJECT = 'EDIT_PROJECT',
  MANAGE_TASKS = 'MANAGE_TASKS',
  BACKUP_FAILURE_MODAL = 'BACKUP_FAILURE_MODAL',
  ADD_SUCCESS_MODAL = 'ADD_SUCCESS_MODAL',
  EDIT_SUCCESS_MODAL = 'EDIT_SUCCESS_MODAL',
  SETTINGS_MODAL = 'SETTINGS_MODAL'
}

export type ActiveModal =
  | { id: ModalID.ADD_TASK }
  | { id: ModalID.EDIT_TASK, taskId: string }
  | { id: ModalID.EDIT_PROJECT, projectId: string }
  | { id: ModalID.MANAGE_TASKS }
  | { id: ModalID.BACKUP_FAILURE_MODAL }
  | { id: ModalID.ADD_SUCCESS_MODAL }
  | { id: ModalID.EDIT_SUCCESS_MODAL, successId: string }
  | { id: ModalID.SETTINGS_MODAL }

const LazyLoadModal: FC = () => {
  // HEY!
  // state.activeModal.data is typed as any.
  // Be warned. Maybe figure out a better solution.

  const { state } = useContext(context)

  if (!state.activeModal?.id) return null

  switch (state.activeModal.id) {
    case ModalID.ADD_TASK:
      return <AddTaskModal />
    case ModalID.EDIT_TASK:
      return <EditTaskModal taskId={state.activeModal.taskId} />
    case ModalID.EDIT_PROJECT:
      return <EditProjectModal projectId={state.activeModal.projectId} />
    case ModalID.MANAGE_TASKS:
      return <ManageTasksModal />
    case ModalID.ADD_SUCCESS_MODAL:
      return <AddSuccessModal />
    case ModalID.EDIT_SUCCESS_MODAL:
      return <EditSuccessModal successId={state.activeModal.successId} />
    case ModalID.SETTINGS_MODAL:
      return <SettingsModal />
    default:
      return null
  }
}

export default LazyLoadModal
