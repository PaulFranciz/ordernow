import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { CreateOrderRequest } from '../types';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user from session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateOrderRequest = await request.json();
    const { branch_id, order_type, delivery_zone_id, items, special_instructions } = body;

    // Validate required fields
    if (!branch_id || !order_type || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate delivery details for delivery orders
    if (order_type === 'delivery' && !delivery_zone_id) {
      return NextResponse.json({ error: 'Delivery zone is required for delivery orders' }, { status: 400 });
    }

    // Create order
    const rpcParams = {
      p_user_id: session.user.id,
      p_branch_id: branch_id,
      p_order_type: order_type,
      p_delivery_zone_id: delivery_zone_id,
      p_special_instructions: special_instructions,
      p_items: items
    };
    
    console.log('Request body:', JSON.stringify(body, null, 2));
    console.log('RPC params:', JSON.stringify(rpcParams, null, 2));

    const { data: order, error: orderError } = await supabase.rpc('create_order', rpcParams);

    if (orderError) {
      console.error('Order creation error details:', {
        message: orderError.message,
        details: orderError.details,
        hint: orderError.hint,
        code: orderError.code
      });
      return NextResponse.json({ error: 'Failed to create order', details: orderError }, { status: 500 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user from session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('orders')
      .select(`
        *,
        branch:branches(name, address),
        items:order_items(
          quantity,
          unit_price,
          subtotal,
          menu_item:menu_items(name, description)
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}