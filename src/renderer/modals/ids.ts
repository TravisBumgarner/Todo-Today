// Kept apart from RenderModal so anything that only needs to *name* a modal can
// import this without pulling in every modal component (and without the import
// cycle that creates).
export enum ModalID {
  NEW_TASK_MODAL = 'NEW_TASK_MODAL',
  EDIT_TASK_MODAL = 'EDIT_TASK_MODAL',
  SELECT_TASKS_MODAL = 'SELECT_TASKS_MODAL',
  BACKUP_FAILURE_MODAL = 'BACKUP_FAILURE_MODAL',
  SETTINGS_MODAL = 'SETTINGS_MODAL',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
  CHANGELOG_MODAL = 'CHANGELOG_MODAL',
  RECURRING_TASKS_MODAL = 'RECURRING_TASKS_MODAL',
  HISTORY_MODAL = 'HISTORY_MODAL',
}
