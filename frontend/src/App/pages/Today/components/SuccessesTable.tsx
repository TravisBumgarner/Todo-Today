import React, { useContext } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button } from '@mui/material'

import database from 'database'
import { EmptyStateDisplay, Table } from 'sharedComponents'
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
    <Table.Table>
      <Table.TableHeader>
        <Table.TableRow>
          <Table.TableHeaderCell width="20%">Project</Table.TableHeaderCell>
          <Table.TableHeaderCell>Description</Table.TableHeaderCell>
          <Table.TableHeaderCell width="100px">Actions</Table.TableHeaderCell>
        </Table.TableRow>
      </Table.TableHeader>
      <Table.TableBody>
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
                <Table.TableRow key={id}>
                  <Table.TableBodyCell>{projectTitle}</Table.TableBodyCell>
                  <Table.TableBodyCell>{description}</Table.TableBodyCell>
                  <Table.TableBodyCell>
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
                  </Table.TableBodyCell>
                </Table.TableRow>
              )
            })
        }
      </Table.TableBody>
    </Table.Table>
  )
}

export default SuccessesTable
