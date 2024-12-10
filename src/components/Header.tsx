import { Box, css, IconButton, Tooltip, Typography } from '@mui/material'
import { useCallback } from 'react'

import SettingsIcon from '@mui/icons-material/Settings'
import { ModalID } from 'modals'
import { activeModalSignal } from '../signals'

const Title = () => {
  return (
    <Box css={titleCSS}>
      <Typography variant="h1">
        Todo Today
      </Typography>
      <Typography variant="h1">
        Todo Today
      </Typography>
      <Typography variant="h1">
        Todo Today
      </Typography>
      <Typography variant="h1">
        Todo Today
      </Typography>
      <Typography variant="h1">
        Todo Today
      </Typography>
    </Box >
  )
}

const Header = () => {
  const handleSettings = useCallback(() => {
    activeModalSignal.value = { id: ModalID.SETTINGS_MODAL }
  }, [])

  return (
    <Box css={headerCSS}>
      <Box css={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
