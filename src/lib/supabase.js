import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://kobojmrvssqgnidmgddl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvYm9qbXJ2c3NxZ25pZG1nZGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4Njc0MTksImV4cCI6MjA4NzQ0MzQxOX0.pb6uAQeRS_iWmRkyqGb-zDJ18_S1N_H26Q0RhcYNRSo'
)
