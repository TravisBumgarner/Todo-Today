import React, { useCallback, useContext } from 'react'
import { Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import { EmptyStateDisplay } from 'sharedComponents'
import { type TProject, type TTask } from 'sharedTypes'
import { taskStatusLookup } from 'utilities'
import { context } from 'Context'
import { ModalID } from 'modals'

interface TasksTableProps {
  tasks: TTask[]
  project: TProject
}

const TasksTable = ({ tasks, project }: TasksTableProps) => {
  const { dispatch } = useContext(context)

  const handleEditProject = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_PROJECT, data: { projectId: project.id } } })
  }, [dispatch, project.id])

  const TasksTableOnly = (
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(({ title, status, id }) => {
          const handleEditTask = () => {
            dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK, data: { taskId: id } } })
          }
          return (

            < tr key={id} >
              <td>{title}</td>
              <td>{taskStatusLookup[status]}</td>
              <td>
                <EditIcon
                  key="edit"
                  name="edit"
                  onClick={handleEditTask}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table >
  )

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'left' }}>
        <Typography variant='h3'>{project.title}</Typography> <EditIcon name="edit" onClick={handleEditProject} />
      </div>
      {
        tasks.length === 0
          ? (<EmptyStateDisplay message="Create a tasks and get going!" />)
          : (TasksTableOnly)
      }
    </>
  )
}

export default TasksTable
