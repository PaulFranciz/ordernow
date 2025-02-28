import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shdzddzuweblkbdiyrhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHpkZHp1d2VibGtiZGl5cmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODA4MDEsImV4cCI6MjA1NjE1NjgwMX0.OjpV1jfuwrWDo3aOu7ALvq1wG2p4ltZpZRsBg2-n2QY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Define the categories that should have images and their correct URLs
const categoryImages = {
  'WHISKY OR BRANDY': 'https://res.cloudinary.com/djx3im1eb/image/upload/v1740659164/wiskey_rvdrze.jpg',
  'FRESH JUICES': 'https://res.cloudinary.com/djx3im1eb/image/upload/v1740659156/juice_fknpd2.jpg',
  'JUICES': 'https://res.cloudinary.com/djx3im1eb/image/upload/v1740659156/juice_fknpd2.jpg',
  'BEER OR CIDERS': 'https://res.cloudinary.com/djx3im1eb/image/upload/v1740659156/beer_exiiy4.jpg',
  'BITTERS(SPIRIT)': 'https://res.cloudinary.com/djx3im1eb/image/upload/v1740659156/bitters_ukwb15.jpg'
};

async function fixCategoryImages() {
  try {
    console.log('Starting to fix category images...\n');

    // First, clear all image URLs
    const { error: clearError } = await supabase
      .from('categories')
      .update({ image_url: null })
      .neq('name', Object.keys(categoryImages)[0]); // Use any category name as a reference

    if (clearError) {
      console.error('Error clearing image URLs:', clearError);
      return;
    }

    console.log('Cleared all image URLs');

    // Update categories with their correct image URLs
    for (const [categoryName, imageUrl] of Object.entries(categoryImages)) {
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: imageUrl })
        .eq('name', categoryName);

      if (updateError) {
        console.error(`Error updating ${categoryName}:`, updateError);
      } else {
        console.log(`✅ Updated ${categoryName} with image: ${imageUrl}`);
      }

      // Add a small delay between updates
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Verify the final state
    const { data: finalCategories, error: verifyError } = await supabase
      .from('categories')
      .select('name, image_url')
      .order('name');

    if (verifyError) {
      console.error('Error verifying final state:', verifyError);
      return;
    }

    console.log('\nFinal state:');
    finalCategories.forEach(category => {
      console.log(`${category.name}: ${category.image_url || 'no image'}`);
    });

    const withImages = finalCategories.filter(c => c.image_url).length;
    console.log(`\nTotal categories with images: ${withImages}`);
    console.log(`Total categories without images: ${finalCategories.length - withImages}`);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixCategoryImages(); 