'use client'

import { useState, useEffect, useCallback } from 'react'

export type NumeralMode = 'day' | 'month'
export type LayoutMode = 'left' | 'center' | 'right'

interface AppPreferences {
  numeral: NumeralMode
  layout: LayoutMode
  calendarVisible: boolean
  calendarCollapsed: boolean
}

const STORAGE_KEY = 'ook-app-preferences'

const DEFAULTS: AppPreferences = {
  numeral: 'day',
  layout: 'left',
  calendarVisible: true,
  calendarCollapsed: false,
}

export function useAppPreferences() {
  const [prefs, setPrefs] = useState<AppPreferences>(DEFAULTS)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage after mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppPreferences>
        setPrefs((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  const update = useCallback(<K extends keyof AppPreferences>(
    key: K,
    value: AppPreferences[K]
  ) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const toggleNumeral = useCallback(() => {
    setPrefs((prev) => {
      const next = { ...prev, numeral: prev.numeral === 'day' ? 'month' : 'day' }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const cycleLayout = useCallback(() => {
    setPrefs((prev) => {
      const order: LayoutMode[] = ['left', 'center', 'right']
      const idx = order.indexOf(prev.layout)
      const next = { ...prev, layout: order[(idx + 1) % order.length] }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const toggleCalendar = useCallback(() => {
    update('calendarVisible', !prefs.calendarVisible)
  }, [prefs.calendarVisible, update])

  const toggleCalendarCollapsed = useCallback(() => {
    update('calendarCollapsed', !prefs.calendarCollapsed)
  }, [prefs.calendarCollapsed, update])

  return {
    ...prefs,
    hydrated,
    update,
    toggleNumeral,
    cycleLayout,
    toggleCalendar,
    toggleCalendarCollapsed,
  }
}
