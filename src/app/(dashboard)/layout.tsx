'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopHeader } from '@/components/layout/TopHeader'
import { BottomNav } from '@/components/layout/BottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar: hidden on home page (DotMenu takes over) */}
      {!isHome && <Sidebar />}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Top header: hidden on home page */}
        {!isHome && <TopHeader />}

        <main className={isHome ? 'flex-1' : 'flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-8'}>
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile only, not on home) */}
      {!isHome && <BottomNav />}
    </div>
  )
}
