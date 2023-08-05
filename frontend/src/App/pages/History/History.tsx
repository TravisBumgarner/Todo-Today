import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import { Box, Typography } from '@mui/material'

import { EmptyStateDisplay } from 'sharedComponents'
import { bucketTasksByProject } from 'utilities'
import database from 'database'
import { TasksTable } from './components'
import { pageHeaderCSS } from 'theme'

const Tasks = () => {
  const projects = useLiveQuery(async () => await database.projects.toArray())
  const tasks = useLiveQuery(async () => await database.tasks.toArray())

  let Contents
  if (!projects?.length) {
    Contents = <EmptyStateDisplay message="Create a project and then come back!" />
  } else if (tasks?.length) {
    if (tasks.length === 0 || projects.length === 0) {
      Contents = <EmptyStateDisplay message="Too many filters applied!" />
    } else {
      const bucketedTasksByProject = bucketTasksByProject(projects, tasks)
      const TasksByProject = projects
        .sort((a, b) => {
          if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
          if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
          return 0
        })
        .map((project) => {
          return (
            <TasksTable key={project.id} project={project} tasks={bucketedTasksByProject[project.id]} />
          )
        })
      Contents = TasksByProject
    }
  } else {
    Contents = <EmptyStateDisplay message="Create a task!" />
  }

  return (
    <div>
      <Box sx={pageHeaderCSS}>
        <Typography variant="h2">Manage</Typography>
      </Box>
      {Contents}
    </div>
  )
}

export default Tasks
