'use client'

import { useMemo } from 'react'
import type { NumeralMode, LayoutMode } from '@/lib/hooks/useAppPreferences'

interface HeroDateProps {
  numeral: NumeralMode
  layout: LayoutMode
  isMonthlyTheme: boolean
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

// Column rules: thin vertical lines dividing the viewport
function VerticalRules() {
  return (
    <div className="absolute inset-0 pointer-events-none flex" aria-hidden>
      {/* 4 vertical rules creating 5 unequal columns */}
      {[15, 34, 58, 78].map((pct) => (
        <div
          key={pct}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${pct}%`,
            background: 'currentColor',
            opacity: 0.15,
          }}
        />
      ))}
    </div>
  )
}

export function HeroDate({ numeral, layout, isMonthlyTheme }: HeroDateProps) {
  const now = useMemo(() => new Date(), [])
  const dayOfMonth = now.getDate()
  const monthIndex = now.getMonth()
  const year = now.getFullYear()
  const dayOfWeek = DAYS[now.getDay()]
  const monthName = MONTHS[monthIndex]

  const displayNumeral = numeral === 'day' ? dayOfMonth : monthIndex + 1

  // Layout-aware positioning for the date block
  const layoutConfig = {
    left: {
      wrapper: 'justify-start',
      // Push into the second column (between rule 1 and rule 2)
      style: { paddingLeft: '17%' },
    },
    center: {
      wrapper: 'justify-center',
      style: {},
    },
    right: {
      wrapper: 'justify-end',
      style: { paddingRight: '10%' },
    },
  }

  const { wrapper, style } = layoutConfig[layout]

  return (
    <div className="absolute inset-0 flex flex-col">
      <VerticalRules />

      {/* Year — top area */}
      <div className="relative z-10 pt-8 pl-8 md:pt-10 md:pl-10">
        <span
          className="text-[11px] font-light tracking-[0.25em] uppercase opacity-60"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {year}
        </span>
      </div>

      {/* Main date block — vertically centred, layout-aware */}
      <div className={`relative z-10 flex-1 flex items-center ${wrapper}`} style={style}>
        <div className="flex flex-col">
          {/* Month name — small label above the numeral */}
          <span
            className="text-sm md:text-base font-light tracking-[0.2em] uppercase opacity-70 mb-1"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {monthName}
          </span>

          {/* The big number */}
          <span
            className="leading-none select-none"
            style={{
              fontFamily: 'var(--font-display, var(--font-sans))',
              fontSize: 'clamp(140px, 22vw, 320px)',
              fontWeight: 400,
              lineHeight: 0.85,
              letterSpacing: '-0.02em',
            }}
          >
            {displayNumeral}
          </span>

          {/* Day of week — improvement over benchmark */}
          <span
            className="mt-3 text-xs md:text-sm font-light tracking-[0.3em] uppercase opacity-55"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {dayOfWeek}
          </span>
        </div>
      </div>
    </div>
  )
}
