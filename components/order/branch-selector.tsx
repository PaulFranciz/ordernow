"use client";

import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBranchStore } from "@/app/store/useBranchStore";
import { useTimeSelectionStore } from "@/app/store/useTimeSelectionStore";
import { Button } from "@/components/ui/button";
import { Branch } from '@/app/api/types';

interface BranchSelectorProps {
  orderType: string;
}

export function BranchSelector({ orderType }: BranchSelectorProps) {
  const router = useRouter();
  const { branches, selectedBranchId, isLoading, error, fetchBranches, selectBranch } = useBranchStore();
  const setTimeSelectionBranchId = useTimeSelectionStore((state) => state.setBranchId);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const getBranchStatus = (branch: Branch, orderType: string): 'open' | 'closed' => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // For dine-in and pick-up, available 24/7
    if (orderType === 'dine-in' || orderType === 'pick-up') {
      return 'open';
    }
    
    // For delivery, available from 8am to 9pm (8:00 - 21:00)
    if (orderType === 'delivery') {
      const openingHour = 8; // 8am
      const closingHour = 21; // 9pm
      
      const openingTimeInMinutes = openingHour * 60;
      const closingTimeInMinutes = closingHour * 60;
      
      return (currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes) 
        ? 'open' 
        : 'closed';
    }
    
    // Fallback to the original time check logic for any other order types
    const [openingHour, openingMinute] = branch.opening_time.split(':').map(Number);
    const [closingHour, closingMinute] = branch.closing_time.split(':').map(Number);
    
    const openingTimeInMinutes = openingHour * 60 + openingMinute;
    const closingTimeInMinutes = closingHour * 60 + closingMinute;
    
    return (currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes) 
      ? 'open' 
      : 'closed';
  };

  const getDisplayTime = (orderType: string): string => {
    if (orderType === 'dine-in' || orderType === 'pick-up') {
      return "Open 24 hours";
    } else if (orderType === 'delivery') {
      return "08:00 - 21:00";
    } else {
      // Fallback to original branch hours
      return "";
    }
  };

  const branchesWithStatus = useMemo(() => {
    return branches.map(branch => ({
      ...branch,
      status: getBranchStatus(branch, orderType),
      displayTime: getDisplayTime(orderType) || `${branch.opening_time} - ${branch.closing_time}`
    }));
  }, [branches, orderType]);

  const handleContinue = () => {
    if (selectedBranchId) {
      setTimeSelectionBranchId(selectedBranchId);
      router.push(`/order/${orderType}/menu`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <p className="text-neutral-400">Loading branches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-semibold text-white">Select a Branch</h2>
        <p className="text-neutral-400">Choose the branch closest to you</p>
      </motion.div>

      <div className="space-y-4">
        {branchesWithStatus.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => selectBranch(branch.id)}
            className={`
              relative group cursor-pointer rounded-xl p-4 
              ${selectedBranchId === branch.id 
                ? 'bg-[#BF9B30]/20 border-[#BF9B30]' 
                : 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-900'} 
              border transition-all duration-200
            `}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 rounded-lg bg-neutral-800 group-hover:bg-[#BF9B30]/20 transition-colors duration-200">
                <MapPin className={`w-6 h-6 ${selectedBranchId === branch.id ? 'text-[#BF9B30]' : 'text-neutral-400'}`} />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white group-hover:text-[#BF9B30] transition-colors duration-200">
                    {branch.name}
                  </h3>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${branch.status === 'open'
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'}
                  `}>
                    {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-sm text-neutral-400 mt-1">{branch.address}</p>
                
                <div className="flex items-center gap-4 mt-2 text-sm">
                  {branch.distance && (
                    <span className="text-neutral-500">{branch.distance}</span>
                  )}
                  <span className="text-neutral-500">{branch.displayTime}</span>
                </div>
              </div>
            </div>

            {selectedBranchId === branch.id && (
              <motion.div
                layoutId="selected-branch"
                className="absolute inset-0 border-2 border-[#BF9B30] rounded-xl pointer-events-none"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {selectedBranchId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Button
            className="w-full bg-[#BF9B30] hover:bg-[#BF9B30]/90 text-white py-6 text-lg"
            onClick={handleContinue}
          >
            Continue to Menu
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}