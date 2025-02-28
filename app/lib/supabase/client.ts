import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if it's night time (after 6 PM)
export const isNightTime = () => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

// Helper function to check if it's Sunday
export const isSunday = () => {
  return new Date().getDay() === 0;
};

// Helper function to calculate delivery fee
export const calculateDeliveryFee = async (
  zoneId: string,
  vehicleType: 'motorbike' | 'bicycle'
) => {
  const { data: zone } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('id', zoneId)
    .single();

  if (!zone) {
    throw new Error('Delivery zone not found');
  }

  let fee = isNightTime() ? zone.night_fee : zone.daytime_fee;
  
  // Add Sunday surcharge if applicable
  if (isSunday()) {
    fee += 100; // Sunday surcharge
  }

  return {
    base_fee: isNightTime() ? zone.night_fee : zone.daytime_fee,
    night_surcharge: isNightTime() ? zone.night_fee - zone.daytime_fee : 0,
    sunday_surcharge: isSunday() ? 100 : 0,
    total_fee: fee
  };
}; 