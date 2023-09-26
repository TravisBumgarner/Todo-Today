import { css } from '@emotion/react'
import { Box } from '@mui/system'

const TrafficLightsHover = () => {
  return (
    <Box css={wrapperCSS}>
       <Box css={circleCSS}/>
       <Box css={circleCSS}/>
       <Box css={circleCSS}/>
    </Box>

  )
}

export default TrafficLightsHover

const wrapperCSS = css`
  display: flex;
  flex-direction: row;
  position: fixed;
  left: 8px;
  top: 9px;
`

const circleCSS = css`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: var(--mui-palette-background-paper);
`
