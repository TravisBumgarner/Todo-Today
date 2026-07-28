import { useEffect } from 'react'
import {
  copyPreviousDay,
  goToNextDay,
  goToPreviousDay,
  goToToday,
  openNewTaskModal,
  openRecurringTasksModal,
  openSelectTasksModal,
} from '../actions'
import { activeModalSignal } from '../signals'

/** Modifier symbol for shortcut hints in tooltips. */
export const MOD = navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl+'

const isTextEntry = (element: Element | null) => {
  if (!(element instanceof HTMLElement)) return false
  return element.isContentEditable || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
}

/**
 * App-wide shortcuts. Every one of them acts on the todo list, so they stay out
 * of the way while a modal is open — the modal owns the keyboard then.
 *
 * Cmd+M is claimed by the "Minimize" menu role by default; see src/main/menu.ts
 * where that accelerator is moved aside so this handler can see it.
 */
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return
      if (activeModalSignal.value) return

      switch (event.key) {
        case 'n':
          openNewTaskModal()
          break
        case 't':
          goToToday()
          break
        case 's':
          openSelectTasksModal()
          break
        case 'm':
          openRecurringTasksModal()
          break
        case 'p':
          void copyPreviousDay()
          break
        case 'ArrowLeft':
        case 'ArrowRight':
          // In a text field Cmd+Arrow jumps the caret to the start/end of the
          // line — leave that alone rather than yanking the day out from under
          // someone mid-edit.
          if (isTextEntry(document.activeElement)) return
          if (event.key === 'ArrowLeft') goToPreviousDay()
          else goToNextDay()
          break
        default:
          return
      }

      event.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}

export default useKeyboardShortcuts
