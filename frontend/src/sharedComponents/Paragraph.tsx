import styled from 'styled-components'

type ParagraphProps = {
    color?: string
}

const Paragraph = styled.p`
    color: ${({theme}) => theme.FOREGROUND_TEXT };
    line-height: 1.5
`

export default Paragraph
