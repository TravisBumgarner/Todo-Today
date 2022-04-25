import React from 'react'
import styled from 'styled-components'

import { colors } from 'sharedComponents'
import languages from '../languages.json'
import Icon from './Icon'

// https://muffinman.io/blog/catching-the-blur-event-on-an-element-and-its-children/
// Helper function so you can target each input without blur being fired.
const ChildrenBlur = ({ children, onBlur, ...props }: any) => {
    const handleBlur = React.useCallback(
        (e) => {
            const { currentTarget } = e

            // Give browser time to focus the next element
            requestAnimationFrame(() => {
                // Check if the new focused element is a child of the original container
                if (!currentTarget.contains(document.activeElement)) {
                    onBlur()
                }
            })
        },
        [onBlur]
    )

    return (
        <div {...props} onBlur={handleBlur}>
            {children}
        </div>
    )
}

const LanguageLookupWrapper = styled.div`
    border: 2px solid ${colors.PRIMARY.base};
    background-color: ${colors.PRIMARY.lightest};
    margin-top: 0.5rem;
    border-radius: 1rem;
    padding: 1rem;
    position: absolute;
    width: 100%;
    box-sizing: border-box;
`

const ListItem = styled.li`
    height: 2rem;
`

const Label = styled.label`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.PRIMARY.base};
`

const Button = styled.button`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    font-weight: 700;
    width: 100%;
    background-color: transparent;
    border: 0;
    margin: 0.25rem 0;
    text-align: left;
    color: ${colors.TERTIARY.base};

    &:hover {
        cursor: pointer;
    }
`

const LanguageDropdownWrapper = styled.div`
    margin: 0.5rem;
    position: relative;
`

const InputInput = styled.input`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    border: 2px solid;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    font-weight: 700;
    color: ${colors.PRIMARY.base};
    border-color: ${colors.PRIMARY.base};
    width: 100%;
    box-sizing: border-box;
    display: block;
`

const SearchInput = styled.input`
    font-family: 'Comfortaa', cursive;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    font-weight: 700;
    color: ${colors.PRIMARY.base};
    width: 100%;
    box-sizing: border-box;
    display: block;
`

const DropdownList = styled.ul`
    height: 10rem;
    overflow: scroll;
    list-style: none;
    padding: 0.5rem;
    z-index:998;
    margin: 0;
    
`

type LanguageDropdownProps = {
    label: string
}

type Language = {
    name: string;
    nativeName: string;
    isoCode: string;
}

const LanguageDropdown = ({ label }: LanguageDropdownProps) => {
    const [search, setSearch] = React.useState<string>('')
    const [showLanguageLookup, setShowLanguageLookup] = React.useState<boolean>(false)
    const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(null)

    const [filteredLanguages, setFilteredLanguages] = React.useState<{
        name: string;
        nativeName: string;
        isoCode: string;
    }[]>(languages)

    const handleLanguageChange = (newLang: Language) => {
        setSelectedLanguage(newLang)
        setShowLanguageLookup(false)
    }

    // React.useEffect(() => {
    //     if (showLanguageLookup) {
    //         window.addEventListener('click', () => setShowLanguageLookup(false))
    //     }
    //     return () => window.removeEventListener('click', () => setShowLanguageLookup(false))
    // }, [showLanguageLookup])

    React.useEffect(() => {
        setFilteredLanguages(
            languages.filter(({ name, nativeName }) => {
                return (
                    (
                        name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        || nativeName
                            .toLowerCase()
                            .includes(search.toLowerCase())
                    )
                )
            })
        )
    }, [search])

    return (
        <LanguageDropdownWrapper>
            <ChildrenBlur>
                <Label>{label}</Label>
                <InputInput
                    onFocus={() => setShowLanguageLookup(true)}
                    value={selectedLanguage ? selectedLanguage.name : ''}
                />
                {showLanguageLookup
                    ? (
                        <>
                            <LanguageLookupWrapper>

                                <div style={{ display: 'flex' }}>
                                    <SearchInput
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Filter Languages"
                                    />
                                    <Icon name="close" color={colors.PRIMARY.base} onClick={() => setShowLanguageLookup(false)} />
                                </div>
                                <DropdownList>
                                    {filteredLanguages.map(({ name, nativeName, isoCode }) => {
                                        return (
                                            <ListItem
                                                key={isoCode}
                                            >
                                                <Button
                                                    type="button"
                                                    onClick={() => handleLanguageChange({ name, nativeName, isoCode })}
                                                >{name} ({nativeName})
                                                </Button>
                                            </ListItem>
                                        )
                                    })}
                                </DropdownList>
                            </LanguageLookupWrapper>
                            <div
                                onClick={() => setShowLanguageLookup(false)}
                                role="Close"
                                style={{ zIndex: -1, width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0 }}
                            />
                        </>
                    )
                    : ''}
            </ChildrenBlur>
        </LanguageDropdownWrapper>
    )
}

export default LanguageDropdown
