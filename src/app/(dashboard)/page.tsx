import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckSquare, Flame, StickyNote } from 'lucide-react'
import Link from 'next/link'

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
      <p className="text-muted-foreground -mt-4">Here is an overview of your workspace today.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/schedule">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next: Team Sync at 2 PM</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/todos">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Across 4 lists</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/habits">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Habit Streaks</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Best: 12 days (Reading)</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/sticky-notes">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sticky Notes</CardTitle>
              <StickyNote className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Active on board</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Connect to Supabase to see real-time updates from your friends here!
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Add Note</CardTitle>
          </CardHeader>
          <CardContent>
             <textarea 
               className="w-full h-32 p-3 bg-yellow-100/50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-yellow-700/50" 
               placeholder="Jot down a quick thought..."
             />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
