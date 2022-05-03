import { TColor } from 'sharedTypes'
import styled from 'styled-components'

type ButtonProps = {
    variation: 'PRIMARY_BUTTON' | 'ALERT_BUTTON'
    disabled?: boolean
    fullWidth?: boolean
    alignRight?: boolean
    theme: TColor
}

const Button = styled.button<ButtonProps>`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    
    &:hover {
    cursor: pointer;
    }

    ${({ fullWidth }) => (fullWidth ? 'width: 100%;' : '')}

    ${({ variation, disabled, theme }) => {
        if (disabled) {
            return `
                color: ${theme.FOREGROUND_DISABLED};
                border-color: ${theme.FOREGROUND_DISABLED};

                &:hover {
                    cursor: not-allowed;
                }
            `
        } 

        if (variation === 'PRIMARY_BUTTON') {
            return `
                color: ${theme.PRIMARY_BUTTON};
                border-color: ${theme.PRIMARY_BUTTON};

                &:hover {
                    color: ${theme.ALERT_BUTTON};
                    border-color: ${theme.ALERT_BUTTON};
                }
            `
        } 
        
        if (variation === 'ALERT_BUTTON') {
            return `
                color: ${theme.ALERT_BUTTON};
                border-color: ${theme.ALERT_BUTTON};

                &:hover {
                    color: ${theme.PRIMARY_BUTTON};
                    border-color: ${theme.PRIMARY_BUTTON};
                }
            `
        } 
    }}
`

export default Button
