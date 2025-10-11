import { Description } from '@mui/icons-material'
import { Box, Container, List, ListItem, ListItemText, Typography } from '@mui/material'
import { type FC } from 'react'
import { pageWrapperCSS } from '../theme'

const changelogData: Array<{
  version: string
  date: string
  title: string
  notes: string[]
}> = [
  {
    version: '2.0.0',
    date: 'January 26th, 2025',
    notes: [
      'Todo Today has been rewritten from the ground up.',
      'Timers, history, successes, workspaces, and more have been removed.'
    ],
    title: 'Full Rewrite'
  },
  {
    version: '1.3.2',
    date: 'September 25th, 2024',
    notes: ['Added support for grouping tasks into workspaces'],
    title: 'Workspaces'
  },
  {
    version: '1.2.11',
    date: 'July 5th, 2024',
    notes: ['Added support for Windows automatic updates'],
    title: 'Windows Support'
  },
  {
    version: '1.1.0',
    date: 'October 8th, 2023',
    notes: ['Added timer for tasks and notification system'],
    title: 'Notifications and Timers'
  },
  {
    version: '1.0.0',
    date: 'October 6th, 2023',
    notes: ['App has been in beta testing for almost a year and is now ready for release!'],
    title: 'Initial Release'
  }
]

const Changelog: FC = () => {
  return (
    <Container sx={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>
        Release Notes
      </Typography>
      <Container sx={{ maxWidth: '600px' }}>
        <List>
          {changelogData.map(entry => (
            <Box key={entry.date}>
              <Typography variant="h3">{`${entry.version} - ${entry.title}`}</Typography>
              <Typography variant="h4">{entry.date}</Typography>
              <List>
                {entry.notes.map((note, index) => (
                  <ListItem key={index}>
                    <Description sx={{ marginRight: '0.5rem' }} />
                    <ListItemText primary={note} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </List>
      </Container>
    </Container>
  )
}

export default Changelog
