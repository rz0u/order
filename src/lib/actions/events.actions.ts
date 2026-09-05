'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']
type EventRow = Database['public']['Tables']['events']['Row']

export async function getEvents(startDate: string, endDate: string): Promise<EventRow[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .gte('start_time', startDate)
    .lte('end_time', endDate)
    .order('start_time', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function createEvent(event: Omit<EventInsert, 'user_id'>): Promise<EventRow> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('events')
    .insert({ ...event, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateEvent(id: string, event: EventUpdate): Promise<EventRow> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .eq('user_id', user.id) // Extra safety check
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}
