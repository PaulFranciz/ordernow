import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const TIMEOUT_DURATION = 15000; // 15 seconds timeout

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    let query = supabase
      .from('menu_items')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        category_id,
        created_at,
        updated_at
      `);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: menuItems, error } = await query.order('name');

    if (error) {
      console.error('Error fetching menu items:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch menu items',
        details: error.message 
      }, { status: 500 });
    }

    if (!menuItems) {
      return NextResponse.json({ menuItems: [] });
    }

    return NextResponse.json({ menuItems });
  } catch (error: unknown) {
    console.error('Menu items API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 