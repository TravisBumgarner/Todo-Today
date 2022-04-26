import React from 'react'
import { Routes, Route } from 'react-router'

import { Projects, Today, Tasks } from '../pages'

const Router = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Today />}
            />
            <Route
                path="/projects"
                element={<Projects />}
            />
            <Route
                path="/tasks"
                element={<Tasks />}
            />
        </Routes>
    )
}

export default Router