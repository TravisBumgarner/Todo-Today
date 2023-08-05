import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import SettingsIcon from '@mui/icons-material/Settings'
import { Box, IconButton, css } from '@mui/material'

const Navigation = () => {
  const navigate = useNavigate()
  const handleHistory = useCallback(() => {
    navigate('/history')
  }, [navigate])

  const handleSettings = useCallback(() => {
    navigate('/settings')
  }, [navigate])

  return (
    <Box css={navigationCSS}>
      <IconButton color="primary" onClick={handleHistory}>
        <EditIcon />
      </IconButton>
      <IconButton color="primary" onClick={handleSettings}>
        <SettingsIcon />
      </IconButton>
    </Box>
  )
}

const navigationCSS = css`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
`

export default Navigation
