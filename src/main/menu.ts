import { Menu, app, shell, type MenuItemConstructorOptions } from 'electron'

import { isMac } from './config'

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  {
    label: 'File',
    submenu: [...(!isMac ? [{ role: 'about' }] : []), isMac ? { role: 'close' } : { role: 'quit' }],
  },
  {
    label: 'Edit',
    submenu: [
      // The details editor keeps its own undo stack (Chromium's loses track of
      // the checkboxes it edits by hand), so Cmd+Z has to reach the renderer
      // instead of being swallowed by the menu. The shortcut still shows here.
      { role: 'undo', registerAccelerator: false },
      { role: 'redo', registerAccelerator: false },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
            },
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      // Minimize normally owns Cmd+M, and a menu accelerator wins before the
      // renderer ever sees the key. Shift it so Cmd+M can open Recurring Tasks
      // (see useKeyboardShortcuts).
      { role: 'minimize', accelerator: 'CmdOrCtrl+Shift+M' },
      { role: 'zoom' },
      ...(isMac
        ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
        : [{ role: 'close' }]),
    ],
  },
  {
    label: 'Support',
    submenu: [
      {
        label: 'Website',
        click: async () => {
          await shell.openExternal('https://travisbumgarner.dev/marketing/todo')
        },
      },
    ],
  },
]

const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[])

export default menu
