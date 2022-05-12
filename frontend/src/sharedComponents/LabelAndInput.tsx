import styled from 'styled-components'
import React from 'react'

import { TEnumType } from 'sharedTypes'

const Input = styled.input`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.FOREGROUND_TEXT};
    border-color: ${({ theme }) => theme.FOREGROUND_TEXT};
    width: 100%;
    box-sizing: border-box;
    color-scheme: dark;
    height: 40px;
`

const Time = styled.input`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.FOREGROUND_TEXT};
    border-color: ${({ theme }) => theme.FOREGROUND_TEXT};
    width: 100%;
    box-sizing: border-box;
    color-scheme: dark;
    height: 40px;
`

const Checkbox = styled.input`
    color-scheme: dark;
    accent-color: ${({ theme }) => theme.FOREGROUND_TEXT};
`

const CheckboxLabel = styled.label`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.ALERT_BUTTON};
    /* margin-left: 0.25rem; */
`

const TextArea = styled.textarea`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.FOREGROUND_TEXT};
    border-color: ${({ theme }) => theme.FOREGROUND_TEXT};
    width: 100%;
    box-sizing: border-box;
`

const Label = styled.label`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.ALERT_BUTTON};
    margin: 0.5rem 0;
`

const Select = styled.select`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${({ theme }) => theme.FOREGROUND_TEXT};
    border-color: ${({ theme }) => theme.FOREGROUND_TEXT};
    width: 100%;
    box-sizing: border-box;
    color-scheme: dark;
`

const LabelAndInputWrapper = styled.div`
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
    label?: string
    value?: string
}

type FileProps = {
    inputType: 'file'
    handleChange: (value: File | null) => void
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
    options: TEnumType<string>
    optionLabels: Record<string, string>,
    handleChange: (value: string) => void
}

type SelectArrayProps = {
    inputType: 'select-array'
    options: { label: string, value: string | number }[]
    handleChange: (value: string) => void
}

type TimeProps = {
    inputType: 'time'
    handleChange: (value: string) => void
}

type LabelAndInputProps = GenericProps & (TimeProps | SelectEnumProps | SelectArrayProps | TextAreaProps | InputProps | CheckboxProps | FileProps)

const LabelAndInput = (props: LabelAndInputProps) => {
    let InputElement: JSX.Element

    if (props.inputType === 'textarea') {
        const { name, handleChange, value } = props
        InputElement = <TextArea rows={5} autoComplete="on" name={name} onChange={(event) => handleChange(event.target.value)} value={value} />
    } else if (props.inputType === 'select-enum') {
        const { options, name, value, handleChange, optionLabels } = props
        InputElement = (
            <Select id={name} value={value} onChange={(event) => handleChange(event.target.value)}>
                {
                    Object.values(options).map((option) => <option key={option} value={option}>{optionLabels[option]}</option>)
                }
            </Select>
        )
    } else if (props.inputType === 'select-array') {
        const { options, name, value, handleChange } = props
        InputElement = (
            <Select id={name} value={value} onChange={(event) => handleChange(event.target.value)}>
                {
                    options.map((option) => <option key={option.label} value={option.value}>{option.label}</option>)
                }
            </Select>
        )
    } else if (props.inputType === 'checkbox') {
        const { options, handleChange } = props
        InputElement = (
            <>
                {options.map((option) => (
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
                        >{option.label}
                        </CheckboxLabel>
                    </div>
                ))}
            </>
        )
    } else if (props.inputType === 'file') {
        const { inputType, handleChange, name, value } = props
        InputElement = (
            <Input
                autoComplete="off"
                type={inputType}
                name={name}
                onChange={(event) => handleChange(event.target.files ? event.target.files[0] : null)}
                value={value}
            />
        )
    } else if(props.inputType === 'time'){
        const { inputType, handleChange, name, value } = props
        InputElement = (
            <Input
            type={'time'}
            name={name}
            onChange={(event) => handleChange(event.target.value)}
            value={value}
        /> 
        )
    } else {
        const { inputType, handleChange, name, value } = props
        InputElement = (
            <Input
                autoComplete="on"
                type={inputType || 'text'}
                name={name}
                onChange={(event) => handleChange(event.target.value)}
                value={value}
            />
        )
    }

    const { name, label } = props
    return (
        <LabelAndInputWrapper>
            {label ? <Label htmlFor={name}>{label}</Label> : null}
            {InputElement}
        </LabelAndInputWrapper>
    )
}

export default LabelAndInput
export { Label }
