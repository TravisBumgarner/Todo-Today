import React from 'react'
import { Routes, Route } from 'react-router'

import { Projects, TodoList, Tasks } from '../pages'

const Router = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<TodoList />}
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