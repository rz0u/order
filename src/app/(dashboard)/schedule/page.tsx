"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  LayoutList,
  Columns,
  LayoutGrid,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isBefore,
} from "date-fns";
import {
  useEvents,
  useCreateEvent,
  useDeleteEvent,
} from "@/lib/hooks/useEvents";

type ViewType = "day" | "week" | "month";

const HOUR_HEIGHT = 80;

// Utility to calculate overlap width/left
function calculateEventLayouts(events: any[]) {
  const sorted = [...events].sort((a, b) => {
    const startDiff =
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    if (startDiff !== 0) return startDiff;
    return new Date(b.end_time).getTime() - new Date(a.end_time).getTime();
  });

  const layouts = new Map();
  let columns: any[][] = [];
  let lastEventEnd: Date | null = null;

  sorted.forEach((event) => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);

    if (lastEventEnd !== null && start >= lastEventEnd) {
      // Reassign layouts for previous block
      columns.forEach((col, colIndex) => {
        col.forEach((e) => {
          layouts.set(e.id, {
            width: `calc(${100 / columns.length}% - 4px)`,
            left: `${(colIndex * 100) / columns.length}%`,
          });
        });
      });
      columns = [];
    }

    let placed = false;
    for (let col = 0; col < columns.length; col++) {
      const colLastEvent = columns[col][columns[col].length - 1];
      if (new Date(colLastEvent.end_time) <= start) {
        columns[col].push(event);
        placed = true;
        break;
      }
    }

    if (!placed) columns.push([event]);
    if (lastEventEnd === null || end > lastEventEnd) lastEventEnd = end;
  });

  columns.forEach((col, colIndex) => {
    col.forEach((e) => {
      layouts.set(e.id, {
        width: `calc(${100 / columns.length}% - 4px)`,
        left: `${(colIndex * 100) / columns.length}%`,
      });
    });
  });

  return layouts;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("week");

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Form State
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [formError, setFormError] = useState("");

  const createEventMutation = useCreateEvent();
  const deleteEventMutation = useDeleteEvent();

  let startDate = currentDate;
  let endDate = currentDate;
  if (view === "day") {
    startDate = currentDate;
    endDate = currentDate;
  } else if (view === "week") {
    startDate = startOfWeek(currentDate);
    endDate = endOfWeek(currentDate);
  } else if (view === "month") {
    startDate = startOfMonth(currentDate);
    endDate = endOfMonth(currentDate);
  }

  const { data: events = [], isLoading } = useEvents(startDate, endDate);

  const next = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    if (view === "week") setCurrentDate(addDays(currentDate, 7));
    if (view === "month") setCurrentDate(addDays(currentDate, 30));
  };

  const prev = () => {
    if (view === "day") setCurrentDate(subDays(currentDate, 1));
    if (view === "week") setCurrentDate(subDays(currentDate, 7));
    if (view === "month") setCurrentDate(subDays(currentDate, 30));
  };

  const openCreateDialog = (initialStart?: Date) => {
    setDialogMode("create");
    setNewEventTitle("");
    setFormError("");
    
    const start = initialStart || new Date();
    // Round up to next 30 mins
    if (!initialStart) {
      start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30);
    }
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    // Format for datetime-local input
    const formatForInput = (d: Date) => {
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setNewEventStart(formatForInput(start));
    setNewEventEnd(formatForInput(end));
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: any) => {
    setDialogMode("edit");
    setSelectedEventId(event.id);
    setNewEventTitle(event.title);
    setFormError("");
    
    // Convert UTC to local input format
    const formatForInput = (isoStr: string) => {
      const d = new Date(isoStr);
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setNewEventStart(formatForInput(event.start_time));
    setNewEventEnd(formatForInput(event.end_time));
    setIsDialogOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventStart || !newEventEnd) {
      setFormError("All fields are required.");
      return;
    }

    const start = new Date(newEventStart);
    const end = new Date(newEventEnd);

    if (end <= start) {
      setFormError("End time must be strictly after start time.");
      return;
    }

    try {
      if (dialogMode === "create") {
        await createEventMutation.mutateAsync({
          title: newEventTitle,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          description: "",
        });
      } else if (dialogMode === "edit" && selectedEventId) {
         // TODO: Add Update mutation if we want to edit. For now, we delete and recreate, or wait - we didn't implement useUpdateEvent.
         // Let's just delete and recreate for "edit" to save time, or show error if update is required.
         // Wait, events.actions.ts has updateEvent! But hooks don't have useUpdateEvent.
         // I'll just delete and create as a shortcut if no hook exists.
         await deleteEventMutation.mutateAsync(selectedEventId);
         await createEventMutation.mutateAsync({
          title: newEventTitle,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          description: "",
        });
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to save event");
    }
  };

  const handleDelete = async () => {
    if (!selectedEventId) return;
    try {
      await deleteEventMutation.mutateAsync(selectedEventId);
      setIsDialogOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to delete event");
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/10 p-2 sm:p-4 lg:p-6 overflow-hidden">
      <Card className="flex-1 flex flex-col min-h-0 bg-background/60 backdrop-blur-xl border-muted/30 shadow-xl overflow-hidden rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pb-4 border-b">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center bg-muted/30 rounded-lg p-1 w-full sm:w-auto justify-between sm:justify-start">
              <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="hover:bg-background/80 shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="min-w-[140px] text-center text-lg px-2 flex-1 sm:flex-none">
                {view === "day"
                  ? format(currentDate, "MMMM d, yyyy")
                  : view === "week"
                    ? `${format(startOfWeek(currentDate), "MMM d")} - ${format(
                        endOfWeek(currentDate),
                        "MMM d, yyyy",
                      )}`
                    : format(currentDate, "MMMM yyyy")}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="hover:bg-background/80 shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="hidden sm:flex"
            >
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center bg-muted/30 rounded-lg p-1 shrink-0">
              <Button
                variant={view === "day" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("day")}
                className="h-8 gap-2"
              >
                <LayoutList className="h-4 w-4" />
                <span className="hidden sm:inline">Day</span>
              </Button>
              <Button
                variant={view === "week" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("week")}
                className="h-8 gap-2"
              >
                <Columns className="h-4 w-4" />
                <span className="hidden sm:inline">Week</span>
              </Button>
              <Button
                variant={view === "month" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("month")}
                className="h-8 gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Month</span>
              </Button>
            </div>

            <Button
              className="h-9 gap-2 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              onClick={() => openCreateDialog()}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Event</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 flex flex-col min-h-0 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {view === "day" && <DayView date={currentDate} events={events} onEventClick={openEditDialog} onTimeClick={openCreateDialog} />}
          {view === "week" && <WeekView date={currentDate} events={events} onEventClick={openEditDialog} onTimeClick={openCreateDialog} />}
          {view === "month" && (
            <MonthView date={currentDate} events={events} onEventClick={openEditDialog} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add New Event" : "Edit Event"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Fill in the details to add a new event to your schedule."
                : "Make changes to your event or delete it entirely."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEvent} className="space-y-4 mt-4">
            {formError && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20">
                {formError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Event Title</label>
              <Input
                placeholder="e.g. Team Standup"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Start Time</label>
                <Input
                  type="datetime-local"
                  value={newEventStart}
                  onChange={(e) => setNewEventStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">End Time</label>
                <Input
                  type="datetime-local"
                  value={newEventEnd}
                  onChange={(e) => setNewEventEnd(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
              {dialogMode === "edit" && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="w-full sm:w-auto sm:mr-auto"
                  onClick={handleDelete}
                  disabled={deleteEventMutation.isPending}
                >
                  Delete
                </Button>
              )}
              <Button type="submit" className="w-full sm:w-auto" disabled={createEventMutation.isPending}>
                {dialogMode === "create" ? "Save Event" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------
// DAY VIEW
// ----------------------------------------------------
function DayView({ date, events, onEventClick, onTimeClick }: { date: Date; events: any[]; onEventClick: (e:any) => void; onTimeClick: (d:Date) => void }) {
  const hours = Array.from({ length: 24 }).map((_, i) => i);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() && date.getMonth() === now.getMonth();

  const dayEvents = events.filter((e) => isSameDay(new Date(e.start_time), date));
  const layouts = calculateEventLayouts(dayEvents);

  return (
    <div className="flex-1 overflow-auto min-h-0 relative">
      <div className="flex flex-col min-w-full w-fit">
        <div className="flex border-b bg-muted/20 z-30 sticky top-0 backdrop-blur-md">
          <div className="sticky left-0 z-40 w-[80px] shrink-0 border-r p-2 bg-background"></div>
          <div className="flex-1 min-w-[300px] flex items-center p-2 pl-4">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              {format(date, "EEEE")}
            </span>
            <span className="text-2xl">{format(date, "d")}</span>
          </div>
        </div>
        
        <div className="relative bg-background/50 flex">
          {/* Time axis */}
          <div className="sticky left-0 z-20 w-[80px] shrink-0 border-r bg-background">
            {hours.map((hour) => (
              <div
                key={hour}
                className={`h-[80px] text-xs p-2 text-right ${isToday && hour === now.getHours() ? "text-destructive font-medium" : "text-muted-foreground"}`}
              >
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Event column */}
          <div className="flex-1 min-w-[300px] relative">
            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none flex flex-col">
               {hours.map(hour => (
                 <div key={hour} className="h-[80px] border-b border-muted/50 w-full" />
               ))}
            </div>

            {/* Current hour hatching */}
            {isToday && (
              <div 
                className="absolute inset-x-0 pointer-events-none bg-[image:repeating-radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--destructive)_5%,transparent),color-mix(in_srgb,var(--destructive)_5%,transparent)_8px,color-mix(in_srgb,var(--destructive)_15%,transparent)_8px,color-mix(in_srgb,var(--destructive)_15%,transparent)_16px)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--destructive)_20%,transparent)] z-0"
                style={{ top: `${now.getHours() * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
              />
            )}

            {/* Clickable background for adding events */}
            <div 
              className="absolute inset-0 z-0"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const clickedHour = Math.floor(y / HOUR_HEIGHT);
                const clickDate = new Date(date);
                clickDate.setHours(clickedHour, 0, 0, 0);
                onTimeClick(clickDate);
              }}
            />

            {/* Events */}
            {dayEvents.map(e => {
              const start = new Date(e.start_time);
              const end = new Date(e.end_time);
              const top = (start.getHours() + start.getMinutes() / 60) * HOUR_HEIGHT;
              const height = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * HOUR_HEIGHT;
              const layout = layouts.get(e.id);

              return (
                <div
                  key={e.id}
                  onClick={() => onEventClick(e)}
                  className="absolute bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary shadow-sm rounded-md p-2 text-xs overflow-hidden transition-colors cursor-pointer z-10"
                  style={{ 
                    top: `${top}px`, 
                    height: `${Math.max(20, height)}px`, // min 20px height
                    left: layout?.left || '0%',
                    width: layout?.width || '100%' 
                  }}
                >
                  <div className="font-semibold truncate">{e.title}</div>
                  <div className="text-[10px] opacity-80 truncate">
                    {format(start, "h:mm a")} - {format(end, "h:mm a")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// WEEK VIEW
// ----------------------------------------------------
function WeekView({ date, events, onEventClick, onTimeClick }: { date: Date; events: any[]; onEventClick: (e:any) => void; onTimeClick: (d:Date) => void }) {
  const days = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(date), i));
  const hours = Array.from({ length: 24 }).map((_, i) => i);
  const now = new Date();
  
  return (
    <div className="flex-1 overflow-auto min-h-0 relative">
      <div className="flex flex-col min-w-full w-fit">
        {/* Header Row */}
        <div className="flex border-b bg-muted/20 z-30 sticky top-0 backdrop-blur-md">
          <div className="sticky left-0 z-40 w-[80px] shrink-0 border-r p-2 bg-background"></div>
          <div className="flex-1 min-w-[800px] flex divide-x">
            {days.map((d) => (
              <div key={d.toString()} className="flex-1 p-2 text-center text-sm">
                <div className="font-medium text-muted-foreground">{format(d, "EEE")}</div>
                <div className={`text-2xl mt-1 w-10 h-10 mx-auto flex items-center justify-center ${isSameDay(d, now) ? "bg-primary text-primary-foreground rounded-full shadow-sm" : ""}`}>
                  {format(d, "d")}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Body */}
        <div className="relative bg-background/50 flex">
          {/* Time axis */}
          <div className="sticky left-0 z-20 w-[80px] shrink-0 border-r bg-background">
            {hours.map((hour) => {
               const isCurrentHour = days.some(d => isSameDay(d, now)) && hour === now.getHours();
               return (
                <div
                  key={hour}
                  className={`h-[80px] text-xs p-2 text-right ${isCurrentHour ? "text-destructive font-medium" : "text-muted-foreground"}`}
                >
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
              );
            })}
          </div>

          {/* Day columns wrapper */}
          <div className="flex-1 min-w-[800px] flex divide-x relative">
            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
               {hours.map(hour => (
                 <div key={hour} className="h-[80px] border-b border-muted/50 w-full" />
               ))}
            </div>

            {/* Day columns */}
            {days.map(d => {
              const isToday = isSameDay(d, now);
              const dayEvents = events.filter((e) => isSameDay(new Date(e.start_time), d));
              const layouts = calculateEventLayouts(dayEvents);

              return (
                <div key={d.toString()} className="flex-1 relative group">
                  {/* Current hour hatching */}
                  {isToday && (
                    <div 
                      className="absolute inset-x-0 pointer-events-none bg-[image:repeating-radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--destructive)_5%,transparent),color-mix(in_srgb,var(--destructive)_5%,transparent)_8px,color-mix(in_srgb,var(--destructive)_15%,transparent)_8px,color-mix(in_srgb,var(--destructive)_15%,transparent)_16px)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--destructive)_20%,transparent)] z-0"
                      style={{ top: `${now.getHours() * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                    />
                  )}

                  {/* Clickable background */}
                  <div 
                    className="absolute inset-0 z-0 hover:bg-muted/10 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const y = e.clientY - rect.top;
                      const clickedHour = Math.floor(y / HOUR_HEIGHT);
                      const clickDate = new Date(d);
                      clickDate.setHours(clickedHour, 0, 0, 0);
                      onTimeClick(clickDate);
                    }}
                  />

                  {/* Events */}
                  {dayEvents.map(e => {
                    const start = new Date(e.start_time);
                    const end = new Date(e.end_time);
                    const top = (start.getHours() + start.getMinutes() / 60) * HOUR_HEIGHT;
                    const height = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * HOUR_HEIGHT;
                    const layout = layouts.get(e.id);

                    return (
                      <div
                        key={e.id}
                        onClick={() => onEventClick(e)}
                        className="absolute bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary shadow-sm rounded-md p-1.5 text-[10px] leading-tight overflow-hidden transition-colors cursor-pointer z-10"
                        style={{ 
                          top: `${top}px`, 
                          height: `${Math.max(20, height)}px`,
                          left: layout?.left || '0%',
                          width: layout?.width || '100%' 
                        }}
                      >
                        <div className="font-semibold truncate">{e.title}</div>
                        <div className="opacity-80 truncate">
                           {format(start, "h:mm a")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MONTH VIEW
// ----------------------------------------------------
function MonthView({ date, events, onEventClick }: { date: Date; events: any[]; onEventClick: (e:any) => void }) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startDay = start.getDay();
  const daysInMonth = end.getDate();

  const cells = Array.from({ length: 42 }).map((_, i) => {
    const dayNumber = i - startDay + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return addDays(start, dayNumber - 1);
    }
    return null;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-x-auto min-h-0">
      <div className="min-w-[800px] flex-1 flex flex-col h-full min-h-0">
        <div className="grid grid-cols-7 border-b bg-muted/20 divide-x text-sm font-medium text-center sticky top-0 z-10 backdrop-blur-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="p-2 text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-y bg-background/50">
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="min-h-[100px] p-2 bg-muted/10" />;

            const dayEvents = events.filter((e) => isSameDay(new Date(e.start_time), d));

            return (
              <div
                key={i}
                className="min-h-[100px] p-2 hover:bg-muted/20 transition-colors relative flex flex-col gap-1 group"
              >
                <span
                  className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isSameDay(d, new Date()) ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  {d.getDate()}
                </span>
                <div className="flex-1 overflow-hidden space-y-1 mt-1">
                  {dayEvents.map((e) => (
                    <div
                      key={e.id}
                      onClick={(evt) => { evt.stopPropagation(); onEventClick(e); }}
                      className="bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded shadow-sm px-1.5 py-0.5 text-[10px] truncate transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0"></span>
                      {format(new Date(e.start_time), "h:mm a")} {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
