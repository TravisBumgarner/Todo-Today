import styled from 'styled-components'
import React from 'react'

import colors from './colors'
import { EnumType, TProjectStatus } from 'sharedTypes'
import { projectStatusLookup } from 'utilities'

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
    color-scheme: dark;
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
    background-color: transparent;
    font-weight: 700;
    color: ${colors.FOREGROUND_PRIMARY};
`

const Select = styled.select`
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
    color-scheme: dark;
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

type GenericProps = {
    name: string
    label: string
    value: string
    handleChange: (value: string) => void
}

type InputProps = {
    inputType?: 'password' | 'date'
}

type TextAreaProps = {
    inputType: 'textarea'
}

type SelectProps = {
    inputType: 'select'
    options: EnumType<string>
}

type LabelAndInputProps = GenericProps & (SelectProps | TextAreaProps | InputProps)

const LabelAndInput = (props: LabelAndInputProps) => {
    let InputElement: JSX.Element

    if (props.inputType === 'textarea') {
        const { name, handleChange, value } = props
        InputElement = <TextArea rows={5} autoComplete="on" name={name} onChange={(event) => handleChange(event.target.value)} value={value} />
    }
    else if (props.inputType === 'select') {
        const { options } = props
        console.log(options)
        InputElement = (
            <Select id="browsers">
                {Object.values(options).map(option => <option key={option} value={option}>{projectStatusLookup[option as TProjectStatus]}</option>)}
                
            </Select>
        )
    }
    else {
        const { inputType, handleChange, name, value } = props
        InputElement = <Input autoComplete="on" type={inputType || 'text'} name={name} onChange={(event) => handleChange(event.target.value)} value={value} />
    }

    const { name, label } = props
    return (
        <LabelAndInputWrapper>
            <Label htmlFor={name}>{label}</Label>
            {InputElement}
        </LabelAndInputWrapper>
    )
}

export default LabelAndInput
export { Label }
