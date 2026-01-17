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
