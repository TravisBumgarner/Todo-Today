import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useCallback } from 'react'

const Workspaces = (
    {
        isSidebarOpen,
        toggleSidebar

    }: {
        isSidebarOpen: boolean
        toggleSidebar: () => void
    }) => {
    const handleDrawerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        console.log('yolo')
        toggleSidebar()
    }, [toggleSidebar])

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
                            {['Side Projects', 'New Job'].map((text) => (
                                <ListItem button key={text}>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ m: 2 }}
                    >
                        Add Workspace
                    </Button>
                </Box>
            </Drawer>
        </Box>
    )
}

export default Workspaces
