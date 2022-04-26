import styled from 'styled-components'
import React from 'react'

import colors from './colors'

const Input = styled.input`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.FOREGROUND_PRIMARY};
    border-color: ${colors.FOREGROUND_PRIMARY};
    width: 100%;
    box-sizing: border-box;
`

const TextArea = styled.textarea`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.FOREGROUND_PRIMARY};
    border-color: ${colors.FOREGROUND_PRIMARY};
    width: 100%;
    box-sizing: border-box;
`

const Label = styled.label`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.FOREGROUND_PRIMARY};
`

const LabelAndInputWrapper = styled.div`
    margin: 0.5rem;

    ${Label}{
        display: block;
        box-sizing: border-box;
    }

    ${Input}{
        display: block;
        width: 100%;
        box-sizing: border-box;
    }
`

type LabelAndInputProps = {
    name: string
    label: string
    value: string
    handleChange: (value: string) => void
    type?: 'textarea' | 'password'
}

const LabelAndInput = ({
    value, name, label, handleChange, type,
}: LabelAndInputProps) => (
    <LabelAndInputWrapper>
        <Label htmlFor={name}>{label}</Label>
        {type === 'textarea' ? (
            <TextArea rows={5} autoComplete="on" name={name} onChange={(event) => handleChange(event.target.value)} value={value} />
        ) : (
            <Input autoComplete="on" type={type || 'text'} name={name} onChange={(event) => handleChange(event.target.value)} value={value} />
        )}
    </LabelAndInputWrapper>
)

export default LabelAndInput
export { Label }
