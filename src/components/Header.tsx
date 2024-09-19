import MenuIcon from '@mui/icons-material/Menu'
import { Box, css, IconButton, Tooltip, Typography } from '@mui/material'
import { useCallback, useContext, useMemo } from 'react'

import CelebrationIcon from '@mui/icons-material/Celebration'
import ChecklistIcon from '@mui/icons-material/Checklist'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SettingsIcon from '@mui/icons-material/Settings'
import { context } from 'Context'
import { ModalID } from 'modals'
import { EActivePage } from 'types'

const Title = () => {
  const { state: { activePage }, dispatch } = useContext(context)
  const header = useMemo(() => {
    switch (activePage) {
      case EActivePage.Home:
        return 'Todo Today'
      case EActivePage.History:
        return 'History'
      case EActivePage.Successes:
        return 'Successes'
      default:
        return 'Todo Today'
    }
  }, [activePage])

  const handleHome = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_PAGE', payload: { page: EActivePage.Home } })
  }, [dispatch])

  return (
    <Box css={titleCSS} onClick={handleHome}>
      <Typography variant="h1">
        {header}
      </Typography>
      <Typography variant="h1">
        {header}
      </Typography>
      <Typography variant="h1">
        {header}
      </Typography>
      <Typography variant="h1">
        {header}
      </Typography>
      <Typography variant="h1">
        {header}
      </Typography>
    </Box >
  )
}

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
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
    <Box css={headerCSS}>
      <Box css={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Tooltip title="Change Workspace">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <Title />
      </Box>
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
    </Box>
  )
}

const titleCSS = css`
  position: relative;
  cursor: pointer;
   
    h1{
        white-space: nowrap;
        opacity: 0.9;
        letter-spacing: 6px;
        color: var(--mui-palette-primary-secondary);
    }

    h1:nth-of-type(1){
        position: absolute;
        left: -1px;
        top: -1px;
        opacity: 0.8;
        color: var(--mui-palette-warning-main);

    }

    h1:nth-of-type(2){
        position: absolute;
        left: 1px;
        top: 1px;
        opacity: 0.8;
        color: var(--mui-palette-secondary-main);

    }

    h1:nth-of-type(3){
        position: absolute;
        left: -1px;
        top: 1px;
        opacity: 0.8;
        color: var(--mui-palette-primary-main);
    }

    h1:nth-of-type(4){
       position: absolute;
        left: 1px;
        top: -1px;
        opacity: 0.8;
        color: var(--mui-palette-error-main);
    }

    h1:nth-of-type(5){
        left: 0px;
        top: 0px;
        color: var(--mui-palette-background-default);
    }
`

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
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  background-color: var(--mui-palette-background-default);
`

export default Header
