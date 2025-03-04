import { createClient } from '@supabase/supabase-js';
import { VehicleType } from '@/app/api/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function calculateDeliveryFee(zoneId: string, vehicleType: VehicleType) {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('base_fee, per_km_fee')
    .eq('id', zoneId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Zone not found');

  const baseFee = vehicleType === 'bicycle' ? data.base_fee * 0.8 : data.base_fee;
  const perKmFee = vehicleType === 'bicycle' ? data.per_km_fee * 0.8 : data.per_km_fee;

  return { baseFee, perKmFee };
}