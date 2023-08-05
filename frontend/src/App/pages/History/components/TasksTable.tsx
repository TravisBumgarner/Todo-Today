import React, { useCallback, useContext } from 'react'
import { Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import { Table, EmptyStateDisplay } from 'sharedComponents'
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
    <Table.Table>
      <Table.TableHeader>
        <Table.TableRow>
          <Table.TableHeaderCell>Task</Table.TableHeaderCell>
          <Table.TableHeaderCell width="200px">Status</Table.TableHeaderCell>
          <Table.TableHeaderCell width="30px"></Table.TableHeaderCell>
        </Table.TableRow>
      </Table.TableHeader>
      <Table.TableBody>
        {tasks.map(({ title, status, id }) => {
          const handleEditTask = () => {
            dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_TASK, data: { taskId: id } } })
          }
          return (

            < Table.TableRow key={id} >
              <Table.TableBodyCell>{title}</Table.TableBodyCell>
              <Table.TableBodyCell>{taskStatusLookup[status]}</Table.TableBodyCell>
              <Table.TableBodyCell>
                <EditIcon
                  key="edit"
                  name="edit"
                  onClick={handleEditTask}
                />
              </Table.TableBodyCell>
            </Table.TableRow>
          )
        })}
      </Table.TableBody>
    </Table.Table >
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
