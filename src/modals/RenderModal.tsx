import { context } from 'Context'
import { useContext, type FC } from 'react'
import AddTaskModal from './AddTaskModal'
import AddWorkspaceModal from './AddWorkspaceModal'
import ConfirmationModal, { type ConfirmationModalProps } from './ConfirmationModal'
import EditTaskModal from './EditTaskModal'
import EditWorkspaceModal from './EditWorkspaceModal'
import SelectTasksModal from './SelectTasksModal'
import SettingsModal from './Settings'
import TimerSetupModal from './TimerSetupModal'

export enum ModalID {
  ADD_TASK_MODAL = 'ADD_TASK_MODAL',
  ADD_WORKSPACE_MODAL = 'ADD_WORKSPACE_MODAL',
  EDIT_TASK_MODAL = 'EDIT_TASK_MODAL',
  SELECT_TASKS_MODAL = 'SELECT_TASKS_MODAL',
  BACKUP_FAILURE_MODAL = 'BACKUP_FAILURE_MODAL',
  SETTINGS_MODAL = 'SETTINGS_MODAL',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
  TIMER_SETUP_MODAL = 'TIMER_SETUP_MODAL',
  EDIT_WORKSPACE_MODAL = 'EDIT_WORKSPACE_MODAL'
}

export type ActiveModal =
  | { id: ModalID.ADD_TASK_MODAL }
  | { id: ModalID.ADD_WORKSPACE_MODAL }
  | { id: ModalID.EDIT_TASK_MODAL, taskId: string }
  | { id: ModalID.SELECT_TASKS_MODAL }
  | { id: ModalID.BACKUP_FAILURE_MODAL }
  | { id: ModalID.SETTINGS_MODAL }
  | { id: ModalID.CONFIRMATION_MODAL } & ConfirmationModalProps
  | { id: ModalID.TIMER_SETUP_MODAL }
  | { id: ModalID.EDIT_WORKSPACE_MODAL, workspaceId: string }

const RenderModal: FC = () => {
  const { state } = useContext(context)

  if (!state.activeModal?.id) return null

  switch (state.activeModal.id) {
    case ModalID.ADD_TASK_MODAL:
      return <AddTaskModal />
    case ModalID.EDIT_TASK_MODAL:
      return <EditTaskModal taskId={state.activeModal.taskId} />
    case ModalID.SELECT_TASKS_MODAL:
      return <SelectTasksModal />
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
    case ModalID.ADD_WORKSPACE_MODAL:
      return <AddWorkspaceModal />
    case ModalID.EDIT_WORKSPACE_MODAL:
      return <EditWorkspaceModal workspaceId={state.activeModal.workspaceId} />
    default:
      return null
  }
}

export default RenderModal
