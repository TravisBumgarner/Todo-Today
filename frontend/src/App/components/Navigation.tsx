import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import SettingsIcon from '@mui/icons-material/Settings'

const StyledNav = styled.ul`
    list-style: none;
    margin: 2rem 0;
    padding: 0rem;
    display: flex;
    flex-direction: row;

    li {
        margin-left: 1rem;
    }
`

const Navigation = () => {
  return (
    <StyledNav>
      <NavLink to="/history"><EditIcon /></NavLink>
      <NavLink to="/settings"><SettingsIcon /></NavLink>
    </StyledNav>
  )
}
export default Navigation
