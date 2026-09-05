'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Event {
  id: string
  title: string
  start_time: string
  end_time: string
}

interface TodayEventsProps {
  events: Event[]
  isLoading: boolean
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function TodayEvents({
  events,
  isLoading,
  collapsed,
  onToggleCollapsed,
}: TodayEventsProps) {
  const todayEvents = events.filter((e) => {
    const d = new Date(e.start_time)
    const now = new Date()
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  })

  return (
    <div
      className="text-[11px] leading-relaxed"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Header */}
      <button
        onClick={onToggleCollapsed}
        className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity mb-2 group"
      >
        <span className="uppercase tracking-[0.2em] text-[9px] font-medium">
          Today
        </span>
        {collapsed ? (
          <ChevronDown className="w-2.5 h-2.5" />
        ) : (
          <ChevronUp className="w-2.5 h-2.5" />
        )}
      </button>

      {!collapsed && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="opacity-40 text-[10px]">Loading…</div>
          ) : todayEvents.length === 0 ? (
            <div className="opacity-35 text-[10px] italic">No events today</div>
          ) : (
            todayEvents.map((e) => (
              <div key={e.id} className="flex gap-2 items-start opacity-70">
                <span className="opacity-60 shrink-0 tabular-nums">
                  {format(new Date(e.start_time), 'HH:mm')}
                </span>
                <span className="truncate">{e.title}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
