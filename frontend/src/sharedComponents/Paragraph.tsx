import styled from 'styled-components'

import colors from './colors'

type ParagraphProps = {
    color?: string
}

const Paragraph = styled.p`
    ${({ color }: ParagraphProps) => `color: ${color || colors.PRIMARY.base};`}
    line-height: 1.5
`

export default Paragraph
