import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { pageWrapperCSS } from '../theme'

type UpdateType = 'add' | 'update' | 'fix'
type Update = {
  title: string
  date: string
  updates: Record<UpdateType, string[]>
}

const LABELS: Record<UpdateType, string> = {
  add: 'Add',
  update: 'Update',
  fix: 'Fix'
}

const UpdateComponent = ({ title, date, updates }: Update) => {
  // Flatten updates to a single array of { type, text }
  const flatUpdates: { type: UpdateType; text: string }[] = []
  ;(['add', 'update', 'fix'] as UpdateType[]).forEach((type: UpdateType) => {
    updates[type].forEach((text: string) => {
      flatUpdates.push({ type, text })
    })
  })
  return (
    <Box>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
        <time>{date}</time>
      </Typography>
      <List>
        {flatUpdates.map((item, idx) => (
          <ListItem key={item.type + item.text + idx}>
            {LABELS[item.type]}: {item.text}
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

const UPDATES: Update[] = [
  {
    title: 'Full Rewrite',
    date: '2025-01-26',
    updates: {
      add: ['Complete rewrite of Todo Today from the ground up'],
      update: ['Simplified focus on daily task management'],
      fix: ['Removed timers, history, successes, workspaces, and other distracting features']
    }
  },
  {
    title: 'Workspaces',
    date: '2024-09-25',
    updates: {
      add: ['Support for grouping tasks into workspaces'],
      update: [],
      fix: []
    }
  },
  {
    title: 'Windows Support',
    date: '2024-07-05',
    updates: {
      add: ['Support for Windows automatic updates'],
      update: [],
      fix: []
    }
  },
  {
    title: 'Notifications and Timers',
    date: '2023-10-08',
    updates: {
      add: ['Timer for tasks and notification system'],
      update: [],
      fix: []
    }
  },
  {
    title: 'Initial Release',
    date: '2023-10-06',
    updates: {
      add: ['App has been in beta testing for almost a year and is now ready for release!'],
      update: [],
      fix: []
    }
  }
]

const ReleaseNotes = () => {
  return (
    <Box sx={pageWrapperCSS}>
      <Typography variant="h2" gutterBottom>
        Release Notes
      </Typography>
      <Box>
        {UPDATES.map(update => (
          <UpdateComponent key={update.title + update.date} {...update} />
        ))}
      </Box>
    </Box>
  )
}

export default ReleaseNotes
