import React from 'react'
import styled from 'styled-components'

// For More: https://fonts.google.com/icons

type IconProps = {
    name: 'mic' | 'delete' | 'close' | 'done' | 'edit' | 'settings' | 'history'
    size?: string
    onClick?: () => void
}

const Button = styled.button`
    border:0;
    background-color: transparent;
    cursor: pointer;

    > span {
        color: ${({ theme }) => theme.FOREGROUND};
    }
`

const Icon = ({ name, onClick, size }: IconProps) => {
    return (
        onClick ? (
            <Button onClick={onClick} type="button">
                <span style={{ fontSize: size || '1rem' }} className="material-symbols-outlined">
                    {name}
                </span>
            </Button>
        ) : (
            <span className="material-symbols-outlined">
                {name}
            </span>
        )
    )
}

export default Icon
