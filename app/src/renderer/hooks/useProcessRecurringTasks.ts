import { useEffect } from 'react'
import { queries } from '../database'

/**
 * Hook to process recurring tasks for today on app load and when window regains focus
 */
export const useProcessRecurringTasks = () => {
  useEffect(() => {
    // Process on mount (app load)
    queries.processRecurringTasksForToday()

    // Process when window becomes visible again (app comes back from idle/background)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        queries.processRecurringTasksForToday()
      }
    }

    const handleFocus = () => {
      queries.processRecurringTasksForToday()
    }

    // Listen for visibility changes (tab/window becomes visible)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    // Listen for window focus events
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])
}
