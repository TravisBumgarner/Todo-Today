import { signal } from '@preact/signals-react'

const messageSignal = signal<{ confirmText?: string, cancelText?: string, text: string, severity: 'error' | 'warning' | 'info' | 'success' } | null>(null)

export { messageSignal }
