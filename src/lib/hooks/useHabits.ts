import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHabits, createHabit, deleteHabit } from '../actions/habits.actions'

export function useHabits() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['habits'],
    queryFn: getHabits,
  })

  const addHabitMutation = useMutation({
    mutationFn: (title: string) => createHabit(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })

  const deleteHabitMutation = useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })

  return {
    habits: query.data ?? [],
    isLoading: query.isLoading,
    addHabit: addHabitMutation.mutate,
    deleteHabit: deleteHabitMutation.mutate,
  }
}
