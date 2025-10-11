import { typedIpcMain } from './index'
import { CHANNEL } from '../../shared/types'

typedIpcMain.handle(CHANNEL.WEE_WOO, async (_event, params) => {
  console.log('msg received in main:', params)
  return {
    type: 'add_user',
    success: true,
  }
})
