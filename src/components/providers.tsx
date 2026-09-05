'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './theme-provider'

const ALL_THEMES = [
  'light', 'dark',
  'catppuccin', 'tokyo-night', 'dracula', 'ayu', 'dainty', 'github-dark',
  'atom-one-dark', 'houston', 'night-owl', 'matcha', 'monaspace',
  'month-01', 'month-02', 'month-03', 'month-04', 'month-05', 'month-06',
  'month-07', 'month-08', 'month-09', 'month-10', 'month-11', 'month-12',
]

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        themes={ALL_THEMES}
      >
        {children}
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
