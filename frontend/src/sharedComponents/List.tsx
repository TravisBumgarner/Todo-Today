import styled from 'styled-components'

const OrderedList = styled.ol`
    color: ${({ theme }) => theme.FOREGROUND};
`

const UnorderedList = styled.ul`
    color: ${({ theme }) => theme.FOREGROUND};
`

const ListItem = styled.li`
    line-height: 1.5;
`

export {
    OrderedList,
    UnorderedList,
    ListItem
}
