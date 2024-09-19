import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material'
import { context } from 'Context'
import db from 'database'
import { useLiveQuery } from 'dexie-react-hooks'
import { ModalID } from 'modals'
import { useCallback, useContext } from 'react'
import { type TWorkspace } from 'types'
import { DEFAULT_WORKSPACE } from 'utilities'

const Workspaces = (
    {
        isSidebarOpen,
        toggleSidebar

    }: {
        isSidebarOpen: boolean
        toggleSidebar: () => void
    }) => {
    const { dispatch } = useContext(context)
    const handleDrawerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        console.log('yolo')
        toggleSidebar()
    }, [toggleSidebar])

    const workspaces = useLiveQuery(async () => {
        return await db.workspaces.toArray()
    }, [])

    const createWorkspace = useCallback(() => {
        dispatch({ type: 'SET_ACTIVE_MODAL', payload: { id: ModalID.ADD_WORKSPACE_MODAL } })
    }, [dispatch])

    return (
        <Box sx={{ display: 'flex' }}>
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
                            {[{ id: DEFAULT_WORKSPACE, name: 'Todo Today' }, ...(workspaces ?? [{} as TWorkspace])].map(({ id, name }) => (
                                <ListItem button key={id}>
                                    <ListItemText primary={name} />
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
        </Box>
    )
}

export default Workspaces
