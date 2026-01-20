import { Route, Routes } from 'react-router'

import { Changelog, Contact, Error as ErrorPage, LandingPage, NotFound } from '../pages'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Router
