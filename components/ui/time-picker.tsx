import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  onChange: (time: string) => void;
  value: string | null;
  label?: string;
  className?: string;
  use24HourFormat?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  onChange,
  value,
  label = "Select Time",
  className,
  use24HourFormat = false,
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const [isOpen, setIsOpen] = useState(false);

  // Generate full 24 hours
  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour12 = i % 12 === 0 ? 12 : i % 12;
      const period = i >= 12 ? 'PM' : 'AM';
      hours.push({ value: i, display: use24HourFormat ? i : hour12, period });
    }
    return hours;
  };

  const hours = generateHours();
  const minutes = [0, 15, 30, 45];

  // Parse initial value
  useEffect(() => {
    if (value) {
      if (use24HourFormat) {
        const [hourStr, minuteStr] = value.split(':');
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setSelectedPeriod(hour >= 12 ? 'PM' : 'AM');
      } else {
        const [timeStr, period] = value.split(' ');
        const [hourStr, minuteStr] = timeStr.split(':');
        
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        
        setSelectedHour(period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour));
        setSelectedMinute(minute);
        setSelectedPeriod(period as 'AM' | 'PM');
      }
    }
  }, [value, use24HourFormat]);

  // Update time when selections change
  useEffect(() => {
    if (selectedHour !== null && selectedMinute !== null) {
      if (use24HourFormat) {
        const timeStr = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
        onChange(timeStr);
      } else {
        let hour12 = selectedHour % 12;
        if (hour12 === 0) hour12 = 12;
        
        const timeStr = `${hour12}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
        onChange(timeStr);
      }
    }
  }, [selectedHour, selectedMinute, selectedPeriod, onChange, use24HourFormat]);

  // Format display time
  const formatDisplayTime = () => {
    if (selectedHour === null || selectedMinute === null) return "Select time";
    
    if (use24HourFormat) {
      return `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    } else {
      let hour12 = selectedHour % 12;
      if (hour12 === 0) hour12 = 12;
      
      return `${hour12}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    }
  };

  const handleTimeSelection = (hour: number, minute: number, period: 'AM' | 'PM') => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);
    setIsOpen(false);
  };

  // Group hours by period for better UI organization
  const groupedHours = () => {
    if (use24HourFormat) {
      return [
        { title: "Hours", hours: hours }
      ];
    }
    
    return [
      { 
        title: "AM", 
        hours: hours.filter(h => h.period === 'AM')
      },
      { 
        title: "PM", 
        hours: hours.filter(h => h.period === 'PM')
      }
    ];
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
        <div className="absolute z-50 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in-50 zoom-in-95">
          <div className="p-3">
            {/* Hours selection */}
            <div className="mb-4 max-h-64 overflow-y-auto">
              {groupedHours().map((group, groupIndex) => (
                <div key={`group-${groupIndex}`} className="mb-3">
                  {!use24HourFormat && <div className="text-xs font-medium text-gray-500 mb-2">{group.title}</div>}
                  <div className="grid grid-cols-4 gap-2">
                    {group.hours.map((hour) => (
                      <div 
                        key={`hour-${hour.value}`}
                        onClick={() => {
                          setSelectedHour(hour.value);
                          setSelectedPeriod(hour.period as 'AM' | 'PM');
                          if (selectedMinute === null) setSelectedMinute(0);
                        }}
                        className={cn(
                          "text-center py-2 rounded-md cursor-pointer text-sm",
                          selectedHour === hour.value
                            ? "bg-blue-500 text-white"
                            : "hover:bg-blue-100"
                        )}
                      >
                        {use24HourFormat ? 
                          hour.value.toString().padStart(2, '0') : 
                          `${hour.display} ${hour.period}`}
                      </div>
                    ))}
                  </div>
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
            
            {/* Quick selections for 24/7 operation */}
            <div className="border-t mt-3 pt-3">
              <div className="flex flex-wrap justify-between gap-1">
                <button 
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => handleTimeSelection(0, 0, 'AM')}
                >
                  Midnight
                </button>
                <button 
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => handleTimeSelection(6, 0, 'AM')}
                >
                  6:00 AM
                </button>
                <button 
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => handleTimeSelection(12, 0, 'PM')}
                >
                  Noon
                </button>
                <button 
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => handleTimeSelection(18, 0, 'PM')}
                >
                  6:00 PM
                </button>
              </div>
            </div>
            
            {/* Format toggle */}
            <div className="mt-3 pt-2 border-t text-right">
              <button 
                className="text-xs text-gray-500 hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  // In a real implementation, you'd update the use24HourFormat prop
                  // For this demo, we just log it
                  console.log("Toggle 24-hour format");
                }}
              >
                {use24HourFormat ? "Switch to 12h" : "Switch to 24h"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;