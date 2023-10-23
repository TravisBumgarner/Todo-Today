import { Box, FormControl, IconButton, InputLabel, ListItemIcon, ListItemText, Menu, MenuItem, Select, SvgIcon, Tooltip, css } from '@mui/material'
import { useCallback, useState } from 'react'
import { Icons } from 'sharedComponents'
import { ETaskStatus } from 'types'

import { taskStatusLookup } from 'utilities'
const colorStatus: Record<ETaskStatus, 'secondary' | 'primary' | 'warning' | 'error'> = {
  [ETaskStatus.NEW]: 'secondary',
  [ETaskStatus.IN_PROGRESS]: 'secondary',
  [ETaskStatus.COMPLETED]: 'secondary',
  [ETaskStatus.BLOCKED]: 'warning',
  [ETaskStatus.CANCELED]: 'error'
} as const

const taskStatusIcon = (taskStatus: ETaskStatus) => {
  switch (taskStatus) {
    case ETaskStatus.CANCELED:
      return (
        <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.CANCELED])} />
      )
    case ETaskStatus.BLOCKED:
      return (
        <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.BLOCKED])} />
      )
    case ETaskStatus.NEW:
      return (
        <Icons.OneThirdsCircle css={iconCSS(colorStatus[ETaskStatus.NEW])} />
      )
    case ETaskStatus.IN_PROGRESS:
      return (
        <Icons.TwoThirdsCircle css={iconCSS(colorStatus[ETaskStatus.IN_PROGRESS])} />
      )
    case ETaskStatus.COMPLETED:
      return (
        <Icons.ThreeThirdsCircle css={iconCSS(colorStatus[ETaskStatus.COMPLETED])} />
      )
  }
}

const TaskDropdown = ({ taskStatus, handleStatusChangeCallback }: Props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = useCallback((event: any) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleStatusChange = useCallback((taskStatus: ETaskStatus) => {
    handleStatusChangeCallback(taskStatus)
    handleCloseMenu()
  }, [handleStatusChangeCallback, handleCloseMenu])

  return (
    <>
      <Tooltip title="Change status">
        <IconButton
          onClick={handleOpenMenu}
        >
          {taskStatusIcon(taskStatus)}
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {(Object.keys(ETaskStatus)).map(taskStatus => {
          return (<MenuItem key={taskStatus} onClick={async () => { handleStatusChange(taskStatus as ETaskStatus) }}>
            <ListItemIcon>
              {taskStatusIcon(taskStatus as ETaskStatus)}
            </ListItemIcon>
            <ListItemText>{taskStatusLookup[taskStatus as ETaskStatus]}</ListItemText>
          </MenuItem>)
        })}
      </Menu>
    </>
  )
}

const TaskSelect = ({ handleStatusChangeCallback, taskStatus }: Props) => {
  return (
    <>
      <FormControl fullWidth margin='normal'>
        <InputLabel id="task-status-selector">Status</InputLabel>
        <Select
          label={'Status'}
          labelId="task-status-selector"
          fullWidth
          value={taskStatus}
          css={css`flex-direction: row; display: flex;`}
          onChange={(event) => { handleStatusChangeCallback(event.target.value as ETaskStatus) }}
          renderValue={(value) => {
            return (
              <Box css={selectRenderValueCSS}>
                <SvgIcon color="primary">
                  {taskStatusIcon(value)}
                </SvgIcon>
                {taskStatusLookup[value]}
              </Box>
            )
          }}
        >
          {(Object.keys(ETaskStatus)).map(taskStatus => {
            return (<MenuItem key={taskStatus} value={taskStatus}>
              <ListItemIcon>
                {taskStatusIcon(taskStatus as ETaskStatus)}
              </ListItemIcon>
              <ListItemText>{taskStatusLookup[taskStatus as ETaskStatus]}</ListItemText>
            </MenuItem>)
          })}
        </Select>
      </FormControl>
    </>
  )
}

interface Props {
  handleStatusChangeCallback: (task: ETaskStatus) => void
  taskStatus: ETaskStatus
  showLabel?: boolean
}
const TaskStatusSelector = (props: Props) => {
  if (props.showLabel) {
    return <TaskSelect {...props} />
  }

  return <TaskDropdown {...props} />
}

const selectRenderValueCSS = css`
display: flex;
align-items: center;
 > * {
  margin-right: 0.5rem;
 }
`

const iconCSS = (color: string) => css`
  fill: var(--mui-palette-${color}-main)
  `

export default TaskStatusSelector
