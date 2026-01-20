import { signal } from '@preact/signals-react'
import moment from 'moment'
import type { ActiveModal } from './modals/RenderModal'
import type { TDateISODate } from './types'
import { formatDateKeyLookup } from './utilities'

export const messageSignal = signal<{
  confirmText?: string
  cancelText?: string
  text: string
  severity: 'error' | 'warning' | 'info' | 'success'
} | null>(null)

export const activeModalSignal = signal<ActiveModal | null>(null)

export const selectedDateSignal = signal<TDateISODate>(formatDateKeyLookup(moment()))

export const isRestoringSignal = signal<boolean>(false)
