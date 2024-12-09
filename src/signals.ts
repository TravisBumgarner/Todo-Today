import { signal } from '@preact/signals-react'
import { type ActiveModal } from './modals/RenderModal'

const messageSignal = signal<{ confirmText?: string, cancelText?: string, text: string, severity: 'error' | 'warning' | 'info' | 'success' } | null>(null)

const activeModalSignal = signal<ActiveModal | null>(null)

export { activeModalSignal, messageSignal }
