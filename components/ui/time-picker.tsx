import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  onChange: (time: string) => void;
  value: string | null;
  label?: string;
  className?: string;
  hourRange?: { start: number; end: number };
}

const TimePicker: React.FC<TimePickerProps> = ({
  onChange,
  value,
  label = "Select Time",
  className,
  hourRange = { start: 8, end: 22 } // Default business hours 8 AM to 10 PM
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const [isOpen, setIsOpen] = useState(false);

  // Time options
  const generateHours = () => {
    const hours = [];
    for (let i = hourRange.start; i <= hourRange.end; i++) {
      const hour12 = i % 12 === 0 ? 12 : i % 12;
      const period = i >= 12 ? 'PM' : 'AM';
      hours.push({ value: i, display: hour12, period });
    }
    return hours;
  };

  const hours = generateHours();
  const minutes = [0, 15, 30, 45];

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [timeStr, period] = value.split(' ');
      const [hourStr, minuteStr] = timeStr.split(':');
      
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      
      setSelectedHour(period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour));
      setSelectedMinute(minute);
      setSelectedPeriod(period as 'AM' | 'PM');
    }
  }, [value]);

  // Update time when selections change
  useEffect(() => {
    if (selectedHour !== null && selectedMinute !== null) {
      let hour12 = selectedHour % 12;
      if (hour12 === 0) hour12 = 12;
      
      const timeStr = `${hour12}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
      onChange(timeStr);
    }
  }, [selectedHour, selectedMinute, selectedPeriod, onChange]);

  // Format display time
  const formatDisplayTime = () => {
    if (selectedHour === null || selectedMinute === null) return "Select time";
    
    let hour12 = selectedHour % 12;
    if (hour12 === 0) hour12 = 12;
    
    return `${hour12}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
  };

  const handleTimeSelection = (hour: number, minute: number, period: 'AM' | 'PM') => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      
      {/* Time input field */}
      <div 
        className="flex items-center p-3 border rounded-md bg-white shadow-sm hover:border-blue-500 cursor-pointer transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Clock className="h-5 w-5 text-gray-500 mr-2" />
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "Select time"}
        </span>
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in-50 zoom-in-95">
          <div className="p-3">
            {/* Time selection grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {hours.map((hour) => (
                <div 
                  key={`hour-${hour.value}`}
                  onClick={() => {
                    setSelectedHour(hour.value);
                    setSelectedPeriod(hour.period as 'AM' | 'PM');
                    if (selectedMinute === null) setSelectedMinute(0);
                  }}
                  className={cn(
                    "text-center py-2 rounded-md cursor-pointer text-sm",
                    selectedHour === hour.value && selectedPeriod === hour.period
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100"
                  )}
                >
                  {hour.display} {hour.period}
                </div>
              ))}
            </div>
            
            {/* Minutes */}
            <div className="border-t pt-2">
              <div className="text-xs text-gray-500 mb-2">Minutes</div>
              <div className="grid grid-cols-4 gap-2">
                {minutes.map((minute) => (
                  <div 
                    key={`minute-${minute}`}
                    onClick={() => {
                      setSelectedMinute(minute);
                      if (selectedHour === null) {
                        setSelectedHour(12);
                        setSelectedPeriod('PM');
                      }
                    }}
                    className={cn(
                      "text-center py-2 rounded-md cursor-pointer text-sm",
                      selectedMinute === minute
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100"
                    )}
                  >
                    :{minute.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick selections */}
            <div className="border-t mt-3 pt-3">
              <div className="flex justify-between">
                <button 
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => handleTimeSelection(12, 0, 'PM')}
                >
                  Noon
                </button>
                <button 
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => handleTimeSelection(19, 0, 'PM')}
                >
                  7:00 PM
                </button>
                <button 
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => handleTimeSelection(20, 30, 'PM')}
                >
                  8:30 PM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;