import { Box, Link, Tooltip } from '@mui/material'
import { FaApple } from 'react-icons/fa'
import { useLocation } from 'react-router'
import { Link as ReactRouterLink } from 'react-router-dom'
import { MAC_DOWNLOAD } from '../consts'

const Header = () => {
  const location = useLocation()

  return (
    <Box sx={{ justifyContent: 'space-between', padding: '16px', display: 'flex' }}>
      <Box>
        {location.pathname !== '/' && (
          <Link sx={{ textDecoration: 'none', fontSize: '30px' }} href="/">
            Todo Today
          </Link>
        )}
      </Box>
      <Box>
        <Tooltip title="Download for Mac">
          <Link component={ReactRouterLink} to={MAC_DOWNLOAD} download>
            <FaApple size={40} />
          </Link>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Header
