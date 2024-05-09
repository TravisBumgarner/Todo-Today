import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import moment from 'moment'
import { useCallback, useContext, useEffect, useState } from 'react'

import { context } from 'Context'
import database from 'database'
import { ButtonWrapper } from 'sharedComponents'
import { DATE_ISO_DATE_MOMENT_STRING, type TDateISODate, type TProject, type TSuccess } from 'types'
import { formatDateKeyLookup, sortStrings } from 'utilities'
import Modal from './Modal'

interface Props {
  successId: string
}

const EditSuccessModal = ({ successId }: Props) => {
  const { dispatch } = useContext(context)
  const [description, setDescription] = useState<string>('')
  const [projectId, setProjectId] = useState<TProject['id'] | ''>('')
  const [date, setDate] = useState<TSuccess['date'] | ''>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const projects = useLiveQuery(async () => {
    return await database.projects.toArray()
  }, [])

  useEffect(() => {
    void database
      .successes.where('id').equals(successId).first()
      .then((s: TSuccess | undefined) => {
        if (!s) return

        setDate(s.date)
        setDescription(s.description)
        setProjectId(s.projectId)
        setIsLoading(false)
      })
  }, [successId])

  const handleSubmit = useCallback(async () => {
    const editedSuccess = {
      description,
      id: successId,
      projectId,
      date: formatDateKeyLookup(moment(date))
    }
    await database.successes.put(editedSuccess, [successId])
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch, description, projectId, successId, date])

  const handleCancel = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_MODAL' })
  }, [dispatch])

  const projectSelectOptions = projects ? projects.sort((a, b) => sortStrings(a.title, b.title)).map(({ id, title }) => ({ value: id, label: title })) : []
  projectSelectOptions.unshift({ value: '', label: 'Select a Project' })

  return (
    <Modal
      title="Add Success"
      showModal={true}
    >
      {
        isLoading
          ? <Typography variant="body1">One sec</Typography>
          : (
            <form>
              <TextField
                multiline
                fullWidth
                margin='normal'
                label="Description"
                name="description"
                value={description}
                onChange={(event) => { setDescription(event.target.value) }}
              />
              <FormControl fullWidth margin='normal'>
                <InputLabel id="edit-success-modal-project-select">Project</InputLabel>
                <Select
                  label="Project"
                  labelId="edit-success-modal-project-select"
                  fullWidth
                  value={projectId}
                  onChange={(event) => { setProjectId(event.target.value) }}
                >
                  {projectSelectOptions.map(({ label, value }) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Date"
                fullWidth
                margin='normal'
                name="date"
                value={moment(date, DATE_ISO_DATE_MOMENT_STRING).format('YYYY-MM-DD')}
                type="date"
                onChange={(event) => { setDate(event.target.value as TDateISODate) }}
              />
              <ButtonWrapper>

                <Button
                  fullWidth
                  key="cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  fullWidth
                  disabled={description.length === 0}
                  key="save"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </ButtonWrapper>
            </form>
          )
      }
    </Modal>
  )
}

export default EditSuccessModal
