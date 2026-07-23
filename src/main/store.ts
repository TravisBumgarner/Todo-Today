import Store from 'electron-store'
import type { StoreSchema } from '../shared/types/store'

const defaults: StoreSchema = {
  changelogLastSeenVersion: null,
  minimizeToTray: false,
}

const store = new Store<StoreSchema>({ defaults })

// Helper function to only allow defined keys
export const getStore = () => {
  const data = {
    changelogLastSeenVersion: store.get('changelogLastSeenVersion'),
    minimizeToTray: store.get('minimizeToTray'),
  }
  return data
}

export default store
