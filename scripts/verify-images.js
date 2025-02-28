// @ts-check
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const supabaseUrl = 'https://shdzddzuweblkbdiyrhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHpkZHp1d2VibGtiZGl5cmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODA4MDEsImV4cCI6MjA1NjE1NjgwMX0.OjpV1jfuwrWDo3aOu7ALvq1wG2p4ltZpZRsBg2-n2QY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkImageUrl(url) {
  try {
    const response = await fetch(url)
    return {
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get('content-type')
    }
  } catch (error) {
    return {
      error: error.message
    }
  }
}

async function verifyImages() {
  const { data, error } = await supabase
    .from('categories')
    .select('name, image_url')
    .not('image_url', 'is', null)
    
  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Verifying images...\n')
  
  for (const category of data) {
    console.log(`Category: ${category.name}`)
    console.log(`URL: ${category.image_url}`)
    const result = await checkImageUrl(category.image_url)
    console.log('Result:', result)
    console.log('-------------------\n')
  }
}

verifyImages() 