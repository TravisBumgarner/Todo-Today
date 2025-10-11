# Setup

1. `npm install` dependencies
1. `npm run start` local run

# Gotchas

- No HMR for main.ts. Need to restart debugger.

# Dev Notes

**Deploy**

```
npm version patch --workspace app --git-tag-version=false
git add package.json app/package.json package-lock.json app/package-lock.json
git commit -m "chore: bump version"
git tag v$(node -p "require('./app/package.json').version")
git push origin HEAD --tags
```
