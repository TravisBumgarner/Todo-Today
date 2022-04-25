import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const InternalLink = styled(Link)`
`

type Props = {
}

const LINKS = [
    { text: "Home", to: "/" },
    { text: 'PlanYourDay', to: '/plan_your_day' },
    { text: 'Manage Projects', to: '/manage_projects' },
    { text: 'Manage Tasks', to: '/manage_tasks' },
]

const Navigation = (props: Props) => {
    return (
        <ul>
            {LINKS.map(({ text, to }) => {
                return <Link key={to} to={to}>{text}</Link>
            })}
        </ul>
    )
}
export default Navigation