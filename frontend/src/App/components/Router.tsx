import React from 'react'
import { Routes, Route } from 'react-router'

import { TodoList, History, Settings, Error } from '../pages'

const Router = () => {
    return (
        <Routes>
            <Route
                path="/history"
                element={<History />}
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
