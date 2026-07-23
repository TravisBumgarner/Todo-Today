import Store from 'electron-store'
import type { StoreSchema } from '../shared/types/store'

const defaults: StoreSchema = {
  changelogLastSeenVersion: null,
  showInMenuBar: false,
}

const store = new Store<StoreSchema>({ defaults })

// Helper function to only allow defined keys
export const getStore = () => {
  const data = {
    changelogLastSeenVersion: store.get('changelogLastSeenVersion'),
    showInMenuBar: store.get('showInMenuBar'),
  }
  return data
}

export default store
