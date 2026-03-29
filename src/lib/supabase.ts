import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://tqgxswswbbrvgwdvohhg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZ3hzd3N3YmJydmd3ZHZvaGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NzU1MjEsImV4cCI6MjA4MjI1MTUyMX0.4cEJ4faBy2ljIyrRIWMidoT-p-9yVLv073nhYYD3dV4'
)
