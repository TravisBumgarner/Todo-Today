import { Box, css, IconButton, Tooltip } from '@mui/material'
import { useCallback } from 'react'

import SettingsIcon from '@mui/icons-material/Settings'
import { ModalID } from 'modals'
import { SPACING } from 'theme'
import { activeModalSignal } from '../signals'

const Footer = () => {
  const handleSettings = useCallback(() => {
    activeModalSignal.value = { id: ModalID.SETTINGS_MODAL }
  }, [])

  return (
    <Box css={footerCSS}>
      <IconButton color="error"
        onClick={handleSettings}
      >
        <Tooltip title="Settings">
          <SettingsIcon />
        </Tooltip>
      </IconButton>
    </Box>
  )
}

const footerCSS = css`
  position: fixed;
  right: ${SPACING.MEDIUM}px;
  bottom: ${SPACING.MEDIUM}px;
`

export default Footer
