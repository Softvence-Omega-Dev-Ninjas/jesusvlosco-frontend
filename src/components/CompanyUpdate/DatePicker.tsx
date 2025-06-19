import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      daysArray.push(
        <button
          key={`day-${day}`}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${isSelected ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setSelectedDate(date)}
        >
          {day}
        </button>
      );
    }

    return daysArray;
  };

  return (
    <div className="relative">
      <button 
        className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src="/calendar.png" alt="Calendar" className="w-4 h-4 mr-1" />
        Date
        <img src="/arrow.png" alt="Arrow" className="w-4 h-4 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          {/* Month/Year Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="font-medium">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>

          {/* Selected Date Display */}
          {selectedDate && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">Selected:</div>
              <div className="font-medium">
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button 
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;