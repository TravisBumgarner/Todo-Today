export interface StoreSchema {
  changelogLastSeenVersion: string | null
  // macOS only: run as a menu-bar popover (click the status-bar icon to open,
  // click away to hide) instead of a normal dock/taskbar window.
  showInMenuBar: boolean
  // Selected visual theme (one of EThemeId) and task-list density.
  theme: string
  density: 'compact' | 'comfortable'
}
