import { Menu, app, shell, type MenuItemConstructorOptions } from 'electron'

import { isDev, isMac } from './config'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      // { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      // { role: 'hideOthers' },
      // { role: 'unhide' },
      // { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      { role: 'reload' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
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
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ]
        : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [

      ...(isDev
        ? [
          { role: 'forceReload' },
          { role: 'toggleDevTools' }]
        : []
      ),
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ]
        : [
          { role: 'close' }
        ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Website',
        click: async () => { await shell.openExternal('http://todo.sillysideprojects.com/') }
      },
      {
        label: 'Changelog',
        click: async () => { await shell.openExternal('http://todo.sillysideprojects.com/changelog') }
      },
      {
        label: 'Contact',
        click: async () => { await shell.openExternal('http://todo.sillysideprojects.com/support') }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[])

export default menu
