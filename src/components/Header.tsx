import { useCallback, useContext, useMemo } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Typography, Box, IconButton, css, Tooltip } from '@mui/material'

import MenuBookIcon from '@mui/icons-material/MenuBook'
import ChecklistIcon from '@mui/icons-material/Checklist'
import SettingsIcon from '@mui/icons-material/Settings'
import CelebrationIcon from '@mui/icons-material/Celebration'
import { context } from 'Context'
import { ModalID } from 'modals'
import { EActivePage } from 'types'

const Navigation = () => {
  const { dispatch } = useContext(context)

  const handleHome = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_PAGE', payload: { page: EActivePage.Home } })
  }, [dispatch])

  const handleHistory = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_PAGE', payload: { page: EActivePage.History } })
  }, [dispatch])

  const handleSettings = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.SETTINGS_MODAL } })
  }, [dispatch])

  const handleSuccess = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_PAGE', payload: { page: EActivePage.Successes } })
  }, [dispatch])

  return (
    <Box css={navigationCSS}>
      <IconButton color="primary"
        onClick={handleHome}
      >
        <Tooltip title="Todo Today">
          <ChecklistIcon />
        </Tooltip>
      </IconButton>

      <IconButton color="secondary"
        onClick={handleSuccess}
      >
        <Tooltip title="Successes">
          <CelebrationIcon />
        </Tooltip>
      </IconButton>

      <IconButton color="warning"
        onClick={handleHistory}
      >
        <Tooltip title="Project and Task History">
          <MenuBookIcon />
        </Tooltip>
      </IconButton>

      <IconButton color="error"
        onClick={handleSettings}
      >
        <Tooltip title="Settings">
          <SettingsIcon />
        </Tooltip>
      </IconButton>
    </Box >
  )
}

const Header = () => {
  return (
    <Box css={headerCSS}>
      <Navigation />
    </Box>
  )
}

const navigationCSS = css`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
`

export const HEADER_HEIGHT = 55

const headerCSS = css`
  height: ${HEADER_HEIGHT}px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem 0;
  background-color: var(--mui-palette-background-default);
`

export default Header
