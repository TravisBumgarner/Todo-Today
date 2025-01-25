import { signal } from '@preact/signals-react'
import moment from 'moment'
import { EColorTheme, type TDateISODate, type TSettings } from 'types'
import { formatDateKeyLookup, getLocalStorage } from 'utilities'
import { type ActiveModal } from './modals/RenderModal'

export const messageSignal = signal<{ confirmText?: string, cancelText?: string, text: string, severity: 'error' | 'warning' | 'info' | 'success' } | null>(null)

export const activeModalSignal = signal<ActiveModal | null>(null)

const EMPTY_SETTINGS: TSettings = {
    colorTheme: getLocalStorage('colorTheme') ?? EColorTheme.BEACH
}
export const settingsSignal = signal<TSettings>(EMPTY_SETTINGS)

export const selectedDateSignal = signal<TDateISODate>(formatDateKeyLookup(moment()))

export const isRestoringSignal = signal<boolean>(false)
