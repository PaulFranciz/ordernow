// @ts-check
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url))

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = 'https://shdzddzuweblkbdiyrhp.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  console.error('Missing Supabase service role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const imageMap = {
  '49cd3ef6-db6f-46c4-b4e9-357619c7e090': 'https://res.cloudinary.com/djx3im1eb/image/upload/juice_fknpd2.jpg', // JUICES
  'ddd4e53b-c8e4-4dbb-bf4e-0e8005642324': 'https://res.cloudinary.com/djx3im1eb/image/upload/juice_fknpd2.jpg', // FRESH JUICES
  'd0cbc27e-0e7f-43e0-8fed-cddc7f4db239': 'https://res.cloudinary.com/djx3im1eb/image/upload/wiskey_rvdrze.jpg', // WHISKY OR BRANDY
  '29d5e894-f431-423a-b7ad-e0630594f096': 'https://res.cloudinary.com/djx3im1eb/image/upload/bitters_ukwb15.jpg', // BITTERS(SPIRIT)
  '346cdc27-6efb-4ad6-8b6b-e2c28d083f54': 'https://res.cloudinary.com/djx3im1eb/image/upload/beer_exiiy4.jpg', // BEER OR CIDERS
  '8696990b-7caf-45dc-9f71-a77b71ce6a4b': 'https://res.cloudinary.com/djx3im1eb/image/upload/pastry_aqxvxm.jpg', // PASTRY
  '1a1b6fd3-a50b-4865-9382-d205e2a9ab46': 'https://res.cloudinary.com/djx3im1eb/image/upload/soup_yvxvxm.jpg', // SOUP
  'b06fca7b-0240-4191-b4ae-e7fa7fdc162a': 'https://res.cloudinary.com/djx3im1eb/image/upload/appetizer_fknpd2.jpg', // APPETIZER
  'e17783e5-ff2a-4238-af3a-6b468b6850bc': 'https://res.cloudinary.com/djx3im1eb/image/upload/breakfast_yvxvxm.jpg', // BREAKFAST
  '771a7e6a-1444-49e9-80bb-844db9d07566': 'https://res.cloudinary.com/djx3im1eb/image/upload/champagne_aqxvxm.jpg', // CHAMPAGNE
  '11ad6bf5-eae7-437e-a183-7ebf991357f4': 'https://res.cloudinary.com/djx3im1eb/image/upload/specialities_yvxvxm.jpg', // SPECIALITIES
  '08413a5a-38f7-4c19-99f5-f81de1e54a65': 'https://res.cloudinary.com/djx3im1eb/image/upload/seafood_aqxvxm.jpg', // SEA FOOD MENU
  '12558237-2b4d-4580-92c4-6d5b3e203eed': 'https://res.cloudinary.com/djx3im1eb/image/upload/light_meal_fknpd2.jpg', // LIGHT MEAL
  '15a6ffb3-cfc9-4ca1-8cdc-51cddb9eb09d': 'https://res.cloudinary.com/djx3im1eb/image/upload/milkshake_yvxvxm.jpg', // MILKSHAKE
  '1789481d-6927-4949-9a32-ff9c7d7d803e': 'https://res.cloudinary.com/djx3im1eb/image/upload/chinese_aqxvxm.jpg', // CHINESE
  'c41a03ff-3624-451f-aeb4-f065125cf5ee': 'https://res.cloudinary.com/djx3im1eb/image/upload/protein_fknpd2.jpg', // PROTEIN
  'b6a49fe1-2787-474c-9906-a55cb181c3eb': 'https://res.cloudinary.com/djx3im1eb/image/upload/peppersoup_yvxvxm.jpg', // PEPPERSOUP
  '5a4698be-e8d1-419f-b2d2-56dd9795e923': 'https://res.cloudinary.com/djx3im1eb/image/upload/grill_aqxvxm.jpg', // GRILL LOUNGE
  'a80cf3be-11a0-4c92-9a3c-8b8d11274b84': 'https://res.cloudinary.com/djx3im1eb/image/upload/rice_fknpd2.jpg', // RICE
  'ee8a7f36-ae35-403f-bc16-1f88ee8ac4b8': 'https://res.cloudinary.com/djx3im1eb/image/upload/salad_yvxvxm.jpg', // SALAD
  '43333dbc-8d37-4c71-975e-11da978830f3': 'https://res.cloudinary.com/djx3im1eb/image/upload/indian_aqxvxm.jpg', // INDIAN
  '854d85b9-7e81-40d0-8c27-c8aa1edc08cf': 'https://res.cloudinary.com/djx3im1eb/image/upload/desert_fknpd2.jpg', // DESERT
  '562b022f-dbef-4b45-ac7f-a24b1bc2109f': 'https://res.cloudinary.com/djx3im1eb/image/upload/oriental_yvxvxm.jpg', // ORIENTAL/CONTINENTAL
  '2628c24b-3edd-4963-8c87-c625fa181fe5': 'https://res.cloudinary.com/djx3im1eb/image/upload/sauce_aqxvxm.jpg', // SAUCE
  '801be4c9-83c1-4b44-9d39-e199b26a6072': 'https://res.cloudinary.com/djx3im1eb/image/upload/red_wine_fknpd2.jpg', // RED WINES
  '6adb6978-61a4-4579-93d3-bc9a5d7788dc': 'https://res.cloudinary.com/djx3im1eb/image/upload/non_alcoholic_wine_yvxvxm.jpg', // NON-ALCOHOLIC SWEET WINE
  'a735eea9-48d4-4cfe-839d-8b5116a09475': 'https://res.cloudinary.com/djx3im1eb/image/upload/vodka_aqxvxm.jpg', // VODKA OR SPIRIT
  'c6e9493d-1d23-4d19-a666-292ab0b7ce95': 'https://res.cloudinary.com/djx3im1eb/image/upload/cocktail_fknpd2.jpg', // COCKTAIL
  '1f021cdf-5bed-44f9-a430-c92c81357a26': 'https://res.cloudinary.com/djx3im1eb/image/upload/soft_drinks_yvxvxm.jpg', // SOFT DRINKS OR WATER
  '5f43fe7e-4307-4e9a-9693-f521170dc6f5': 'https://res.cloudinary.com/djx3im1eb/image/upload/energy_drinks_aqxvxm.jpg', // ENERGY DRINKS
  '526c91fc-796a-46b2-862f-05bcddfeafca': 'https://res.cloudinary.com/djx3im1eb/image/upload/mocktails_fknpd2.jpg', // MOCKTAILS
  '9345aad8-4406-4d8c-ae70-f37c7524137b': 'https://res.cloudinary.com/djx3im1eb/image/upload/roots_yvxvxm.jpg', // ROOTS OR BITTERS
  '702ba566-b8d1-4506-990a-84fd2e1f596d': 'https://res.cloudinary.com/djx3im1eb/image/upload/sparkling_wine_aqxvxm.jpg', // SPARKLING WINE
  'b20e7eae-621c-4a09-b39d-6097979c4a51': 'https://res.cloudinary.com/djx3im1eb/image/upload/ciders_fknpd2.jpg', // CIDERS OR RTD
  '310d4535-1524-4d7f-b4f4-2e1e672ca425': 'https://res.cloudinary.com/djx3im1eb/image/upload/flour_yvxvxm.jpg', // FROM FLOUR
  'c8124d67-fe19-452c-a265-1c180bbdb621': 'https://res.cloudinary.com/djx3im1eb/image/upload/grills_aqxvxm.jpg', // GRILLS
  'd8e70d17-904c-4cda-ac22-8af0708acbbf': 'https://res.cloudinary.com/djx3im1eb/image/upload/brandy_fknpd2.jpg', // BRANDY/COGNAC
  'c6ef0ca2-db5b-40d8-84e9-a54a321da69b': 'https://res.cloudinary.com/djx3im1eb/image/upload/white_wine_yvxvxm.jpg', // WHITE WINE
  '7a9600aa-184e-474b-ac1d-36f0cd9e5e5e': 'https://res.cloudinary.com/djx3im1eb/image/upload/cream_aqxvxm.jpg', // CREAM
  'b69e222f-eef7-4124-950a-48f525f92832': 'https://res.cloudinary.com/djx3im1eb/image/upload/latte_tea_fknpd2.jpg', // HOGIS LATTE/TEA MENU
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function updateCategory(categoryId, imageUrl, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({ image_url: imageUrl })
        .eq('id', categoryId)
        .select()
      
      if (error) {
        throw error
      }
      
      if (!data || data.length === 0) {
        throw new Error('No rows updated')
      }
      
      console.log(`✅ Updated category ${categoryId} with image: ${imageUrl}`)
      return true
    } catch (error) {
      console.error(`❌ Attempt ${attempt}/${retries} failed for category ${categoryId}:`, error)
      
      if (attempt < retries) {
        const delay_ms = attempt * 1000
        console.log(`Retrying in ${delay_ms}ms...`)
        await delay(delay_ms)
      }
    }
  }
  return false
}

