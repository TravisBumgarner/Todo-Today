import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'
import * as fs from 'fs'
import * as path from 'path'

// import { FusesPlugin } from "@electron-forge/plugin-fuses";
// import { FuseV1Options, FuseVersion } from "@electron/fuses";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    executableName: 'todo-today',
    icon: 'public/icons/icon', // Electron Forge will automatically append .icns/.ico/.png based on platform
    osxSign:
      process.env.SHOULD_APPLE_SIGN === '1'
        ? {
            identity: process.env.APPLE_IDENTITY,
            optionsForFile: () => {
              return {
                hardenedRuntime: true,
                entitlements: 'entitlements.plist',
              }
            },
          }
        : undefined,
  },

  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl: 'https://example.com/icon.ico', // URL to your .ico file for Squirrel (Windows)
      name: 'todo-today',
      setupExe: 'Todo-Today-win32-x64-setup.exe',
    }),
    new MakerDMG({
      icon: 'public/icons/icon.icns', // For macOS DMG
      name: 'Todo-Today-darwin',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({
      options: {
        icon: 'public/icons/icon.png', // For RPM packages
        name: 'todo-today',
        productName: 'Todo Today',
      },
    }),
    new MakerDeb({
      options: {
        icon: 'public/icons/icon.png', // For DEB packages
        name: 'todo-today',
        productName: 'Todo Today',
      },
    }),
  ],
  plugins: [
    ...(process.env.SHOULD_APPLE_SIGN === '1' ? [new AutoUnpackNativesPlugin({})] : []),
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/main/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    // Commented out temporarily due to plugin conflict with VitePlugin
    // new FusesPlugin({
    //   version: FuseVersion.V1,
    //   [FuseV1Options.RunAsNode]: false,
    //   [FuseV1Options.EnableCookieEncryption]: true,
    //   [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    //   [FuseV1Options.EnableNodeCliInspectArguments]: false,
    //   [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    //   [FuseV1Options.OnlyLoadAppFromAsar]: true,
    // }),
  ],
  hooks: {
    postPackage: async (_forgeConfig, options: { outputPaths: string[]; platform: string; arch: string }) => {
      if (options.platform === 'darwin' && process.env.SHOULD_APPLE_SIGN === '1') {
        const { notarize } = await import('@electron/notarize')
        const appPath = `${options.outputPaths[0]}/Todo Today.app`

        await notarize({
          appPath,
          appleId: process.env.APPLE_ID!,
          appleIdPassword: process.env.APPLE_PASSWORD!,
          teamId: process.env.APPLE_TEAM_ID!,
        })
      }
    },
    postMake: async (_forgeConfig, makeResults) => {
      for (const result of makeResults) {
        for (let i = 0; i < result.artifacts.length; i++) {
          const artifact = result.artifacts[i]
          const dir = path.dirname(artifact)
          const ext = path.extname(artifact)

          let newName: string | null = null
          if (ext === '.deb') {
            newName = `todo-today-linux-${result.arch}.deb`
          } else if (ext === '.rpm') {
            newName = `todo-today-linux-${result.arch}.rpm`
          } else if (ext === '.zip' && result.platform === 'darwin') {
            newName = `Todo-Today-darwin-${result.arch}.zip`
          }

          if (newName) {
            const newPath = path.join(dir, newName)
            fs.renameSync(artifact, newPath)
            result.artifacts[i] = newPath
          }
        }
      }
      return makeResults
    },
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: { owner: 'travisbumgarner', name: 'todo-today' },
        prerelease: false,
        draft: false,
      },
    },
  ],
}

export default config
