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
    color: ${colors.FOREGROUND_TEXT};
    border-color: ${colors.FOREGROUND_TEXT};
    width: 100%;
    box-sizing: border-box;
    color-scheme: dark;
`

const Checkbox = styled.input`
    color-scheme: dark;
    accent-color: ${colors.FOREGROUND_TEXT};
`

const CheckboxLabel = styled.label`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    font-weight: 700;
    color: ${colors.FOREGROUND_TEXT};
    /* margin-left: 0.25rem; */
`

const TextArea = styled.textarea`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.FOREGROUND_TEXT};
    border-color: ${colors.FOREGROUND_TEXT};
    width: 100%;
    box-sizing: border-box;
`

const Label = styled.label`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.FOREGROUND_TEXT};
    margin: 0.5rem 0;
`

const Select = styled.select`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.FOREGROUND_TEXT};
    border-color: ${colors.FOREGROUND_TEXT};
    width: 100%;
    box-sizing: border-box;
    color-scheme: dark;
`

const LabelAndInputWrapper = styled.div`
    margin: 2rem 0;

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
    handleChange: (value: { value: string | number, checked: boolean }) => void
}

type SelectEnumProps = {
    inputType: 'select-enum'
    options: EnumType<string>
    optionLabels: Record<string, string>,
    handleChange: (value: string) => void
}

type SelectArrayProps = {
    inputType: 'select-array'
    options: { label: string, value: string | number }[]
    handleChange: (value: string) => void
}

type LabelAndInputProps = GenericProps & (SelectEnumProps | SelectArrayProps | TextAreaProps | InputProps | CheckboxProps)

const LabelAndInput = (props: LabelAndInputProps) => {
    let InputElement: JSX.Element

    if (props.inputType === 'textarea') {
        const { name, handleChange, value } = props
        InputElement = <TextArea rows={5} autoComplete="on" name={name} onChange={(event) => handleChange(event.target.value)} value={value} />
    }
    else if (props.inputType === 'select-enum') {
        const { options, name, value, handleChange, optionLabels } = props
        InputElement = (
            <Select id={name} value={value} onChange={(event) => handleChange(event.target.value)}>
                {
                    Object.values(options).map(option => <option key={option} value={option}>{optionLabels[option]}</option>)
                }
            </Select>
        )
    }
    else if (props.inputType === 'select-array') {
        const { options, name, value, handleChange } = props
        InputElement = (
            <Select id={name} value={value} onChange={(event) => handleChange(event.target.value)}>
                {
                    options.map(({ label, value }) => <option key={label} value={value}>{label}</option>)
                }
            </Select>
        )
    }
    else if (props.inputType === 'checkbox') {
        const { options, handleChange } = props
        InputElement = (
            <>
                {options.map(option => (
                    <div key={option.name}>
                        <Checkbox
                            type="checkbox"
                            name={option.name}
                            value={option.value}
                            checked={option.checked}
                            onChange={(event) => handleChange({ value: option.value, checked: event.target.checked })}
                        />
                        <CheckboxLabel
                            htmlFor={option.name}
                        >{option.label}</CheckboxLabel>
                    </div>
                ))}
            </>
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
