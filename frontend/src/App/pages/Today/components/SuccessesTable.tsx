import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button } from '@mui/material'

import database from 'database'
import { EmptyStateDisplay, Table } from 'sharedComponents'
import { type TProject } from 'sharedTypes'
import EditSuccessModal from './EditSuccessModal'
import { context } from 'Context'

const SuccessesTable = () => {
  const { state } = React.useContext(context)
  const [selectedSuccessId, setSelectedSuccessId] = React.useState<string | null>(null)

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
    <>
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
                console.log(id)
                return (
                  <Table.TableRow key={id}>
                    <Table.TableBodyCell>{projectTitle}</Table.TableBodyCell>
                    <Table.TableBodyCell>{description}</Table.TableBodyCell>
                    <Table.TableBodyCell>
                      <Button
                        fullWidth
                        key="edit"

                        onClick={() => { setSelectedSuccessId(id) }}
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
      {selectedSuccessId
        ? (
          <EditSuccessModal
            showModal={selectedSuccessId !== null}
            setShowModal={() => { setSelectedSuccessId(null) }}
            successId={selectedSuccessId}
          />
        )
        : (null)}
    </>
  )
}

export default SuccessesTable
