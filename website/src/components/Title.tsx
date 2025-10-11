import { Box, Typography } from '@mui/material'
import { type Theme } from '@mui/material/styles'

const Logo = () => {
  return (
    <Box sx={titleSx}>
      <Typography variant="h1">Todo Today</Typography>
      <Typography variant="h1">Todo Today</Typography>
      <Typography variant="h1">Todo Today</Typography>
      <Typography variant="h1">Todo Today</Typography>
      <Typography variant="h1">Todo Today</Typography>
    </Box>
  )
}

const titleSx = {
  position: 'relative',
  '& h1': {
    whiteSpace: 'nowrap',
    opacity: 0.9,
    letterSpacing: '6px',
    fontSize: '5rem',
    color: (theme: Theme) => theme.palette.primary.main,
    '@media (max-width: 1000px)': {
      fontSize: '3rem'
    },
    '@media (max-width: 600px)': {
      fontSize: '2rem'
    }
  },
  '& h1:nth-of-type(1)': {
    position: 'absolute',
    left: '-2px',
    top: '-2px',
    opacity: 0.8,
    color: (theme: Theme) => theme.palette.warning.main
  },
  '& h1:nth-of-type(2)': {
    position: 'absolute',
    left: '2px',
    top: '2px',
    opacity: 0.8,
    color: (theme: Theme) => theme.palette.secondary.main
  },
  '& h1:nth-of-type(3)': {
    position: 'absolute',
    left: '-2px',
    top: '2px',
    opacity: 0.8,
    color: (theme: Theme) => theme.palette.primary.main
  },
  '& h1:nth-of-type(4)': {
    position: 'absolute',
    left: '2px',
    top: '-2px',
    opacity: 0.8,
    color: (theme: Theme) => theme.palette.error.main
  },
  '& h1:nth-of-type(5)': {
    left: '0px',
    top: '0px',
    color: (theme: Theme) => theme.palette.background.default
  }
}

export default Logo
