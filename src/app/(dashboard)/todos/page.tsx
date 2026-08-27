'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'

// Mock Data
const INITIAL_LISTS = [
  {
    id: '1',
    title: 'Work Tasks',
    category: 'Tasks',
    todos: [
      { id: '101', content: 'Finish project proposal', is_completed: false },
      { id: '102', content: 'Email client', is_completed: true },
    ]
  },
  {
    id: '2',
    title: 'Movies to Watch',
    category: 'Movies',
    todos: [
      { id: '201', content: 'Dune: Part Two', is_completed: false },
      { id: '202', content: 'Oppenheimer', is_completed: true },
    ]
  }
]

export default function TodosPage() {
  const [lists, setLists] = useState(INITIAL_LISTS)

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">To-Do Lists</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <Card key={list.id} className="flex flex-col h-96">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{list.title}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{list.category}</p>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {list.todos.map((todo) => (
                  <div key={todo.id} className="flex items-start gap-3">
                    <Checkbox id={`todo-${todo.id}`} checked={todo.is_completed} className="mt-1" />
                    <label 
                      htmlFor={`todo-${todo.id}`} 
                      className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${todo.is_completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {todo.content}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t bg-muted/20">
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Add a new item..." className="h-8 text-sm" />
                <Button type="submit" size="sm" className="h-8">Add</Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
