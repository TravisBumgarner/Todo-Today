// bootstrap.js
// One-shot project setup: verifies the toolchain, installs dependencies,
// and makes sure a .env file exists so `npm run dev` works from a fresh clone.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

function run(command) {
  console.log(`> ${command}`)
  execSync(command, { cwd: rootDir, stdio: 'inherit' })
}

// 1. Verify the Node major version is supported.
const requiredMajor = 20
const currentMajor = Number(process.versions.node.split('.')[0])
if (currentMajor < requiredMajor) {
  console.error(`Node ${requiredMajor}+ is required, but this is ${process.versions.node}.`)
  process.exit(1)
}

// 2. Install dependencies.
run('npm install')

// 3. Ensure a .env exists (electron-forge make/publish read it via dotenv).
const envPath = path.join(rootDir, '.env')
const envExamplePath = path.join(rootDir, '.env.example')
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log('Created .env from .env.example — fill in the required values.')
  } else {
    fs.writeFileSync(envPath, '')
    console.log('Created an empty .env — add the required values before packaging.')
  }
}

console.log('Bootstrap complete. Run `npm run dev` to start the app.')

export default {}
