export const isMac = process.platform === 'darwin'
export const isDev = process.env.NODE_ENV === 'local'
export const isDebugProduction = true // Set to True to debug