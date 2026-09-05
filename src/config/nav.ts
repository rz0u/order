import {
  Home,
  StickyNote,
  CheckSquare,
  Calendar,
  Target,
} from "lucide-react";

export const NAV_LINKS = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "To-Do", href: "/todos", icon: CheckSquare },
  { name: "Sticky Notes", href: "/sticky-notes", icon: StickyNote },
  { name: "Habits", href: "/habits", icon: Target },
];
