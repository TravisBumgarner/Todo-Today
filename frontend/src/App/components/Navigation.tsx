import React from 'react'
import {
    Link as RouterLink,
    LinkProps as RouterLinkProps,
} from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';


interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

const ListItemLink = (props: ListItemLinkProps) => {
    const { icon, primary, to } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(function Link(
                itemProps,
                ref,
            ) {
                return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
            }),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}

const Navigation = () => {
    return (
        <>
            <List aria-label="main mailbox folders">
                <ListItemLink to="/" primary="Today" />
                <ListItemLink to="/projects" primary="Projects" />
            </List>
        </>
    )
}

export default Navigation