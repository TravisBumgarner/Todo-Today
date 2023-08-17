import React, { useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button } from '@mui/material'

import database from 'database'
import { EmptyStateDisplay } from 'sharedComponents'
import { type TProject } from 'sharedTypes'
import { context } from 'Context'
import { ModalID } from 'modals'

const SuccessesTable = () => {
  const { state, dispatch } = useContext(context)

  const tableRows = useLiveQuery(async () => {
    const successes = await database.successes.where('date').equals(state.selectedDate).toArray()

    return await Promise.all(successes.map(async (success) => {
      const project = (await database.projects.where({ id: success.projectId }).first()) as TProject
      return {
        projectTitle: project ? project.title : '-',
        ...success
      }
    }))
  }, [state.selectedDate])

  if (!tableRows || tableRows.length === 0) {
    return (
      <EmptyStateDisplay
        message="What was something that went well today?"
      />
    )
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Project</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          tableRows
            .sort((a, b) => {
              if (a.projectTitle.toLowerCase() < b.projectTitle.toLowerCase()) return -1
              if (a.projectTitle.toLowerCase() > b.projectTitle.toLowerCase()) return 1
              return 0
            })
            .map(({ id, projectTitle, description }) => {
              const handleEdit = () => {
                dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_SUCCESS_MODAL, data: { successId: id } } })
              }
              return (
                <tr key={id}>
                  <td>{projectTitle}</td>
                  <td>{description}</td>
                  <td>
                    <Button
                      fullWidth
                      key="edit"

                      onClick={handleEdit}
                    >
                      Edit
                    </Button>
                    <Button
                      fullWidth
                      key="remove"

                      onClick={async () => {
                        await database.successes
                          .where({ id })
                          .delete()
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            })
        }
      </tbody>
    </table>
  )
}

export default SuccessesTable
