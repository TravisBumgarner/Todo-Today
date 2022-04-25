import styled from 'styled-components'

import colors from './colors'

const OrderedList = styled.ol`
    color: ${colors.PRIMARY};
`

const UnorderedList = styled.ul`
    color: ${colors.PRIMARY};
`

const ListItem = styled.li`
    line-height: 1.5;
`

export {
    OrderedList,
    UnorderedList,
    ListItem
}
