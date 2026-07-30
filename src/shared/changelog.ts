export interface ChangelogEntry {
  version: string
  date: string
  changes: {
    category: 'New' | 'Improved' | 'Fixed'
    description: string
  }[]
}
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '4.2.0',
    date: '2026-07-29',
    changes: [
      {
        category: 'New',
        description:
          'History (⌘Y): search everything you have ever worked on by title or details, filter by status and time range, and see how many days each task was on your list',
      },
      {
        category: 'New',
        description: 'Click any day in a task\'s history to jump the todo list straight to it',
      },
    ],
  },
  {
    version: '4.1.0',
    date: '2026-07-27',
    changes: [
      {
        category: 'New',
        description:
          'Keyboard shortcuts: ⌘N new task, ⌘← / ⌘→ previous / next day, ⌘T today, ⌘S select tasks, ⌘M manage recurring, ⌘P copy previous day',
      },
      {
        category: 'New',
        description: 'A collapsed task now shows how far along its checklist is',
      },
      {
        category: 'Improved',
        description:
          'Subtasks have been replaced by checklists in a task\'s details — type "[]" to make one. Existing subtasks were moved over automatically',
      },
      {
        category: 'Improved',
        description: 'The new task form opens with the cursor already in the task field',
      },
      {
        category: 'Fixed',
        description: 'Clearing a task\'s details no longer collapses it while you are still typing',
      },
    ],
  },
  {
    version: '4.0.2',
    date: '2026-07-24',
    changes: [
      {
        category: 'Fixed',
        description: 'The window scrollbar no longer flickers when opening a modal, menu, or dropdown',
      },
      {
        category: 'Improved',
        description: 'Tooltips now dismiss themselves after a short delay instead of lingering while hovered',
      },
    ],
  },
  {
    version: '4.0.1',
    date: '2026-07-24',
    changes: [
      {
        category: 'Improved',
        description: 'Overhauled the user interface',
      },
      {
        category: 'Fixed',
        description: 'Automatic updates were not being detected',
      },
    ],
  },
  {
    version: '3.3.0',
    date: '2026-01-20',
    changes: [
      {
        category: 'Improved',
        description: 'Added status selector to Select Tasks',
      },
      {
        category: 'Fixed',
        description: 'Recurring tasks not showing when expected',
      },
    ],
  },
  {
    version: '3.2.0',
    date: '2026-01-16',
    changes: [
      {
        category: 'New',
        description: 'Added option to set recurring tasks on specific days of the week',
      },
      {
        category: 'New',
        description: 'Added a changelog',
      },
      {
        category: 'Fixed',
        description: 'Modifying a todo list item would not sort it correctly in the list',
      },
      {
        category: 'Fixed',
        description: 'Subtasks now support multiline text input',
      },
    ],
  },
]

export const CURRENT_VERSION = CHANGELOG[0].version
export const CHANGELOG_VERSION_KEY = 'changelog_last_seen_version'
