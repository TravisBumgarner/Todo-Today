import styled from 'styled-components'

import colors from './colors'

type ButtonProps = {
    variation: 'primary' | 'secondary' | 'alert' | 'disabled'
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
                color: ${colors.DISABLED};
                border-color: ${colors.DISABLED};

                &:hover {
                    background-color: ${colors.DISABLED};
                    color: ${colors.DISABLED};
                    border-color: ${colors.DISABLED};
                    cursor: not-allowed;
                }
            `
        }

        if (variation === 'primary') {
            return `
                color: ${colors.PRIMARY};
                border-color: ${colors.PRIMARY};

                &:hover {
                    color: ${colors.ALERT};
                    border-color: ${colors.ALERT};
                }
            `
        } if (variation === 'secondary') {
            return `
                color: ${colors.SECONDARY};
                border-color: ${colors.SECONDARY};

                &:hover {
                    background-color: ${colors.SECONDARY};
                    color: ${colors.SECONDARY};
                    border-color: ${colors.SECONDARY};
                }
            `
        } if (variation === 'alert') {
            return `
                color: ${colors.ALERT};
                border-color: ${colors.ALERT};

                &:hover {
                    background-color: ${colors.ALERT};
                    color: ${colors.ALERT};
                    border-color: ${colors.ALERT};
                }
            `
        }
    }}
`

export default Button
