import { type FC, useContext } from 'react'
import { context } from 'Context'
import AddTaskModal from './AddTaskModal'
import EditTaskModal from './EditTaskModal'
import EditProjectModal from './EditProjectModal'
import SelectTasksModal from './SelectTasksModal'
import AddSuccessModal from './AddSuccessModal'
import EditSuccessModal from './EditSuccessModal'
import SettingsModal from './Settings'
import ConfirmationModal, { type ConfirmationModalProps } from './ConfirmationModal'
import TimerSetupModal from './TimerSetupModal'

export enum ModalID {
  ADD_TASK_MODAL = 'ADD_TASK_MODAL',
  EDIT_TASK_MODAL = 'EDIT_TASK_MODAL',
  EDIT_PROJECT_MODAL = 'EDIT_PROJECT_MODAL',
  SELECT_TASKS_MODAL = 'SELECT_TASKS_MODAL',
  BACKUP_FAILURE_MODAL = 'BACKUP_FAILURE_MODAL',
  ADD_SUCCESS_MODAL = 'ADD_SUCCESS_MODAL',
  EDIT_SUCCESS_MODAL = 'EDIT_SUCCESS_MODAL',
  SETTINGS_MODAL = 'SETTINGS_MODAL',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
  TIMER_SETUP_MODAL = 'TIMER_SETUP_MODAL',
}

export type ActiveModal =
  | { id: ModalID.ADD_TASK_MODAL }
  | { id: ModalID.EDIT_TASK_MODAL, taskId: string }
  | { id: ModalID.EDIT_PROJECT_MODAL, projectId: string }
  | { id: ModalID.SELECT_TASKS_MODAL }
  | { id: ModalID.BACKUP_FAILURE_MODAL }
  | { id: ModalID.ADD_SUCCESS_MODAL }
  | { id: ModalID.EDIT_SUCCESS_MODAL, successId: string }
  | { id: ModalID.SETTINGS_MODAL }
  | { id: ModalID.CONFIRMATION_MODAL } & ConfirmationModalProps
  | { id: ModalID.TIMER_SETUP_MODAL }

const RenderModal: FC = () => {
  const { state } = useContext(context)

  if (!state.activeModal?.id) return null

  switch (state.activeModal.id) {
    case ModalID.ADD_TASK_MODAL:
      return <AddTaskModal />
    case ModalID.EDIT_TASK_MODAL:
      return <EditTaskModal taskId={state.activeModal.taskId} />
    case ModalID.EDIT_PROJECT_MODAL:
      return <EditProjectModal projectId={state.activeModal.projectId} />
    case ModalID.SELECT_TASKS_MODAL:
      return <SelectTasksModal />
    case ModalID.ADD_SUCCESS_MODAL:
      return <AddSuccessModal />
    case ModalID.EDIT_SUCCESS_MODAL:
      return <EditSuccessModal successId={state.activeModal.successId} />
    case ModalID.SETTINGS_MODAL:
      return <SettingsModal />
    case ModalID.CONFIRMATION_MODAL:
      return < ConfirmationModal
        id={state.activeModal.id}
        title={state.activeModal.title}
        body={state.activeModal.body}
        cancelCallback={state.activeModal.cancelCallback}
        confirmationCallback={state.activeModal.confirmationCallback}
      />
    case ModalID.TIMER_SETUP_MODAL:
      return <TimerSetupModal />
    default:
      return null
  }
}

export default RenderModal