async function updateAllImages() {
  console.log('Starting to update all category images...\n')
  
  const results = {
    success: [],
    failed: []
  }
  
  for (const [categoryId, imageUrl] of Object.entries(imageMap)) {
    const success = await updateCategory(categoryId, imageUrl)
    if (success) {
      results.success.push(categoryId)
    } else {
      results.failed.push(categoryId)
    }
    // Add a small delay between updates to avoid rate limiting
    await delay(100)
  }
  
  console.log('\n=== Update Summary ===')
  console.log(`✅ Successfully updated ${results.success.length} categories`)
  console.log(`❌ Failed to update ${results.failed.length} categories`)
  
  if (results.failed.length > 0) {
    console.log('\nFailed categories:')
    results.failed.forEach(id => console.log(`- ${id}`))
  }
  
  console.log('\nVerifying final state...')
  const { data: categories, error: fetchError } = await supabase
    .from('categories')
    .select('id, name, image_url')
  
  if (fetchError) {
    console.error('Error fetching updated categories:', fetchError)
    return
  }
  
  const categoriesWithoutImages = categories.filter(c => !c.image_url)
  
  if (categoriesWithoutImages.length > 0) {
    console.log('\nCategories still without images:')
    categoriesWithoutImages.forEach(c => console.log(`- ${c.name}`))
  } else {
    console.log('\n✅ All categories have images!')
  }
}

updateAllImages() 