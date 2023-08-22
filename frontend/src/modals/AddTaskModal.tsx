import React, { useCallback, useState, useContext } from 'react'
import { v4 as uuid4 } from 'uuid'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelIcon from '@mui/icons-material/Cancel'

import Modal from './Modal'
import { type TProject, ETaskStatus, EProjectStatus } from 'sharedTypes'
import database from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { context } from 'Context'

interface AddTaskModalProps {
  project?: TProject
}

const CREATE_NEW_PROJECT_DROPDOWN_ITEM = 'create-new-project'

const AddTaskModal = ({ project }: AddTaskModalProps) => {
  const { state, dispatch } = useContext(context)
  const [title, setTitle] = useState<string>('')
  const [projectId, setProjectId] = useState<TProject['id'] | ''>(project ? project.id : '')
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
      console.log('Creating new project with details', newProject)
      projectIdForTask = newProject.id
      await database.projects.add(newProject)
      console.log('new project', newProject)
    }
    const newTask = {
      title,
      status: ETaskStatus.NEW,
      id: taskId,
      projectId: projectIdForTask
    }
    console.log('Creating new task with details', newTask)

    await database.tasks.add(newTask)

    if (addToSelectedDate === 'yes') {
      const lastTodoListItem = await database
        .todoListItems
        .orderBy('sortOrder')
        .reverse()
        .first()

      await database.todoListItems.add({
        projectId: projectIdForTask,
        taskId,
        id: taskId,
        todoListDate: state.selectedDate,
        details: '',
        sortOrder: lastTodoListItem ? lastTodoListItem.sortOrder + 1 : 0
      })
    }
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }

  const projectSelectOptions = projects ? projects.map((p) => ({ value: p.id, label: p.title })) : []
  projectSelectOptions.unshift({ value: CREATE_NEW_PROJECT_DROPDOWN_ITEM, label: 'Create new Project' })

  const handleAddToTodayChange = useCallback((event: React.MouseEvent<HTMLElement>, newValue: 'yes' | 'no') => {
    console.log('newValue', newValue)
    setAddToSelectedDate(newValue)
  }, [])

  return (
    <Modal
      title="Add New Task"
      showModal={true}
    >
      <TextField
        fullWidth
        label="Task"
        name="title"
        value={title}
        margin='normal'
        onChange={(event) => { setTitle(event.target.value) }}
      />
      <FormControl fullWidth>
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

        <ToggleButtonGroup exclusive onChange={handleAddToTodayChange}>
          <ToggleButton value='no' >
            <Tooltip title="Do not add to today">
              <CancelIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value='yes'>
            <Tooltip title="Add to today">
              <CheckCircleOutlineIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Button
        key="cancel"
        fullWidth
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

    </Modal >
  )
}

export default AddTaskModal
