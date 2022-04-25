import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:5001/graphql',
  cache: new InMemoryCache()
});

import { ProjectsList, PlanYourDay, Context, ManageTasks, Navigation, ManageProjects, context } from './components'

const App = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<ProjectsList />} />
        <Route path="/plan_your_day" element={<PlanYourDay />} />
        <Route path="/manage_tasks" element={<ManageTasks />} />
        <Route path="/manage_projects" element={<ManageProjects />} />
      </Routes>
    </>
  )
}

const WrappedApp = () => {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Context>
          <App />
        </Context>
      </ApolloProvider>
    </BrowserRouter>
  )
}

export default WrappedApp
