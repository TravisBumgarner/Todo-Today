import * as React from 'react'
import {
    useQuery,
} from "@apollo/client";

import { context } from '.'
import { GET_PROJECTS } from '../queries';
import { Project } from '../../../../sharedTypes';

const ProjectsList = () => {
    const { loading, error, data } = useQuery(GET_PROJECTS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const projectsByStatus = Object.values(data.projects as Project[]).reduce((accum, { title, status }) => {
        if (!accum[status]) accum[status] = []
        accum[status].push(title)
        return accum
    }, {} as Record<string, string[]>)

    return <ul>
        {Object.keys(projectsByStatus).map(status => {
            return (
                <ul key={status}>
                    <li>{status}</li>
                    <ul>{projectsByStatus[status].map(project => <li key={project}>{project}</li>)}</ul>
                </ul>
            )
        })}
    </ul>
}

export default ProjectsList