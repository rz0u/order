import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/lib/actions/events.actions'
import { Database } from '@/types/database.types'

type EventRow = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']

// Query Key factory
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: { start: string; end: string }) => [...eventKeys.lists(), filters] as const,
}

export function useEvents(startDate: Date, endDate: Date) {
  const startStr = startDate.toISOString()
  const endStr = endDate.toISOString()

  return useQuery({
    queryKey: eventKeys.list({ start: startStr, end: endStr }),
    queryFn: () => getEvents(startStr, endStr),
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newEvent: Omit<EventInsert, 'user_id'>) => createEvent(newEvent),
    onMutate: async (newEvent) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: eventKeys.all })

      // Snapshot the previous value (could be multiple lists, so we just invalidate or cautiously update one if we know it)
      // For simplicity in this scale, optimistic update creates a fake ID
      const optimisticEvent = {
        ...newEvent,
        id: `temp-${Date.now()}`,
        user_id: 'temp-user',
        created_at: new Date().toISOString(),
      } as EventRow

      // We don't know the exact date range query active, so we can optimistically update all 'list' queries
      const queries = queryClient.getQueriesData<EventRow[]>({ queryKey: eventKeys.lists() })
      
      queries.forEach(([queryKey, oldData]) => {
        if (oldData) {
          queryClient.setQueryData(queryKey, [...oldData, optimisticEvent])
        }
      })

      return { queries }
    },
    onError: (err, newEvent, context) => {
      // Rollback
      if (context?.queries) {
        context.queries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData)
        })
      }
    },
    onSettled: () => {
      // Refetch
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: eventKeys.all })
      const queries = queryClient.getQueriesData<EventRow[]>({ queryKey: eventKeys.lists() })
      
      queries.forEach(([queryKey, oldData]) => {
        if (oldData) {
          queryClient.setQueryData(queryKey, oldData.filter(e => e.id !== deletedId))
        }
      })

      return { queries }
    },
    onError: (err, deletedId, context) => {
      if (context?.queries) {
        context.queries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all })
    },
  })
}
