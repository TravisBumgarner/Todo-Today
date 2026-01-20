# Setup

1. `npm install` dependencies
1. `npm run dev` local run

# Gotchas

- No HMR for main.ts. Need to restart debugger.

# Builds

Mac builds are done locally. Windows and Linux are handled by GitHub Actions.

1. Bump the version number in package.json and changelog.ts
1. Deploy via Github actions and build locally via `npm run publish`
1. This will upload all the files into a draft release on Github.
1. Publish release. Auto updater will trigger for Mac and Windows.
