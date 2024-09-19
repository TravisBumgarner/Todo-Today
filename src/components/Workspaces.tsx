import AddIcon from '@mui/icons-material/Add'
import { Backdrop, Box, Button, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material'
import { context } from 'Context'
import db from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { ModalID } from 'modals'
import { useCallback, useContext } from 'react'
import { DEFAULT_WORKSPACE_ID } from 'utilities'

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
        return [{ id: DEFAULT_WORKSPACE_ID, name: 'Todo Today' }, ...allWorkspaces].sort((a, b) => a.name.localeCompare(b.name))
    })

    const createWorkspace = useCallback(() => {
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_WORKSPACE_MODAL } })
    }, [dispatch])

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
                                    sx={{ bgcolor: activeWorkspaceId === id ? 'background.default' : 'transparent' }}
                                    color="warning"
                                    // css={{ backgroundColor: activeWorkspaceId === id ? 'red'  : 'transparent' }}
                                    onClick={() => { dispatch({ type: 'CHANGE_WORKSPACE', payload: { workspaceId: id } }) }}
                                    key={id}
                                >
                                    <ListItemText color="warning" primary={name} />
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
