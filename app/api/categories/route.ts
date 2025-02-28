import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper function to add CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache'
  };
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET() {
  try {
    console.log('Request details:', {
      method: 'GET',
      url: headers().get('x-url'),
      pathname: headers().get('x-pathname')
    });

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Fetching categories...');
    const { data: categories, error, count } = await supabase
      .from('categories')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    if (!categories) {
      console.error('No categories found');
      return NextResponse.json(
        { error: 'No categories found' },
        { status: 404 }
      );
    }

    console.log('Categories fetched successfully:', {
      count,
      sample: categories.slice(0, 2)
    });

    const response = {
      categories,
      count,
      message: 'Categories fetched successfully'
    };

    console.log('Sending response:', { count, message: response.message });
    return NextResponse.json(response);

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 