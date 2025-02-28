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

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateSingleCategory() {
  try {
    const categoryName = 'QUICKSTART'
    const imageUrl = 'https://res.cloudinary.com/djx3im1eb/image/upload/v1740659161/quickstart_fknpd2.jpg'

    // Find the category by name
    const { data: categories, error: findError } = await supabase
      .from('categories')
      .select('*')
      .eq('name', categoryName)
      .single()

    if (findError) {
      console.error('Error finding category:', findError.message)
      return
    }

    if (!categories) {
      console.error('Category not found:', categoryName)
      return
    }

    // Update the category with the new image URL
    const { data: updatedCategory, error: updateError } = await supabase
      .from('categories')
      .update({ image_url: imageUrl })
      .eq('id', categories.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating category:', updateError.message)
      return
    }

    console.log('✅ Successfully updated category:', updatedCategory)
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

updateSingleCategory() 