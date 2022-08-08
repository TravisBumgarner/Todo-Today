import styled from 'styled-components'
import { transparentize } from 'polished'
import { TColor } from 'sharedTypes'

type ButtonProps = {
    variation: 'INTERACTION' | 'WARNING'
    disabled?: boolean
    fullWidth?: boolean
    alignRight?: boolean
    theme: TColor
}

const Button = styled.button<ButtonProps>`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 1px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    height: 2.5rem; // To Match Inputs
    
    &:hover {
    cursor: pointer;
    }

    ${({ fullWidth }) => (fullWidth ? 'width: 100%;' : '')}

    ${({ variation, disabled, theme }) => {
        if (disabled) {
            return `
                color: ${theme.DISABLED};
                border-color: ${theme.DISABLED};
                background-color: ${transparentize(0.9, theme.DISABLED)};

                &:hover {
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'INTERACTION') {
            return `
                color: ${theme.FOREGROUND};
                border-color: ${theme.FOREGROUND};
                background-color: ${transparentize(0.9, theme.FOREGROUND)};

                // border-left-color: ${theme.FOREGROUND};
                // border-right-color: ${theme.INTERACTION};
                // border-bottom-color: ${theme.WARNING};
                // border-top-color: ${theme.DISABLED};

                &:hover {
                    color: ${theme.INTERACTION};
                    border-color: ${theme.INTERACTION};
                    background-color: ${transparentize(0.9, theme.INTERACTION)};
                }
            `
        }

        if (variation === 'WARNING') {
            return `
                color: ${theme.WARNING};
                border-color: ${theme.WARNING};
                background-color: ${transparentize(0.9, theme.WARNING)};

                &:hover {
                    color: ${theme.INTERACTION};
                    border-color: ${theme.INTERACTION};
                    background-color: ${transparentize(0.9, theme.INTERACTION)};
                }
            `
        }
    }}
`

export default Button
