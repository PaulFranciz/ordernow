'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { DeliveryZone } from '@/types/checkout';

interface DeliveryZoneSelectorProps {
  onSelect: (zone: DeliveryZone) => void;
}

export function DeliveryZoneSelector({ onSelect }: DeliveryZoneSelectorProps) {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchZones() {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('branch_id', 1); // You might want to make this dynamic

      if (data) {
        setZones(data);
      }
      setLoading(false);
    }

    fetchZones();
  }, []);

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
    return <div className="animate-pulse">Loading zones...</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Select Your Delivery Location</h2>
      
      {zones.map((zone) => (
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
              <p className="text-sm text-gray-500">{zone.vehicle_type}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">₦{zone.daytime_fee}</p>
              <p className="text-sm text-gray-500">Delivery fee</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 