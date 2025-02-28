import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://shdzddzuweblkbdiyrhp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHpkZHp1d2VibGtiZGl5cmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODA4MDEsImV4cCI6MjA1NjE1NjgwMX0.OjpV1jfuwrWDo3aOu7ALvq1wG2p4ltZpZRsBg2-n2QY'
)

async function listCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Categories:')
  data.forEach(cat => {
    console.log(`[${cat.id}] ${cat.name}`)
  })
}

listCategories() 