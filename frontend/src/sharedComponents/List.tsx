import styled from 'styled-components'

const OrderedList = styled.ol`
    color: ${({theme}) => theme.FOREGROUND_TEXT };
`

const UnorderedList = styled.ul`
    color: ${({theme}) => theme.FOREGROUND_TEXT };
`

const ListItem = styled.li`
    line-height: 1.5;
`

export {
    OrderedList,
    UnorderedList,
    ListItem
}
