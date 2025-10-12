import LoopIcon from '@mui/icons-material/Loop'
import { Container, IconButton, css } from '@mui/material'

const Loading = () => {
  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        <LoopIcon sx={iconCSS} />
      </IconButton>
    </Container>
  )
}

const iconCSS = css`
  animation: rotating 2s linear infinite;
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export default Loading
