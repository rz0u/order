'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

export async function getHabits() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching habits:', error)
    return []
  }

  return data
}

export async function createHabit(title: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('habits')
    .insert([{ title, user_id: user.id }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/habits')
  revalidatePath('/dashboard')
  return data
}

export async function deleteHabit(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/habits')
  revalidatePath('/dashboard')
}

// In a real app we'd also have actions for `habit_logs` here, but 
// for the dashboard overview we just need the habits list.
