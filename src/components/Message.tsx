import { useContext } from 'react'
import { Alert as AlertMUI, Box, Button } from '@mui/material'
import { css } from '@emotion/react'

import { context } from 'Context'

const Alert = () => {
  const { state, dispatch } = useContext(context)

  const handleSubmit = () => {
    dispatch({ type: 'DELETE_MESSAGE' })
  }
  console.log('hi')
  if (!state.message) return null

  return (
    <Box css={AlertPositionerCSS}>
      <AlertMUI
        variant='filled'
        action={
          <Button color="inherit" size="small" onClick={handleSubmit}>
            Close
          </Button>
        }
        severity={state.message.severity}>{state.message.text}</AlertMUI>
    </Box >
  )
}

export default Alert

const AlertPositionerCSS = css`
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
`
