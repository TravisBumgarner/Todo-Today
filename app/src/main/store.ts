import Store from 'electron-store'
import type { StoreSchema } from '../shared/types'

const defaults: StoreSchema = {
  changelogLastSeenVersion: null,
}

const store = new Store<StoreSchema>({ defaults })

// Helper function to only allow defined keys
export const getStore = () => {
  const data = {
    changelogLastSeenVersion: store.get('changelogLastSeenVersion'),
  }
  return data
}

export default store
