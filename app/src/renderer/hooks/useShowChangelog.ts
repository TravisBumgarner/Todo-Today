import { useSignalEffect, useSignals } from '@preact/signals-react/runtime'
import { CURRENT_VERSION } from '../../shared/changelog'
import { CHANNEL_INVOKES } from '../../shared/types'
import ipcMessenger from '../ipcMessenger'
import { ModalID } from '../modals/index'
import { activeModalSignal } from '../signals'

const useShowChangelog = () => {
  useSignals()
  useSignalEffect(() => {
    ipcMessenger.invoke(CHANNEL_INVOKES.STORE.GET, undefined).then(({ changelogLastSeenVersion }) => {
      if (changelogLastSeenVersion !== CURRENT_VERSION) {
        // Show changelog modal after a short delay to let the app render
        activeModalSignal.value = {
          id: ModalID.CHANGELOG_MODAL,
            showLatestOnly: true,
        }
        // Update the last seen version
        ipcMessenger.invoke(CHANNEL_INVOKES.STORE.SET, {
          changelogLastSeenVersion: CURRENT_VERSION,
        })
      }
    })
  })
}

export default useShowChangelog
