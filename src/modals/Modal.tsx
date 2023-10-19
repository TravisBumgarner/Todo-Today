import { useContext, type FC, useCallback } from 'react'
import Box from '@mui/material/Box'
import MUIModal from '@mui/material/Modal'
import { IconButton, Tooltip, Typography, css } from '@mui/material'
import CloseIcon from '@mui/icons-material/CloseOutlined'

import { context } from 'Context'

interface ActiveModal {
  children: any
  showModal: boolean
  title: string
  disableEscapeKeyDown?: boolean
  disableBackdropClick?: boolean
}

export const MODAL_MAX_HEIGHT = 800

const Modal: FC<ActiveModal> = ({ children, title, disableEscapeKeyDown, disableBackdropClick }) => {
  const { dispatch } = useContext(context)

  const handleClose = useCallback((event?: any, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && disableBackdropClick) return

    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, disableBackdropClick])

  return (
    <MUIModal
      open={true}
      onClose={handleClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      disableRestoreFocus={true}
      style={{ backgroundColor: 'var(--mui-palette-background-default)' }}
    >
      <Box css={wrapperCSS}>
        <Box css={headerWrapperCSS}>
          <Typography variant="h2">{title}</Typography>
          <Tooltip title="Close">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {children}
      </Box>
    </MUIModal >
  )
}

const wrapperCSS = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  background-color: var(--mui-palette-background-default);
  border-radius: 1rem;
  box-shadow: 24;
  max-height: ${MODAL_MAX_HEIGHT}px;
  padding: 2rem;
`

const headerWrapperCSS = css`
  display: flex;
  justify-content: space-between;
`

export default Modal
