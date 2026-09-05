'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

type TodoList = Database['public']['Tables']['todo_lists']['Row'] & {
  todos: Database['public']['Tables']['todos']['Row'][]
}

export async function getTodoLists() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('todo_lists')
    .select(`
      *,
      todos (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching todo lists:', error)
    return []
  }

  return data as TodoList[]
}

export async function createTodoList(title: string, category: string | null = null) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('todo_lists')
    .insert([{ title, category, user_id: user.id }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/todos')
  revalidatePath('/dashboard')
  return data
}

export async function deleteTodoList(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('todo_lists').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/todos')
  revalidatePath('/dashboard')
}

export async function createTodo(list_id: string, content: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('todos')
    .insert([{ list_id, content }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/todos')
  revalidatePath('/dashboard')
  return data
}

export async function toggleTodo(id: string, is_completed: boolean) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('todos')
    .update({ is_completed })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/todos')
  revalidatePath('/dashboard')
  return data
}

export async function deleteTodo(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('todos').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/todos')
  revalidatePath('/dashboard')
}
