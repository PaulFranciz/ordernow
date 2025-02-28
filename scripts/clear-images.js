import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const categoriesToKeep = [
  'WHISKY OR BRANDY',
  'JUICES',
  'FRESH JUICES',
  'BEER OR CIDERS',
  'BITTERS(SPIRIT)'
]

async function clearImages() {
  try {
    // First, get all categories
    const { data: categories, error: fetchError } = await supabase
      .from('categories')
      .select('*')

    if (fetchError) {
      throw fetchError
    }

    console.log('Found', categories.length, 'categories')

    // Filter categories to clear (those not in categoriesToKeep)
    const categoriesToClear = categories.filter(
      category => !categoriesToKeep.includes(category.name)
    )

    console.log('Will clear images for', categoriesToClear.length, 'categories')

    // Clear image URLs for filtered categories
    for (const category of categoriesToClear) {
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: null })
        .eq('id', category.id)

      if (updateError) {
        console.error(`Failed to clear image for category ${category.name}:`, updateError)
      } else {
        console.log(`Cleared image for category: ${category.name}`)
      }
    }

    // Verify final state
    const { data: finalCategories, error: finalError } = await supabase
      .from('categories')
      .select('name, image_url')

    if (finalError) {
      throw finalError
    }

    console.log('\nFinal state:')
    finalCategories.forEach(category => {
      console.log(`${category.name}: ${category.image_url || 'no image'}`)
    })

  } catch (error) {
    console.error('Error:', error)
  }
}

clearImages() 