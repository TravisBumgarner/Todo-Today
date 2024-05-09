import { useContext } from 'react'

import { context } from 'Context'
import { DoMode, QueueMode } from './components'

const Today = () => {
  const { state: { workMode } } = useContext(context)

  return workMode === 'do' ? <DoMode /> : <QueueMode />
}

export default Today
