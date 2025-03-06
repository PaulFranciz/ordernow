"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useTimeSelectionStore } from "@/app/store/useTimeSelectionStore";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { OrderType } from "@/app/store/useTimeSelectionStore";

export default function TimeSelectionPage() {
  const router = useRouter();
  const params = useParams();
  const orderTypeParam = params.type as string;
  
  // Convert URL param to store's OrderType
  const orderType: OrderType = orderTypeParam === 'pick-up' 
    ? 'pick-up' 
    : orderTypeParam === 'dine-in'
      ? 'dine-in'
      : 'delivery';
  
  const timeSelectionStore = useTimeSelectionStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");

  // Set the order type on mount
  useEffect(() => {
    timeSelectionStore.setOrderType(orderType);
  }, [orderType, timeSelectionStore]);

  // Generate time slots (every 30 minutes from 08:00 to 20:00)
  const timeSlots = Array.from({ length: 25 }, (_, hour) => 
    [`${hour.toString().padStart(2, '0')}:00`, `${hour.toString().padStart(2, '0')}:30`]
  ).flat().filter(t => t >= "08:00" && t <= "20:00");

  const handleSubmit = () => {
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }
    
    timeSelectionStore.setSelectedDate(date);
    timeSelectionStore.setSelectedTime(time);
    
    // Navigate to checkout
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          Select {orderTypeParam.replace("-", " ")} Time
        </h1>
        
        <div className="mb-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Continue to Checkout
        </Button>
      </div>
    </div>
  );
}