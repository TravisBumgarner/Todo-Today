import React from 'react'
import { Routes, Route } from 'react-router'

import { Projects, Today } from '../pages'

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
        </Routes>
    )
}

export default Router