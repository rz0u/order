'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useAppPreferences } from '@/lib/hooks/useAppPreferences'
import { useEvents } from '@/lib/hooks/useEvents'

// Home components
import { HeroDate } from '@/components/home/HeroDate'
import { MiniCalendar } from '@/components/home/MiniCalendar'
import { TodayEvents } from '@/components/home/TodayEvents'
import { ColourInfo } from '@/components/home/ColourInfo'

// Layout components
import { DotMenu } from '@/components/layout/DotMenu'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

// Month theme IDs
const MONTHLY_THEME_IDS = [
  'month-01','month-02','month-03','month-04','month-05','month-06',
  'month-07','month-08','month-09','month-10','month-11','month-12',
]

// Auto-detect monthly theme from current month
function getCurrentMonthThemeId(): string {
  const m = new Date().getMonth() + 1 // 1-12
  return `month-${String(m).padStart(2, '0')}`
}

export default function DashboardHome() {
  const { theme, setTheme } = useTheme()
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement>(null)

  const prefs = useAppPreferences()

  // Load today's events for the month range
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  const { data: events = [], isLoading: eventsLoading } = useEvents(monthStart, monthEnd)

  const isMonthlyTheme = MONTHLY_THEME_IDS.includes(theme ?? '')
  const activeThemeId = theme ?? 'light'

  // On first load: auto-apply the current month's theme if no preference saved
  useEffect(() => {
    if (prefs.hydrated && !MONTHLY_THEME_IDS.includes(theme ?? '') && theme === 'light') {
      const autoTheme = getCurrentMonthThemeId()
      setTheme(autoTheme)
    }
  }, [prefs.hydrated]) // eslint-disable-line react-hooks/exhaustive-deps

  const eventDates = events.map((e) => new Date(e.start_time))

  const handleOpenTheme = () => setThemeMenuOpen(true)

  // Compute gradient style for monthly themes
  const monthGradientStyle = isMonthlyTheme
    ? {
        backgroundImage: `var(--month-gradient)`,
        minHeight: '100vh',
      }
    : {
        minHeight: '100vh',
      }

  if (!prefs.hydrated) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div
      className="relative w-full overflow-hidden text-foreground transition-colors duration-700"
      style={monthGradientStyle}
    >
      {/* Dot menu — fixed to vertical centre-left */}
      <DotMenu
        numeral={prefs.numeral}
        layout={prefs.layout}
        calendarVisible={prefs.calendarVisible}
        onToggleNumeral={prefs.toggleNumeral}
        onCycleLayout={prefs.cycleLayout}
        onToggleCalendar={prefs.toggleCalendar}
        onOpenTheme={handleOpenTheme}
      />

      {/* Floating theme toggle — top right, for quick access */}
      <div className="absolute top-6 right-6 z-30 opacity-30 hover:opacity-80 transition-opacity">
        <ThemeToggle />
      </div>

      {/* Hero date — vertical rules + big numeral */}
      <div className="relative" style={{ height: '100vh' }}>
        <HeroDate
          numeral={prefs.numeral}
          layout={prefs.layout}
          isMonthlyTheme={isMonthlyTheme}
        />

        {/* Bottom-left: mini calendar */}
        <div className="absolute bottom-8 left-10 z-10 md:bottom-10 md:left-12">
          <MiniCalendar eventDates={eventDates} />
        </div>

        {/* Bottom-left (above calendar): today's events — only if calendarVisible */}
        {prefs.calendarVisible && (
          <div className="absolute z-10" style={{ bottom: '10rem', left: '2.5rem' }}>
            <TodayEvents
              events={events}
              isLoading={eventsLoading}
              collapsed={prefs.calendarCollapsed}
              onToggleCollapsed={prefs.toggleCalendarCollapsed}
            />
          </div>
        )}

        {/* Bottom-right: colour info (monthly themes only) */}
        <div className="absolute bottom-8 right-8 z-10 md:bottom-10 md:right-10">
          <ColourInfo isMonthlyTheme={isMonthlyTheme} themeId={activeThemeId} />
        </div>
      </div>
    </div>
  )
}
