"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/config/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[56px] shrink-0 border-r border-border/50 bg-background/80 backdrop-blur-md h-screen sticky top-0 z-40">
      {/* Logo dot */}
      <div className="flex h-14 items-center justify-center border-b border-border/30">
        <Link href="/" className="group flex items-center justify-center">
          <span
            className="text-xs font-bold tracking-tight opacity-60 group-hover:opacity-100 transition-opacity"
            title="Oök — Home"
          >
            Öö
          </span>
        </Link>
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 py-4 flex-1">
        {NAV_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className={cn(
                "group relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200",
                "hover:bg-accent hover:scale-105",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
              {/* Tooltip */}
              <span className="absolute left-12 whitespace-nowrap text-[10px] px-2 py-1 rounded-md bg-popover text-popover-foreground border border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
