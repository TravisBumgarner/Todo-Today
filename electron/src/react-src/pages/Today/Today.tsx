import { Box } from '@mui/material'

import { TodoList } from './components'
import { pageCSS } from 'theme'

const Today = () => {
  return (
    <Box css={pageCSS}>
      <TodoList />
    </Box>
  )
}

export default Today
