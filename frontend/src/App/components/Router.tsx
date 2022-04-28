import React from 'react'
import { Routes, Route } from 'react-router'

import { Projects, TodoList, Tasks, Settings, Reports } from '../pages'

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
            <Route
                path="/reports"
                element={<Reports />}
            />
            <Route
                path="/settings"
                element={<Settings />}
            />
        </Routes>
    )
}

export default Router