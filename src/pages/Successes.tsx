import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, ButtonGroup, Card, IconButton, Tooltip, Typography, css } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useContext, useMemo, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { ModalID } from 'modals'
import { EmptyStateDisplay } from 'sharedComponents'
import { globalButtonsWrapperCSS, globalContentWrapperCSS } from 'theme'
import { type TProject, type TSuccess } from 'types'

interface SuccessProps {
  description: string
  projectTitle: string
  id: string
  date: string
}

const Success = ({ description, projectTitle, id, date }: SuccessProps) => {
  const { dispatch } = useContext(context)

  const handleEditClick = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.EDIT_SUCCESS_MODAL, successId: id } })
  }, [dispatch, id])

  const metadata = useMemo(() => {
    return [projectTitle, date].filter(a => a).join(' - ')
  }, [projectTitle, date])

  return (
    <Card css={wrapperCSS}>
      <Box>
        <Typography variant="h2">{description}</Typography>
        <Typography variant="body1">{metadata}</Typography>
      </Box>
      <Box css={rightHeaderCSS}>
        <IconButton size='small' onClick={handleEditClick}>
          <Tooltip title="Edit Success">
            <EditIcon fontSize='small' />
          </Tooltip>
        </IconButton>
      </Box>
    </Card>
  )
}

const rightHeaderCSS = css`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const wrapperCSS = css`
  background-color: var(--mui-palette-background-paper);
  color: var(--mui-palette-secondary-main);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0 0 1rem 0;
  display: flex;
  justify-content: space-between;
`

const SuccessesPage = () => {
  const { dispatch, state: { activeWorkspaceId } } = useContext(context)
  const [successItems, setSuccessItems] = useState<Array<TSuccess & { projectTitle: string }> | undefined>(undefined)

  const handleSuccess = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_SUCCESS_MODAL } })
  }, [dispatch])

  useLiveQuery(async () => {
    const successes = (await database.successes.where('workspaceId').equals(activeWorkspaceId).sortBy('date')).reverse()

    const result = await Promise.all(successes.map(async (success) => {
      const project = (await database.projects.where({ id: success.projectId }).first()) as TProject
      return {
        projectTitle: project ? project.title : '',
        ...success
      }
    }))
    setSuccessItems(result)
  }, [activeWorkspaceId])

  const content = useMemo(() => {
    if (!successItems) {
      // Don't flicker screen while successes load.
      return null
    }

    if (successItems.length === 0) {
      return (
        <EmptyStateDisplay
          message="What was something that went well today?"
        />
      )
    }

    return successItems.map(({ id, projectTitle, description, date }) => <Success date={date} key={id} id={id} projectTitle={projectTitle} description={description} />)
  }, [successItems])

  return (
    <>
      <Box css={globalButtonsWrapperCSS}>
        <ButtonGroup>
          <Button css={{ alignSelf: 'flex-start' }} variant='contained' key="add" onClick={handleSuccess} >Add Success</Button>
        </ButtonGroup >
      </Box>
      <Box css={globalContentWrapperCSS}>
        {content}
      </Box>
    </ >
  )
}

export default SuccessesPage
