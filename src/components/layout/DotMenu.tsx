'use client'

import { useState, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Palette,
  Hash,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CalendarDays,
  LogOut,
  User,
} from 'lucide-react'
import type { NumeralMode, LayoutMode } from '@/lib/hooks/useAppPreferences'

interface DotMenuProps {
  numeral: NumeralMode
  layout: LayoutMode
  calendarVisible: boolean
  onToggleNumeral: () => void
  onCycleLayout: () => void
  onToggleCalendar: () => void
  onOpenTheme: () => void
}

const LAYOUT_ICONS = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
}

export function DotMenu({
  numeral,
  layout,
  calendarVisible,
  onToggleNumeral,
  onCycleLayout,
  onToggleCalendar,
  onOpenTheme,
}: DotMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const LayoutIcon = LAYOUT_ICONS[layout]

  const controls = [
    {
      id: 'account',
      Icon: User,
      label: 'Account',
      onClick: handleLogout,
      title: 'Logout',
    },
    {
      id: 'theme',
      Icon: Palette,
      label: 'Theme',
      onClick: onOpenTheme,
      title: 'Change theme',
    },
    {
      id: 'numeral',
      Icon: Hash,
      label: numeral === 'day' ? 'Day #' : 'Month #',
      onClick: onToggleNumeral,
      title: `Switch to ${numeral === 'day' ? 'month' : 'day'} number`,
    },
    {
      id: 'layout',
      Icon: LayoutIcon,
      label: layout,
      onClick: onCycleLayout,
      title: 'Cycle layout',
    },
    {
      id: 'calendar',
      Icon: CalendarDays,
      label: calendarVisible ? 'Hide events' : 'Show events',
      onClick: onToggleCalendar,
      title: calendarVisible ? 'Hide today\'s events' : 'Show today\'s events',
      active: calendarVisible,
    },
  ]

  return (
    <div
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Controls — fan out above and below the dot */}
      <div
        className="flex flex-col items-center gap-2.5 transition-all duration-300 ease-out"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.92)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {controls.map(({ id, Icon, label, onClick, title, active }) => (
          <button
            key={id}
            onClick={onClick}
            title={title}
            className={[
              'group relative w-8 h-8 rounded-full flex items-center justify-center',
              'backdrop-blur-md border border-white/20 transition-all duration-200',
              'hover:scale-110 hover:border-white/40',
              active === false
                ? 'bg-white/10 opacity-40 hover:opacity-70'
                : 'bg-white/15 hover:bg-white/25',
            ].join(' ')}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {/* Tooltip */}
            <span className="absolute left-10 whitespace-nowrap text-[10px] px-2 py-0.5 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none capitalize">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* The dot */}
      <div
        className={[
          'w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300',
          'bg-current opacity-30 hover:opacity-70',
          open ? 'opacity-70 scale-125' : '',
        ].join(' ')}
        style={{ boxShadow: open ? '0 0 0 4px rgba(255,255,255,0.1)' : 'none' }}
      />
    </div>
  )
}
