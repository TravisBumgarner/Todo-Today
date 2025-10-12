import ChangeCircle from '@mui/icons-material/ChangeCircle'
import GetAppIcon from '@mui/icons-material/GetApp' // Import icon for download links
import GitHubIcon from '@mui/icons-material/GitHub' // Import GitHub icon
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import Mail from '@mui/icons-material/Mail'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { MAC_DOWNLOAD } from '../consts'

const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #e0e0e0',
        padding: '20px 0',
        marginTop: '60px'
      }}
    >
      <Grid container justifyContent="center" spacing={4}>
        <Grid item>
          <Link href={MAC_DOWNLOAD} download color="inherit" underline="hover">
            <GetAppIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            <Typography variant="body1" component="span">
              Mac
            </Typography>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/changelog" color="inherit" underline="hover">
            <ChangeCircle sx={{ verticalAlign: 'middle', mr: 1 }} />
            <Typography variant="body1" component="span">
              Release Notes
            </Typography>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/contact" color="inherit" underline="hover">
            <Mail sx={{ verticalAlign: 'middle', mr: 1 }} />
            <Typography variant="body1" component="span">
              Support
            </Typography>
          </Link>
        </Grid>
        <Grid item>
          <Link
            target="_blank"
            href="https://github.com/TravisBumgarner/todo-today"
            color="inherit"
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}
          >
            <GitHubIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            <Typography variant="body1" component="span">
              GitHub
            </Typography>
          </Link>
        </Grid>
        <Grid item>
          <Link href="https://travisbumgarner.dev" target="_blank" color="inherit" underline="hover">
            <LightbulbIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            <Typography variant="body1" component="span">
              More from the Creator
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Footer
