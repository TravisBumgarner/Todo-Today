import { createContext, useReducer, type Dispatch } from 'react'

export interface State {
  restoreInProgress: boolean
}

const EMPTY_STATE: State = {
  restoreInProgress: false
}

interface RestoreStarted {
  type: 'RESTORE_STARTED'
}

interface RestoreEnded {
  type: 'RESTORE_ENDED'
}

export type Action =
  | RestoreStarted
  | RestoreEnded

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'RESTORE_STARTED': {
      return { ...state, restoreInProgress: true }
    }
    case 'RESTORE_ENDED': {
      return { ...state, restoreInProgress: false }
    }
    default:
      throw new Error(`Unexpected action: ${JSON.stringify(action)}`)
  }
}

const context = createContext(
  {
    state: EMPTY_STATE,
    dispatch: () => { }
  } as {
    state: State
    dispatch: Dispatch<Action>
  }
)

const ResultsContext = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE)
  const { Provider } = context

  return (
    <Provider value={{ state, dispatch }}>
      {children}
    </Provider>
  )
}

export default ResultsContext
export {
  context
}
