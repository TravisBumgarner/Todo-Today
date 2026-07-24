import Store from 'electron-store'
import type { StoreSchema } from '../shared/types/store'

const defaults: StoreSchema = {
  changelogLastSeenVersion: null,
  showInMenuBar: false,
  theme: 'today',
  density: 'compact',
}

const store = new Store<StoreSchema>({ defaults })

// Helper function to only allow defined keys
export const getStore = () => {
  const data = {
    changelogLastSeenVersion: store.get('changelogLastSeenVersion'),
    showInMenuBar: store.get('showInMenuBar'),
    theme: store.get('theme'),
    density: store.get('density'),
  }
  return data
}

export default store
