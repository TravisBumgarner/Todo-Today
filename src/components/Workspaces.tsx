import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { Backdrop, Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { context } from 'Context'
import db from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { ModalID } from 'modals'
import { useCallback, useContext } from 'react'
import { activeModalSignal } from '../signals'

const Workspaces = (
    {
        isSidebarOpen,
        toggleSidebar

    }: {
        isSidebarOpen: boolean
        toggleSidebar: () => void
    }) => {
    const { dispatch, state: { activeWorkspaceId } } = useContext(context)

    const handleDrawerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        toggleSidebar()
    }, [toggleSidebar])

    const workspaces = useLiveQuery(async () => {
        const allWorkspaces = await db.workspaces.toArray()
        return allWorkspaces.sort((a, b) => a.name.localeCompare(b.name))
    })

    const createWorkspace = useCallback(() => {
        activeModalSignal.value = { id: ModalID.ADD_WORKSPACE_MODAL }
    }, [])

    const editWorkspace = useCallback((id: string) => {
        activeModalSignal.value = { id: ModalID.EDIT_WORKSPACE_MODAL, workspaceId: id }
    }, [])

    if (workspaces === undefined) return null

    return (
        <Backdrop onClick={toggleSidebar} open={isSidebarOpen} sx={{ display: 'flex' }}>
            <Drawer
                variant="persistent"
                anchor="left"
                open={isSidebarOpen}
                onClose={toggleSidebar}
                onClick={handleDrawerClick}
            >
                <Box css={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6" sx={{ m: 2 }}>
                            Workspaces
                        </Typography>
                        <List>
                            {workspaces.map(({ id, name }) => (
                                <ListItem
                                    sx={{ bgcolor: activeWorkspaceId === id ? 'background.default' : 'transparent', cursor: 'pointer' }}
                                    onClick={() => { dispatch({ type: 'CHANGE_WORKSPACE', payload: { workspaceId: id } }) }}
                                    key={id}
                                >
                                    <ListItemText primary={name} />
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            editWorkspace(id)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ m: 2 }}
                        onClick={createWorkspace}
                    >
                        Add Workspace
                    </Button>
                </Box>
            </Drawer>
        </Backdrop>
    )
}

export default Workspaces
