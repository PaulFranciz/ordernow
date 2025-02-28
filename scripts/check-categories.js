// @ts-check
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://shdzddzuweblkbdiyrhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHpkZHp1d2VibGtiZGl5cmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODA4MDEsImV4cCI6MjA1NjE1NjgwMX0.OjpV1jfuwrWDo3aOu7ALvq1wG2p4ltZpZRsBg2-n2QY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function listCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image_url')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error.message)
      return
    }

    console.log('\nCategories in database:')
    console.log('======================')
    data.forEach(category => {
      console.log(`ID: ${category.id}`)
      console.log(`Name: ${category.name}`)
      console.log(`Image URL: ${category.image_url || 'None'}`)
      console.log('----------------------')
    })

    const withImages = data.filter(c => c.image_url).length
    const total = data.length
    
    console.log(`\nSummary:`)
    console.log(`Total categories: ${total}`)
    console.log(`Categories with images: ${withImages}`)
    console.log(`Categories without images: ${total - withImages}`)

  } catch (error) {
    console.error('Error:', error.message)
  }
}

listCategories() 