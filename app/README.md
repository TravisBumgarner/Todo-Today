# Setup

1. `npm install` dependencies
1. `npm run start` local run

# Gotchas

- No HMR for main.ts. Need to restart debugger.

# Dev Notes

**Deploy**

1. Bump the version (patch | minor | major) `npm version patch`
1. Commit
1. Push commit and tag to GitHub (triggers CI build + publish) `git push && git push --tags`
