'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { useEvents, useCreateEvent, useDeleteEvent } from '@/lib/hooks/useEvents'

type ViewType = 'day' | 'week' | 'month'

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>('week')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventStart, setNewEventStart] = useState('')
  const [newEventEnd, setNewEventEnd] = useState('')

  const createEventMutation = useCreateEvent()

  // Calculate start/end date for queries based on view
  let startDate = currentDate
  let endDate = currentDate
  if (view === 'day') {
    startDate = currentDate
    endDate = currentDate
  } else if (view === 'week') {
    startDate = startOfWeek(currentDate)
    endDate = endOfWeek(currentDate)
  } else if (view === 'month') {
    startDate = startOfMonth(currentDate)
    endDate = endOfMonth(currentDate)
  }

  const { data: events, isLoading } = useEvents(startDate, endDate)

  const next = () => {
    if (view === 'day') setCurrentDate(addDays(currentDate, 1))
    if (view === 'week') setCurrentDate(addDays(currentDate, 7))
    if (view === 'month') setCurrentDate(addDays(currentDate, 30))
  }

  const prev = () => {
    if (view === 'day') setCurrentDate(subDays(currentDate, 1))
    if (view === 'week') setCurrentDate(subDays(currentDate, 7))
    if (view === 'month') setCurrentDate(subDays(currentDate, 30))
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEventTitle || !newEventStart || !newEventEnd) return

    await createEventMutation.mutateAsync({
      title: newEventTitle,
      start_time: new Date(newEventStart).toISOString(),
      end_time: new Date(newEventEnd).toISOString(),
      description: '',
    })

    setIsDialogOpen(false)
    setNewEventTitle('')
    setNewEventStart('')
    setNewEventEnd('')
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
          <span className="text-lg font-medium hidden sm:inline-block">
            {format(currentDate, 'MMMM yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[120px] justify-between">
                <span className="capitalize">{view} view</span>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setView('day')}>Day</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('week')}>Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('month')}>Month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Add an event to your schedule.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Title</label>
                  <Input 
                    placeholder="e.g., Team Sync" 
                    value={newEventTitle} 
                    onChange={(e) => setNewEventTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input 
                      type="datetime-local" 
                      value={newEventStart} 
                      onChange={(e) => setNewEventStart(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input 
                      type="datetime-local" 
                      value={newEventEnd} 
                      onChange={(e) => setNewEventEnd(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createEventMutation.isPending}>
                    {createEventMutation.isPending ? 'Saving...' : 'Save Event'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="flex-1">
        <CardContent className="p-0 flex flex-col h-[600px] overflow-hidden relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50">
              Loading events...
            </div>
          ) : null}
          {view === 'day' && <DayView date={currentDate} events={events || []} />}
          {view === 'week' && <WeekView date={currentDate} events={events || []} />}
          {view === 'month' && <MonthView date={currentDate} events={events || []} />}
        </CardContent>
      </Card>
    </div>
  )
}

function DayView({ date, events }: { date: Date, events: any[] }) {
  const hours = Array.from({ length: 24 }).map((_, i) => i)
  
  // Filter events for this day
  const dayEvents = events.filter(e => {
    const eStart = new Date(e.start_time)
    return eStart.getDate() === date.getDate() && eStart.getMonth() === date.getMonth()
  })

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-[80px_1fr] border-b">
        <div className="border-r p-4 text-center font-medium">
          {format(date, 'EEE')} <br />
          <span className="text-2xl">{format(date, 'd')}</span>
        </div>
        <div className="relative border-r p-4 bg-muted/20">
           {/* All day events could go here */}
        </div>
      </div>
      <div className="relative">
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-[80px_1fr] h-20 border-b">
            <div className="text-xs text-muted-foreground p-2 border-r text-right">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
            <div className="border-r group hover:bg-muted/30 transition-colors relative">
               {dayEvents.filter(e => new Date(e.start_time).getHours() === hour).map(e => (
                 <div key={e.id} className="absolute inset-x-1 top-1 bg-primary/20 border border-primary/50 text-primary-foreground rounded p-1 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                   {e.title}
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeekView({ date, events }: { date: Date, events: any[] }) {
  const days = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(date), i))
  const hours = Array.from({ length: 24 }).map((_, i) => i)

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-[80px_1fr] border-b bg-muted/20 z-10 sticky top-0">
        <div className="border-r p-2"></div>
        <div className="grid grid-cols-7 divide-x">
          {days.map(d => (
            <div key={d.toString()} className="p-2 text-center text-sm">
              <div className="font-medium">{format(d, 'EEE')}</div>
              <div className={`text-2xl mt-1 ${d.getDate() === new Date().getDate() && d.getMonth() === new Date().getMonth() ? 'bg-primary text-primary-foreground rounded-full w-8 h-8 mx-auto flex items-center justify-center' : ''}`}>
                {format(d, 'd')}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto relative">
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-[80px_1fr] h-16 border-b group">
            <div className="text-xs text-muted-foreground p-2 border-r text-right sticky left-0 bg-background z-10">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
            <div className="grid grid-cols-7 divide-x">
              {days.map(d => {
                const hourEvents = events.filter(e => {
                  const eStart = new Date(e.start_time)
                  return eStart.getDate() === d.getDate() && eStart.getMonth() === d.getMonth() && eStart.getHours() === hour
                })
                return (
                  <div key={d.toString()} className="hover:bg-muted/30 transition-colors cursor-pointer border-r last:border-r-0 relative">
                    {hourEvents.map(e => (
                      <div key={e.id} className="absolute inset-x-0.5 top-0.5 bg-primary/20 border border-primary/50 text-primary-foreground rounded p-1 text-[10px] leading-tight overflow-hidden">
                        {e.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MonthView({ date, events }: { date: Date, events: any[] }) {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  // Fill grid to start from Sunday
  const startDay = start.getDay()
  const daysInMonth = end.getDate()
  
  const cells = Array.from({ length: 42 }).map((_, i) => {
    const dayNumber = i - startDay + 1
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return addDays(start, dayNumber - 1)
    }
    return null
  })

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="grid grid-cols-7 border-b bg-muted/20 divide-x text-sm font-medium text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="p-2">{d}</div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-y">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="min-h-[100px] p-2 bg-muted/5" />
          
          const dayEvents = events.filter(e => {
            const eStart = new Date(e.start_time)
            return eStart.getDate() === d.getDate() && eStart.getMonth() === d.getMonth()
          })

          return (
            <div key={i} className="min-h-[100px] p-2 hover:bg-muted/20 transition-colors relative flex flex-col gap-1">
              <span className={`text-sm font-medium ${d.getDate() === new Date().getDate() && d.getMonth() === new Date().getMonth() ? 'text-primary' : 'text-muted-foreground'}`}>
                {d.getDate()}
              </span>
              <div className="flex-1 overflow-hidden space-y-1">
                {dayEvents.map(e => (
                  <div key={e.id} className="bg-primary/20 border border-primary/50 text-primary-foreground rounded px-1 text-[10px] truncate">
                    {format(new Date(e.start_time), 'h:mm a')} {e.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
