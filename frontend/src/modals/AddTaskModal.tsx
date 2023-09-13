import React, { useCallback, useState, useContext } from 'react'
import { v4 as uuid4 } from 'uuid'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/Cancel'

import Modal from './Modal'
import { type TProject, ETaskStatus, EProjectStatus, type TTask } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { context } from 'Context'
import { ButtonWrapper } from 'sharedComponents'

const CREATE_NEW_PROJECT_DROPDOWN_ITEM = 'create-new-project'

const AddTaskModal = () => {
  const { state, dispatch } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [projectId, setProjectId] = useState<TProject['id'] | ''>('')
  const [addProjectInput, setAddProjectInput] = useState<string>('')
  const [addToSelectedDate, setAddToSelectedDate] = useState<'yes' | 'no'>('yes')

  const projects = useLiveQuery(async () => {
    return await database
      .projects
      .where('status')
      .anyOf(EProjectStatus.ACTIVE)
      .toArray()
  }, [])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const handleSubmit = async () => {
    const taskId = uuid4()

    let projectIdForTask = projectId

    if (projectId === CREATE_NEW_PROJECT_DROPDOWN_ITEM) {
      const newProject: TProject = {
        id: uuid4(),
        title: addProjectInput,
        status: EProjectStatus.ACTIVE
      }
      projectIdForTask = newProject.id
      await database.projects.add(newProject)
    }
    const newTask: TTask = {
      title,
      status: ETaskStatus.NEW,
      id: taskId,
      projectId: projectIdForTask,
      details: ''
    }

    await database.tasks.add(newTask)

    if (addToSelectedDate === 'yes') {
      await database.todoListItems.add({
        taskId,
        id: taskId,
        todoListDate: state.selectedDate,
        sortOrder: -1 // Prepend to list
      })
    }
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }

  const projectSelectOptions = projects ? projects.map((p) => ({ value: p.id, label: p.title })) : []
  projectSelectOptions.unshift({ value: CREATE_NEW_PROJECT_DROPDOWN_ITEM, label: 'Create new Project' })

  const handleAddToTodayChange = useCallback((event: React.MouseEvent<HTMLElement>, newValue: 'yes' | 'no') => {
    if (newValue === null) return

    setAddToSelectedDate(newValue)
  }, [])

  return (
    <Modal
      title="Add New Task"
      showModal={true}
    >
      <TextField
        autoFocus
        multiline
        fullWidth
        label="Task"
        name="title"
        value={title}
        margin='normal'
        onChange={(event) => { setTitle(event.target.value) }}
      />
      <FormControl fullWidth margin='normal'>
        <InputLabel id="add-task-modal-project-select">Project</InputLabel>
        <Select
          label="Project"
          labelId="add-task-modal-project-select"
          fullWidth
          value={projectId}
          onChange={(event) => { setProjectId(event.target.value) }}
        >
          {projectSelectOptions.map(({ label, value }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
        </Select>
      </FormControl>
      {projectId === CREATE_NEW_PROJECT_DROPDOWN_ITEM &&
        <TextField
          fullWidth
          label="Add Project"
          name="add-project"
          value={addProjectInput}
          margin='normal'
          onChange={(event) => { setAddProjectInput(event.target.value) }}
        />
      }
      <Box css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <InputLabel>Add to Today?</InputLabel>

        <ToggleButtonGroup value={addToSelectedDate} exclusive onChange={handleAddToTodayChange}>
          <ToggleButton color="primary" value='no' >
            <Tooltip title="Do not add to today">
              <CancelIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton color="primary" value='yes'>
            <Tooltip title="Add to today">
              <CheckCircleOutlineIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ButtonWrapper>
        <Button
          key="cancel"
          fullWidth
          variant='contained'
          color='secondary'
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          type="button"
          variant='contained'
          disabled={title.length === 0 || projectId.length === 0 || (projectId === CREATE_NEW_PROJECT_DROPDOWN_ITEM && addProjectInput.length === 0)}
          key="save"

          onClick={handleSubmit}
        >
          Save
        </Button>
      </ButtonWrapper>

    </Modal >
  )
}

export default AddTaskModal
