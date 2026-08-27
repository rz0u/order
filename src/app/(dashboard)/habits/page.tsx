'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Flame, Check } from 'lucide-react'

// Mock Data
const INITIAL_HABITS = [
  { id: '1', title: 'Drink 2L Water', current_streak: 12, completed_today: true },
  { id: '2', title: 'Read 30 mins', current_streak: 5, completed_today: false },
  { id: '3', title: 'Workout', current_streak: 0, completed_today: false },
]

export default function HabitsPage() {
  const [habits, setHabits] = useState(INITIAL_HABITS)

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        return {
          ...h,
          completed_today: !h.completed_today,
          current_streak: h.completed_today ? Math.max(0, h.current_streak - 1) : h.current_streak + 1
        }
      }
      return h
    }))
  }

  return (
    <div className="flex h-full flex-col gap-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Daily Habits</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      <div className="grid gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className={`transition-colors ${habit.completed_today ? 'bg-primary/5 border-primary/20' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant={habit.completed_today ? "default" : "outline"}
                  size="icon" 
                  className={`h-12 w-12 rounded-full ${habit.completed_today ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <Check className={`h-6 w-6 ${habit.completed_today ? 'opacity-100' : 'opacity-20'}`} />
                </Button>
                <div>
                  <h3 className={`text-lg font-semibold ${habit.completed_today ? 'text-muted-foreground line-through decoration-primary/50' : ''}`}>
                    {habit.title}
                  </h3>
                  <div className="flex items-center text-sm text-orange-500 font-medium mt-1">
                    <Flame className="h-4 w-4 mr-1" />
                    {habit.current_streak} Day Streak
                  </div>
                </div>
              </div>
              
              <div className="hidden sm:flex gap-1">
                {/* Visual streak blocks placeholder */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-8 w-6 rounded-sm ${i < (habit.current_streak % 7 || (habit.current_streak > 0 ? 7 : 0)) ? 'bg-primary' : 'bg-muted'}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
