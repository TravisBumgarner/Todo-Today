import React from 'react'
import { Routes, Route } from 'react-router'

import { TodoList, Manage, Settings, Reports, Error } from '../pages'

const Router = () => {
    return (
        <Routes>
            <Route
                path="/manage"
                element={<Manage />}
            />
            <Route
                path="/reports"
                element={<Reports />}
            />
            <Route
                path="/settings"
                element={<Settings />}
            />
            <Route
                path="/error"
                element={<Error />}
            />
            <Route
                path="/*"
                element={<TodoList />}
            />
        </Routes>
    )
}

export default Router
