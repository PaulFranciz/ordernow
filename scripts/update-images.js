// @ts-check
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://shdzddzuweblkbdiyrhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHpkZHp1d2VibGtiZGl5cmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODA4MDEsImV4cCI6MjA1NjE1NjgwMX0.OjpV1jfuwrWDo3aOu7ALvq1wG2p4ltZpZRsBg2-n2QY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateImages() {
  // Update WHISKY OR BRANDY
  const { error: error1 } = await supabase
    .from('categories')
    .update({ image_url: 'https://res.cloudinary.com/djx3im1eb/image/upload/v1740659164/wiskey_rvdrze.jpg' })
    .eq('name', 'WHISKY OR BRANDY')

  if (error1) console.error('Error updating WHISKY OR BRANDY:', error1)
  else console.log('Updated WHISKY OR BRANDY')

  // Update FRESH JUICES
  const { error: error2 } = await supabase
    .from('categories')
    .update({ image_url: 'https://res.cloudinary.com/djx3im1eb/image/upload/v1740659156/juice_fknpd2.jpg' })
    .eq('name', 'FRESH JUICES')

  if (error2) console.error('Error updating FRESH JUICES:', error2)
  else console.log('Updated FRESH JUICES')

  // Check the results
  const { data, error } = await supabase
    .from('categories')
    .select('name, image_url')
    .in('name', ['WHISKY OR BRANDY', 'FRESH JUICES'])

  if (error) console.error('Error checking results:', error)
  else console.log('Current values:', data)
}

updateImages() 