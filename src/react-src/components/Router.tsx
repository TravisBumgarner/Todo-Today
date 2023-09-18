import { Routes, Route } from 'react-router'

import { TodoList, History, Error, Successes } from '../pages'

const Router = () => {
  return (
    <Routes>
      <Route
        path="/successess"
        element={<Successes />}
      />
      <Route
        path="/history"
        element={<History />}
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
