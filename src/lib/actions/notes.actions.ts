'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getNotes() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('sticky_notes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching sticky notes:', error)
    return []
  }

  return data
}

export async function createNote(content: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('sticky_notes')
    .insert([{ content, user_id: user.id }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/sticky-notes')
  revalidatePath('/dashboard')
  return data
}

export async function updateNotePosition(id: string, x: number, y: number) {
  const supabase = createClient()
  const { error } = await supabase
    .from('sticky_notes')
    .update({ x_position: x, y_position: y })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function updateNoteColor(id: string, color: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('sticky_notes')
    .update({ color })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/sticky-notes')
}

export async function deleteNote(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('sticky_notes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/sticky-notes')
  revalidatePath('/dashboard')
}
