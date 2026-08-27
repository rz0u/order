'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus } from 'lucide-react'

// Mock Data
const FEED_POSTS = [
  { id: '1', user: 'Alice', avatar: '', content: 'Just hit a 30-day streak for reading!', time: '2h ago' },
  { id: '2', user: 'Bob', avatar: '', content: 'Completed my project proposal early. Now onto the next task.', time: '5h ago' },
  { id: '3', user: 'Charlie', avatar: '', content: 'Added 5 new movies to my watchlist.', time: '1d ago' },
]

export default function SocialPage() {
  return (
    <div className="flex h-full flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
      {/* Feed Column */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Social Feed</h1>
        
        <Card className="mb-4">
          <CardContent className="p-4 flex gap-4">
            <Avatar>
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input placeholder="Share an update with your friends..." className="flex-1" />
              <Button>Post</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {FEED_POSTS.map((post) => (
            <Card key={post.id}>
              <CardHeader className="p-4 pb-2 flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarFallback>{post.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{post.user}</span>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm">{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Friends Column */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight">Friends</h2>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Find friends by username..." className="pl-8" />
        </div>

        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Friends</h3>
            
            {['Alice', 'Bob', 'Charlie'].map(friend => (
              <div key={friend} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{friend[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{friend}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
