import { supabase } from './supabase'

// Stub for Lovable generated stores - supabase queries
export const fetchDoctors = async () => {
  const { data, error } = await supabase.from('doctors').select('*')
  if (error) console.error('fetchDoctors error:', error)
  return data || []
}

export const addDoctor = async (data: any) => {
  const { data: newDoctor, error } = await supabase
    .from('doctors')
    .insert(data)
    .select()
    .single()
  if (error) console.error('addDoctor error:', error)
  return newDoctor
}

export const updateDoctor = async (id: string, updates: any) => {
  const { error } = await supabase
    .from('doctors')
    .update(updates)
    .eq('id', id)
  if (error) console.error('updateDoctor error:', error)
}

export const deleteDoctor = async (id: string) => {
  const { error } = await supabase
    .from('doctors')
    .delete()
    .eq('id', id)
  if (error) console.error('deleteDoctor error:', error)
}

// Add more as needed for other modules

