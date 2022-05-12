const isMac = process.platform === 'darwin'
const isDev = process.env.NODE_ENV === 'local'
const isDebugProduction = true // Set to True to debug

export {
    isMac,
    isDev,
    isDebugProduction
}