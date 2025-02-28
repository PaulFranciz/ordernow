import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ITEMS_PER_PAGE = 24;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');
    const popular = searchParams.get('popular') === 'true';
    
    // Calculate offset for pagination
    const offset = (page - 1) * ITEMS_PER_PAGE;

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
        *,
        category:categories(id, name, description, image_url)
      `);

    // Apply filters
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (popular) {
      query = query.eq('is_popular', true);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true })
      .eq(categoryId ? 'category_id' : 'id', categoryId || 'id')
      .eq(popular ? 'is_popular' : 'id', popular ? true : 'id')
      .ilike(search ? 'name' : 'id', search ? `%${search}%` : 'id');

    // Apply pagination
    const { data: menuItems, error } = await query
      .range(offset, offset + ITEMS_PER_PAGE - 1)
      .order('name');

    if (error) {
      console.error('Error fetching menu items:', error);
      return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
    }

    const response = {
      menuItems,
      pagination: {
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 