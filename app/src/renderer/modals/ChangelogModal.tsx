import { Box, Button, Chip, Divider, List, ListItem, Stack, Typography } from '@mui/material'
import { CHANGELOG, type ChangelogEntry } from '../../shared/changelog'
import { activeModalSignal } from '../signals'
import { SPACING } from '../styles/consts'
import Modal from "./Modal";


export interface ChangelogModalProps {
    showLatestOnly?: boolean
}

const ChangelogModal = (props: ChangelogModalProps) => {
    const entries = props.showLatestOnly ? [CHANGELOG[0]] : CHANGELOG

    const getCategoryColor = (category: ChangelogEntry['changes'][0]['category']): 'primary' | 'secondary' | 'info' => {
        switch (category) {
            case 'New':
                return 'primary'
            case 'Improved':
                return 'secondary'
            case 'Fixed':
                return 'info'
        }
    }

    const handleClose = () => {
        activeModalSignal.value = null
    }

    return (
        <Modal showModal={true} title={props.showLatestOnly ? "What's New" : 'Changelog'}>
            <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {props.showLatestOnly && (
                    <Box sx={{ mb: SPACING.MEDIUM.PX }}>
                        <Typography variant="body2" color="textSecondary">
                            Welcome to version {entries[0].version}! Here&apos;s what&apos;s new:
                        </Typography>
                    </Box>
                )}

                <Stack spacing={SPACING.MEDIUM.PX}>
                    {entries.map((entry, idx) => (
                        <Box key={entry.version}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: SPACING.SMALL.PX }}>
                                <Typography variant="h6">Version {entry.version}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {new Date(entry.date).toLocaleDateString()}
                                </Typography>
                            </Stack>

                            <List dense disablePadding>
                                {entry.changes.map((change, changeIdx) => (
                                    // biome-ignore lint/suspicious/noArrayIndexKey: It's a changelog.
                                    <ListItem key={changeIdx} disableGutters sx={{ alignItems: 'flex-start' }}>
                                        <Stack direction="row" spacing={SPACING.SMALL.PX}>
                                            <Chip
                                                label={change.category}
                                                color={getCategoryColor(change.category)}
                                                size="small"
                                                sx={{ minWidth: 80 }}
                                            />
                                            <Typography variant="body2">{change.description}</Typography>
                                        </Stack>
                                    </ListItem>
                                ))}
                            </List>

                            {idx < entries.length - 1 && <Divider sx={{ mt: SPACING.MEDIUM.PX }} />}
                        </Box>
                    ))}
                </Stack>

                <Box sx={{ mt: SPACING.LARGE.PX }}>
                    <Button variant="contained" onClick={handleClose} fullWidth>
                        {props.showLatestOnly ? 'Got it!' : 'Close'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default ChangelogModal