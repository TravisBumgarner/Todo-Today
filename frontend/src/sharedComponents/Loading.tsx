import styled from 'styled-components'
import React from 'react'
import { Typography } from '@mui/material'

const ROTATION_TIME_INCREMENT = 15
const TIME_TO_NOT_ROTATE = 50

interface LoadingProps {
    fullscreen?: boolean
}

const LoadingWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    ${({ fullscreen }: { fullscreen?: boolean }) => (fullscreen
        ? `
        width: 100vw;
        position:fixed;
        top: 0;
        left: 0;
        height: 100vh;
        position: fixed;
    `
        : `
        margin: 7rem;
    `)}

    img {
    width: 200px;
    height: 200px;
    margin-bottom: 1em;
}
`

const Loading = ({ fullscreen }: LoadingProps) => {
    const [rotation, setRotation] = React.useState<number>(0)
    const [stopRotationCounter, setStopRotationCounter] = React.useState<number>(0)

    React.useEffect(() => {
        const rotationIntervalId = setInterval(() => {
            if (rotation % 180 === 0) {
                if (stopRotationCounter === TIME_TO_NOT_ROTATE) {
                    setStopRotationCounter(0)
                    setRotation((prev) => prev + 1)
                } else {
                    setStopRotationCounter((prev) => prev + 1)
                }
            } else {
                setRotation((prev) => prev + 1)
            }
        }, ROTATION_TIME_INCREMENT)

        return () => { clearInterval(rotationIntervalId) }
    }, [rotation, stopRotationCounter])

    return (
        <LoadingWrapper fullscreen={fullscreen}>
            <Typography variant="body1" style={{ transform: `rotate(${rotation}deg)` }}>Loading</Typography>
            <Typography variant="h2">One moment please!</Typography>
        </LoadingWrapper>
    )
}

export default Loading
