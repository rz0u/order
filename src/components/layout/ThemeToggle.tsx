"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const themes = [
  // ── Basics ──
  { id: "light",         label: "Light",          color: "#ffffff",  group: "basic" },
  { id: "dark",          label: "Dark",           color: "#18181b",  group: "basic" },

  // ── Editor Themes ──
  { id: "catppuccin",    label: "Catppuccin",     color: "#cba6f7",  group: "editor" },
  { id: "tokyo-night",   label: "Tokyo Night",    color: "#7aa2f7",  group: "editor" },
  { id: "dracula",       label: "Dracula",        color: "#bd93f9",  group: "editor" },
  { id: "ayu",           label: "Ayu",            color: "#e6b450",  group: "editor" },
  { id: "dainty",        label: "Dainty",         color: "#6cb5e4",  group: "editor" },
  { id: "github-dark",   label: "GitHub Dark",    color: "#2f81f7",  group: "editor" },
  { id: "atom-one-dark", label: "Atom One Dark",  color: "#61afef",  group: "editor" },
  { id: "houston",       label: "Houston",        color: "#ff5d01",  group: "editor" },
  { id: "night-owl",     label: "Night Owl",      color: "#82aaff",  group: "editor" },
  { id: "matcha",        label: "Matcha",         color: "#8fbc8f",  group: "editor" },
  { id: "monaspace",     label: "Monaspace",      color: "#79c0ff",  group: "editor" },

  // ── Monthly Colourways (gradient) ──
  { id: "month-01", label: "January — Midnight Navy",   color: "#1B3352", group: "monthly" },
  { id: "month-02", label: "February — Lavender Purple", color: "#9B7FD4", group: "monthly" },
  { id: "month-03", label: "March — Forest Green",      color: "#4A7C59", group: "monthly" },
  { id: "month-04", label: "April — Sky Blue",          color: "#71B7D8", group: "monthly" },
  { id: "month-05", label: "May — Hot Pink",            color: "#E85D8A", group: "monthly" },
  { id: "month-06", label: "June — Golden Straw",       color: "#E6C16E", group: "monthly" },
  { id: "month-07", label: "July — Coral Red",          color: "#E84B35", group: "monthly" },
  { id: "month-08", label: "August — Burnt Orange",     color: "#C96623", group: "monthly" },
  { id: "month-09", label: "September — Olive",         color: "#8A8B4A", group: "monthly" },
  { id: "month-10", label: "October — Rust",            color: "#B84A20", group: "monthly" },
  { id: "month-11", label: "November — Deep Purple",    color: "#4A3966", group: "monthly" },
  { id: "month-12", label: "December — Dark Teal",      color: "#1B4A40", group: "monthly" },
] as const

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const basicThemes = themes.filter((t) => t.group === "basic")
  const editorThemes = themes.filter((t) => t.group === "editor")
  const monthlyThemes = themes.filter((t) => t.group === "monthly")

  const renderItem = (t: typeof themes[number]) => (
    <DropdownMenuItem
      key={t.id}
      onClick={() => setTheme(t.id)}
      className={cn("gap-2", theme === t.id && "bg-accent")}
    >
      <div
        className="h-3.5 w-3.5 rounded-full border shrink-0"
        style={{ backgroundColor: t.color }}
      />
      <span className="truncate text-xs">{t.label}</span>
      {theme === t.id && (
        <span className="ml-auto text-[10px] text-muted-foreground">✓</span>
      )}
    </DropdownMenuItem>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative outline-none"
        )}
      >
        <Palette className="h-4 w-4" />
        <span className="sr-only">Change theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">
            Basics
          </DropdownMenuLabel>
          {basicThemes.map(renderItem)}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">
            Editor Themes
          </DropdownMenuLabel>
          {editorThemes.map(renderItem)}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider">
            Monthly Colourways
          </DropdownMenuLabel>
          {monthlyThemes.map(renderItem)}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
