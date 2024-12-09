import MenuIcon from '@mui/icons-material/Menu'
import { Box, css, IconButton, Tooltip, Typography } from '@mui/material'
import { useCallback, useContext, useMemo } from 'react'

import SettingsIcon from '@mui/icons-material/Settings'
import { context } from 'Context'
import db, { DEFAULT_WORKSPACE } from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { ModalID } from 'modals'
import { activeModalSignal } from '../signals'

const Title = () => {
  const { state: { activeWorkspaceId } } = useContext(context)

  const workspace = useLiveQuery(async () => {
    const result = await db.workspaces.where('id').equals(activeWorkspaceId).first()
    return result ?? { name: 'Todo Today', id: DEFAULT_WORKSPACE.id }
  }, [activeWorkspaceId])

  const header = useMemo(() => {
    if (workspace) {
      return workspace.name
    }
    return 'Todo Today'
  }, [workspace])

  return (
    <Box css={titleCSS}>
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
  const handleSettings = useCallback(() => {
    activeModalSignal.value = { id: ModalID.SETTINGS_MODAL }
  }, [])

  return (
    <Box css={headerCSS}>
      <Box css={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
  justify-content: center;
  align-items: center;
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
