import { 
  Home, 
  StickyNote, 
  CheckSquare, 
  Calendar, 
  Target, 
  Users 
} from 'lucide-react'

export const NAV_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Sticky Notes', href: '/sticky-notes', icon: StickyNote },
  { name: 'To-Do', href: '/todos', icon: CheckSquare },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'Social', href: '/social', icon: Users },
]
