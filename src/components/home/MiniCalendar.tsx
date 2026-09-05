'use client'

import { useMemo } from 'react'

interface MiniCalendarProps {
  /** Events from the schedule (just dates needed) */
  eventDates?: Date[]
}

export function MiniCalendar({ eventDates = [] }: MiniCalendarProps) {
  const now = useMemo(() => new Date(), [])
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Mon-first offset: shift Sunday to 6
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const eventSet = useMemo(() => {
    return new Set(
      eventDates
        .filter((d) => d.getMonth() === month && d.getFullYear() === year)
        .map((d) => d.getDate())
    )
  }, [eventDates, month, year])

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to full grid rows
  while (cells.length % 7 !== 0) cells.push(null)

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="font-mono" style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div
            key={i}
            className="text-[9px] text-center opacity-40 uppercase tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const isToday = day === today
          const hasEvent = eventSet.has(day)

          return (
            <div
              key={i}
              className="relative flex flex-col items-center"
            >
              <span
                className={[
                  'text-[9px] w-4 h-4 flex items-center justify-center rounded-full transition-all',
                  isToday
                    ? 'font-semibold opacity-100 ring-1 ring-current'
                    : 'opacity-50',
                ].join(' ')}
              >
                {day}
              </span>
              {hasEvent && !isToday && (
                <span className="w-0.5 h-0.5 rounded-full bg-current opacity-60 mt-0.5" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
