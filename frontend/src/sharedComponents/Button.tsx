import styled from 'styled-components'

import colors from './colors'

type ButtonProps = {
    variation: 'FOREGROUND_PRIMARY' | 'BACKGROUND_PRIMARY' | 'FOREGROUND_ALERT' | 'FOREGROUND_DISABLED'
    disabled?: boolean
    fullWidth?: boolean
    alignRight?: boolean

}

const Button = styled.button`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;

    &:hover {
    cursor: pointer;
    }

    ${({ fullWidth }: ButtonProps) => (fullWidth ? 'width: 100%;' : '')}

    ${({ variation, disabled }: ButtonProps) => {
        if (disabled) {
            return `
                color: ${colors.FOREGROUND_DISABLED};
                border-color: ${colors.FOREGROUND_DISABLED};

                &:hover {
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'FOREGROUND_PRIMARY') {
            return `
                color: ${colors.FOREGROUND_PRIMARY};
                border-color: ${colors.FOREGROUND_PRIMARY};

                &:hover {
                    color: ${colors.FOREGROUND_ALERT};
                    border-color: ${colors.FOREGROUND_ALERT};
                }
            `
        } if (variation === 'BACKGROUND_PRIMARY') {
            return `
                color: ${colors.BACKGROUND_PRIMARY};
                border-color: ${colors.BACKGROUND_PRIMARY};

                &:hover {
                    color: ${colors.FOREGROUND_PRIMARY};
                    border-color: ${colors.FOREGROUND_PRIMARY};
                }
            `
        } if (variation === 'FOREGROUND_ALERT') {
            return `
                color: ${colors.FOREGROUND_ALERT};
                border-color: ${colors.FOREGROUND_ALERT};

                &:hover {
                    color: ${colors.FOREGROUND_PRIMARY};
                    border-color: ${colors.FOREGROUND_PRIMARY};
                }
            `
        }
    }}
`

export default Button
