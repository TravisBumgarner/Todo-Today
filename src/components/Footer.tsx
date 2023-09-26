import { useCallback, useContext, useMemo } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Typography, Box, css } from '@mui/material'

import { context } from 'Context'
import { EActivePage } from 'types'

const Footer = () => {
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
    <Box css={footerCSS}>
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
        left: -2px;
        top: -2px;
        opacity: 0.8;
        color: var(--mui-palette-warning-main);

    }

    h1:nth-of-type(2){
        position: absolute;
        left: 2px;
        top: 2px;
        opacity: 0.8;
        color: var(--mui-palette-secondary-main);

    }

    h1:nth-of-type(3){
        position: absolute;
        left: -2px;
        top: 2px;
        opacity: 0.8;
        color: var(--mui-palette-primary-main);
    }

    h1:nth-of-type(4){
       position: absolute;
        left: 2px;
        top: -2px;
        opacity: 0.8;
        color: var(--mui-palette-error-main);
    }

    h1:nth-of-type(5){
        left: 0px;
        top: 0px;
        color: var(--mui-palette-background-default);
    }
`

export const HEADER_HEIGHT = 55

const footerCSS = css`
  height: ${HEADER_HEIGHT}px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  background-color: var(--mui-palette-background-default);
  position: fixed;
  bottom: 0.5rem;
  left: 0.5rem;
  z-index: 999;
`

export default Footer
