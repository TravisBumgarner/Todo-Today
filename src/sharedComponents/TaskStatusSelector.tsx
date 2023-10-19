import { Box, FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SvgIcon, Typography, css } from '@mui/material'
import { Icons } from 'sharedComponents'
import { ETaskStatus } from 'types'

import ContentPaste from '@mui/icons-material/ContentPaste'
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

interface Props {
  handleStatusChange: (task: ETaskStatus) => void
  taskStatus: ETaskStatus
  showLabel?: boolean
}
const TaskStatusSelector = ({ taskStatus, handleStatusChange, showLabel }: Props) => {
  return (
    <>
      <FormControl fullWidth margin='normal'>
        {showLabel && <InputLabel id="task-status-selector">Status</InputLabel>}
        <Select
          disableUnderline={!showLabel}
          label={showLabel ? 'Status' : null}
          labelId="task-status-selector"
          fullWidth
          value={taskStatus}
          css={css`flex-direction: row; display: flex;`}
          onChange={(event) => { handleStatusChange(event.target.value as ETaskStatus) }}
          renderValue={(value) => {
            return (
              <Box css={selectRenderValueCSS}>
                <SvgIcon color="primary">
                  {taskStatusIcon(value)}
                </SvgIcon>
                {showLabel && taskStatusLookup[value]}
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
