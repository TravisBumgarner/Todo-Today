import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Typography } from '@mui/material'
import { css } from '@emotion/react'

const Header = () => {
  return (
    <Container css={headerWrapperCSS}>
      <Link style={{ textDecoration: 'none' }} to="/">
        <Container css={headerCSS}>
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
        </Container >
      </Link>
    </Container>
  )
}

const headerWrapperCSS = css`
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
`

const headerCSS = css`
    height: 5rem;
    position: relative;
   
    h1{
        position: absolute;
        white-space: nowrap;
        opacity: 0.9;
        font-size: 4rem;
        letter-spacing: 6px;
        color: var(--mui-palette-primary-secondary);
    }

    h1:nth-child(1){
        left: -2px;
        top: -2px;
        opacity: 0.8;
        color: var(--mui-palette-warning-main);

    }

    h1:nth-child(2){
        left: 2px;
        top: 2px;
        opacity: 0.8;
        color: var(--mui-palette-secondary-main);

    }

    h1:nth-child(3){
        left: -2px;
        top: 2px;
        opacity: 0.8;
        color: var(--mui-palette-primary-main);
    }

    h1:nth-child(4){
        left: 2px;
        top: -2px;
        opacity: 0.8;
        color: var(--mui-palette-error-main);
    }

    h1:nth-child(5){
        left: 0px;
        top: 0px;
        color: var(--mui-palette-primary-main);
    }
`

export default Header
