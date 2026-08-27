'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

// Mock Data
const INITIAL_NOTES = [
  { id: '1', content: 'Design the new landing page', color: 'bg-yellow-200', x: 50, y: 50 },
  { id: '2', content: 'Call the client at 3PM', color: 'bg-blue-200', x: 300, y: 150 },
  { id: '3', content: 'Grocery shopping', color: 'bg-green-200', x: 100, y: 250 },
]

export default function StickyNotesPage() {
  const [notes, setNotes] = useState(INITIAL_NOTES)

  const handleDragEnd = (event: any) => {
    const { active, delta } = event
    
    setNotes((prev) => 
      prev.map((note) => {
        if (note.id === active.id) {
          return {
            ...note,
            x: note.x + delta.x,
            y: note.y + delta.y,
          }
        }
        return note
      })
    )
  }

  const addNote = () => {
    setNotes([
      ...notes, 
      { id: Date.now().toString(), content: 'New Note', color: 'bg-yellow-200', x: 100, y: 100 }
    ])
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Sticky Notes</h1>
        <Button onClick={addNote}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <DroppableBoard>
          {notes.map((note) => (
            <DraggableNote key={note.id} note={note} />
          ))}
        </DroppableBoard>
      </DndContext>
    </div>
  )
}

function DroppableBoard({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: 'board',
  })

  return (
    <Card className="flex-1 relative overflow-hidden bg-muted/20" ref={setNodeRef}>
      <CardContent className="p-0 w-full h-[600px] relative">
        {children}
      </CardContent>
    </Card>
  )
}

function DraggableNote({ note }: { note: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: note.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    left: note.x,
    top: note.y,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "absolute w-48 h-48 p-4 shadow-md rounded-md border text-sm focus:outline-none cursor-grab active:cursor-grabbing",
        note.color
      )}
    >
      <textarea
        defaultValue={note.content}
        className="w-full h-full bg-transparent resize-none focus:outline-none placeholder:text-black/50"
        placeholder="Type here..."
        onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking textarea
      />
    </div>
  )
}
