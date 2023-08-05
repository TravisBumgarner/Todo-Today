import React from 'react'
import styled from 'styled-components'
import { Button } from '@mui/material'

const StyledNav = styled.ul<{ openDirection: 'left' | 'right', showMenu: boolean }>`
    z-index: 998;
    position: absolute;
    width: 240px;
    display: ${({ showMenu }) => (showMenu ? 'block' : 'none')};
    ${({ openDirection }) => {
        switch (openDirection) {
            case 'left': {
                return `
                    right: 0;
                `
            }
            case 'right': {
                return `
                    left: 0;
                `
            }
        }
    }};
    list-style: none;
    flex-direction: row;
    padding: 1rem;
    background-color: ${({ theme }) => theme.BACKGROUND};
    border: 1px solid ${({ theme }) => theme.FOREGROUND};
    margin: 0.5rem;

    button {
        margin: 0.5rem 0; // For whatever reason I cannot figure out how to get a button to fit in a dropdown. 
    }
`

interface DropdownMenuProps {
    title: string
    children: any[]
    openDirection: 'left' | 'right'
}

const DropdownMenu = ({ title, children, openDirection }: DropdownMenuProps) => {
    const [showMenu, setShowMenu] = React.useState<boolean>(false)

    const handleClose = () => { setShowMenu(false) }

    React.useEffect(() => {
        if (showMenu) {
            window.addEventListener('click', handleClose)
        }
        return () => { window.removeEventListener('click', handleClose) }
    }, [showMenu])

    return (
        <div style={{ position: 'relative' }}>
            <Button onClick={() => { setShowMenu(!showMenu) }}>{title}</Button>
            <StyledNav openDirection={openDirection} showMenu={showMenu}>
                {children.map((child, index) => <li key={index}>{child}</li>)} {/* eslint-disable-line */}
            </StyledNav>
        </div>
    )
}
export default DropdownMenu
