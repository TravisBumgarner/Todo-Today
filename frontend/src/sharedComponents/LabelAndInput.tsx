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
}

type InputProps = {
    inputType?: 'password' | 'date'
    handleChange: (value: string) => void
}

type TextAreaProps = {
    inputType: 'textarea'
    handleChange: (value: string) => void
}

type CheckboxProps = {
    inputType: 'checkbox'
    options: { label: string, name: string, value: string | number, checked: boolean }[]
    handleChange: (value: {name: string, checked: boolean}) => void
}

type SelectProps = {
    inputType: 'select'
    options: EnumType<string> | { label: string, value: string | number }[]
    handleChange: (value: string) => void
}

type LabelAndInputProps = GenericProps & (SelectProps | TextAreaProps | InputProps | CheckboxProps)

const LabelAndInput = (props: LabelAndInputProps) => {
    let InputElement: JSX.Element

    if (props.inputType === 'textarea') {
        const { name, handleChange, value } = props
        InputElement = <TextArea rows={5} autoComplete="on" name={name} onChange={(event) => handleChange(event.target.value)} value={value} />
    }
    else if (props.inputType === 'select') {
        const { options, name, value, handleChange } = props
        InputElement = (
            <Select id={name} value={value} onChange={(event) => handleChange(event.target.value)}>
                {
                    Array.isArray(options)
                        ? options.map(({ label, value }) => <option key={label} value={value}>{label}</option>)
                        : Object.values(options).map(option => <option key={option} value={option}>{projectStatusLookup[option as TProjectStatus]}</option>)
                }

            </Select>
        )
    }
    else if (props.inputType === 'checkbox') {
        const { options, name, value, handleChange } = props
        InputElement = (
            <div>
                {options.map(option => (
                    <div key={option.name}>
                        <input
                            type="checkbox"
                            name={option.name}
                            value={option.name}
                            checked={option.checked}
                            onChange={(event) => handleChange({name: option.name, checked: event.target.checked})}
                        />
                        <label htmlFor={option.name}>{option.label}</label>
                    </div>
                ))}
            </div>
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
