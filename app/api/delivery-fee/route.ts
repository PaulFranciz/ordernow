import { NextResponse } from 'next/server';
import { calculateDeliveryFee } from '@/lib/supabase/client';
import { VehicleType } from '../types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get('zone_id');
    const vehicleType = searchParams.get('vehicle_type') as VehicleType;

    if (!zoneId || !vehicleType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!['motorbike', 'bicycle'].includes(vehicleType)) {
      return NextResponse.json({ error: 'Invalid vehicle type' }, { status: 400 });
    }

    try {
      const fee = await calculateDeliveryFee(zoneId, vehicleType);
      return NextResponse.json(fee);
    } catch (error) {
      if (error instanceof Error && error.message === 'Delivery zone not found') {
        return NextResponse.json({ error: 'Delivery zone not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 