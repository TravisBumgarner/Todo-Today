import { TodoList, History, Error, Successes } from '../pages'
import { context } from 'Context'
import { useContext, useMemo } from 'react'
import { EActivePage } from 'types'

const Router = () => {
  const { state: { activePage } } = useContext(context)
  const page = useMemo(() => {
    switch (activePage) {
      case EActivePage.Home:
        return <TodoList />
      case EActivePage.History:
        return <History />
      case EActivePage.Successes:
        return <Successes />
      default:
        return <Error />
    }
  }, [activePage])

  return page
}

export default Router
