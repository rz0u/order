import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTodoLists, createTodoList, deleteTodoList, createTodo, toggleTodo, deleteTodo } from '../actions/todos.actions'
import { Database } from '@/types/database.types'

type TodoList = Database['public']['Tables']['todo_lists']['Row'] & {
  todos: Database['public']['Tables']['todos']['Row'][]
}

export function useTodos() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['todo_lists'],
    queryFn: getTodoLists,
  })

  const addListMutation = useMutation({
    mutationFn: ({ title, category }: { title: string; category?: string | null }) => createTodoList(title, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_lists'] })
    },
  })

  const deleteListMutation = useMutation({
    mutationFn: (id: string) => deleteTodoList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_lists'] })
    },
  })

  const addTodoMutation = useMutation({
    mutationFn: ({ list_id, content }: { list_id: string; content: string }) => createTodo(list_id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_lists'] })
    },
  })

  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, is_completed }: { id: string; is_completed: boolean }) => toggleTodo(id, is_completed),
    onMutate: async ({ id, is_completed }) => {
      await queryClient.cancelQueries({ queryKey: ['todo_lists'] })
      const previousLists = queryClient.getQueryData<TodoList[]>(['todo_lists'])
      
      if (previousLists) {
        queryClient.setQueryData<TodoList[]>(['todo_lists'], old => {
          if (!old) return old
          return old.map(list => ({
            ...list,
            todos: list.todos.map(todo => 
              todo.id === id ? { ...todo, is_completed } : todo
            )
          }))
        })
      }
      return { previousLists }
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(['todo_lists'], context.previousLists)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_lists'] })
    },
  })

  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_lists'] })
    },
  })

  return {
    lists: query.data ?? [],
    isLoading: query.isLoading,
    addList: addListMutation.mutate,
    deleteList: deleteListMutation.mutate,
    addTodo: addTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
  }
}
