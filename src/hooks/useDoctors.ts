import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true })
      if (error) throw error
      return data || []
    }
  })
}
