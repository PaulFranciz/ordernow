import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shdzddzuweblkbdiyrhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZHpkZHp1d2VibGtiZGl5cmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODA4MDEsImV4cCI6MjA1NjE1NjgwMX0.OjpV1jfuwrWDo3aOu7ALvq1wG2p4ltZpZRsBg2-n2QY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Check categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }

    console.log('\nCategories in database:', categories?.length || 0);
    if (categories?.length > 0) {
      console.log('\nFirst few categories:');
      categories.slice(0, 3).forEach(cat => {
        console.log(`- ${cat.name} (${cat.id})`);
      });
    } else {
      console.log('No categories found in database');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkDatabase(); 