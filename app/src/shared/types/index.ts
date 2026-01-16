import type { StoreSchema } from './store'

export const CHANNEL_INVOKES = {
  STORE: {
    GET: 'store:get',
    SET: 'store:set',
  },
} as const

export type Invokes = {
  [CHANNEL_INVOKES.STORE.GET]: {
    args: undefined
    result: StoreSchema
  }
  [CHANNEL_INVOKES.STORE.SET]: {
    args: Partial<StoreSchema>
    result: { success: boolean }
  }
}
