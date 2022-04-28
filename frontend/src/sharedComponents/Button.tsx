import styled from 'styled-components'

import colors from './colors'

type ButtonProps = {
    variation: 'PRIMARY_BUTTON' | 'ALERT_BUTTON'
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

        if (variation === 'PRIMARY_BUTTON') {
            return `
                color: ${colors.PRIMARY_BUTTON};
                border-color: ${colors.PRIMARY_BUTTON};

                &:hover {
                    color: ${colors.ALERT_BUTTON};
                    border-color: ${colors.ALERT_BUTTON};
                }
            `
        } if (variation === 'ALERT_BUTTON') {
            return `
                color: ${colors.ALERT_BUTTON};
                border-color: ${colors.ALERT_BUTTON};

                &:hover {
                    color: ${colors.PRIMARY_BUTTON};
                    border-color: ${colors.PRIMARY_BUTTON};
                }
            `
        }
    }}
`

export default Button
