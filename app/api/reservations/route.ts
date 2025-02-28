import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { CreateReservationRequest } from '../types';

export async function POST(request: Request) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateReservationRequest = await request.json();
    const { branch_id, reservation_date, reservation_time, number_of_guests, special_requests } = body;

    // Validate required fields
    if (!branch_id || !reservation_date || !reservation_time || !number_of_guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate reservation time is in the future
    const reservationDateTime = new Date(`${reservation_date}T${reservation_time}`);
    if (reservationDateTime <= new Date()) {
      return NextResponse.json({ error: 'Reservation must be for a future date and time' }, { status: 400 });
    }

    // Check branch operating hours
    const { data: branch } = await supabase
      .from('branches')
      .select('opening_time, closing_time')
      .eq('id', branch_id)
      .single();

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const reservationHour = parseInt(reservation_time.split(':')[0]);
    const openingHour = parseInt(branch.opening_time.split(':')[0]);
    const closingHour = parseInt(branch.closing_time.split(':')[0]);

    if (reservationHour < openingHour || reservationHour >= closingHour) {
      return NextResponse.json({ 
        error: `Reservation time must be between ${branch.opening_time} and ${branch.closing_time}` 
      }, { status: 400 });
    }

    // Create reservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        user_id: user.id,
        branch_id,
        reservation_date,
        reservation_time,
        number_of_guests,
        special_requests,
        status: 'pending'
      })
      .select()
      .single();

    if (reservationError) {
      console.error('Reservation creation error:', reservationError);
      return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error('Reservation creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('reservations')
      .select(`
        *,
        branch:branches(name, address)
      `)
      .eq('user_id', user.id)
      .order('reservation_date', { ascending: true })
      .order('reservation_time', { ascending: true })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: reservations, error } = await query;

    if (error) {
      console.error('Error fetching reservations:', error);
      return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}