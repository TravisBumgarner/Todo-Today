import React, { useCallback, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Typography, Box, IconButton, css, Tooltip } from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import SettingsIcon from '@mui/icons-material/Settings'
import CelebrationIcon from '@mui/icons-material/Celebration'
import { context } from 'Context'
import { ModalID } from 'modals'

const Navigation = () => {
  const { dispatch } = useContext(context)
  const navigate = useNavigate()
  const handleHistory = useCallback(() => {
    navigate('/history')
  }, [navigate])

  const handleSettings = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.SETTINGS_MODAL } })
  }, [dispatch])

  const handleSuccess = useCallback(() => {
    navigate('/successess')
  }, [navigate])

  return (
    <Box css={navigationCSS}>
      <IconButton color="primary" onClick={handleSuccess}>
        <Tooltip title="Successes">
          <CelebrationIcon />
        </Tooltip>
      </IconButton>

      <IconButton color="primary" onClick={handleHistory}>
        <Tooltip title="Project and Task History">
          <EditIcon />
        </Tooltip>
      </IconButton>
      <IconButton color="primary" onClick={handleSettings}>
        <Tooltip title="Settings">
          <SettingsIcon />
        </Tooltip>
      </IconButton>
    </Box >
  )
}

const navigationCSS = css`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
`

const Title = () => {
  return (
    <Box css={titleCSS}>
      <Link style={{ textDecoration: 'none' }} to="/">
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
      </Link >
    </Box >
  )
}

const titleCSS = css`
    position: relative;
   
    h1{
        white-space: nowrap;
        opacity: 0.9;
        letter-spacing: 6px;
        color: var(--mui-palette-primary-secondary);
    }

    h1:nth-child(1){
        position: absolute;
        left: -2px;
        top: -2px;
        opacity: 0.8;
        color: var(--mui-palette-warning-main);

    }

    h1:nth-child(2){
        position: absolute;
        left: 2px;
        top: 2px;
        opacity: 0.8;
        color: var(--mui-palette-secondary-main);

    }

    h1:nth-child(3){
        position: absolute;
        left: -2px;
        top: 2px;
        opacity: 0.8;
        color: var(--mui-palette-primary-main);
    }

    h1:nth-child(4){
       position: absolute;
        left: 2px;
        top: -2px;
        opacity: 0.8;
        color: var(--mui-palette-error-main);
    }

    h1:nth-child(5){
        left: 0px;
        top: 0px;
        color: var(--mui-palette-background-default);
    }
`

const Header = () => {
  return (
    <Box css={headerCSS}><Title /><Navigation /></Box>
  )
}

const headerCSS = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
`

export default Header
