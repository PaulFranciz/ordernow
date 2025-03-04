'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { DeliveryZone } from '@/types/checkout';

interface DeliveryZoneSelectorProps {
  onSelect: (zone: DeliveryZone) => void;
  branchIds: string[]; // Accept an array of branch IDs
  vehicleType: 'motorbike' | 'bicycle'; // Add vehicleType prop
}

export function DeliveryZoneSelector({ 
  onSelect, 
  branchIds = [], // Default to an empty array
  vehicleType // Use the vehicleType prop
}: DeliveryZoneSelectorProps) {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .in('branch_id', branchIds)
        .eq('vehicle_type', vehicleType); // Filter by vehicle type

      if (error) {
        console.error('Supabase query error:', error.message);
        setError(`Failed to fetch delivery zones: ${error.message}`);
      } else if (!data || data.length === 0) {
        setZones([]);
        // Changed to not show an error for empty results, just show empty state
      } else {
        setZones(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [branchIds, supabase, vehicleType]); // Add vehicleType to dependencies

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading delivery zones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => fetchZones()} 
          className="mt-2 text-sm font-medium underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Select Your Delivery Location</h2>
      
      {zones.length === 0 ? (
        <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
          <p className="font-medium">No delivery zones available for {vehicleType} delivery.</p>
          <p className="text-sm mt-1">Please try a different delivery method or contact support.</p>
        </div>
      ) : (
        zones.map((zone) => (
          <motion.div
            key={zone.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => onSelect(zone)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{zone.location}</h3>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                    {zone.vehicle_type}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-lg">₦{zone.daytime_fee}</p>
                <p className="text-sm text-gray-500">Delivery fee</p>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}