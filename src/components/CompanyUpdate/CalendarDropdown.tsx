
import React, { useState } from "react";

const CalendarDropdown: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  return (
    <div className="relative inline-block text-left">
      {/* Date Button */}
      <button
        onClick={toggleCalendar}
        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-sm flex items-center"
      >
        <img src="/calendar.png" alt="Calendar" className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Date</span>
        <img src="/arrow.png" alt="Arrow" className="w-4 h-4 ml-1" />
      </button>

      {/* Dropdown Calendar UI */}
      {showCalendar && (
        <div  className="absolute z-10 mt-2 w-[90vw] sm:w-[500px] bg-white border rounded-lg shadow-lg p-4 -left-64 sm:left-auto sm:right-0 sm:translate-x-0">

          {/* Date Range Selectors - Stack on mobile */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3 sm:gap-2">
            <div className="flex items-center gap-1 sm:space-x-1">
              <label className="text-sm font-semibold whitespace-nowrap">From</label>
              <select className="border p-1 rounded text-sm flex-1 min-w-0">
                <option>01</option>
                <option>02</option>
                {/* Add more dates */}
              </select>
              <select className="border p-1 rounded text-sm flex-1 min-w-0">
                <option>May</option>
              </select>
              <select className="border p-1 rounded text-sm flex-1 min-w-0">
                <option>2025</option>
              </select>
            </div>
            <div className="flex items-center gap-1 sm:space-x-1">
              <label className="text-sm font-semibold whitespace-nowrap">To</label>
              <select className="border p-1 rounded text-sm flex-1 min-w-0">
                <option>01</option>
                <option>02</option>
                {/* Add more dates */}
              </select>
              <select className="border p-1 rounded text-sm flex-1 min-w-0">
                <option>May</option>
              </select>
              <select className="border p-1 rounded text-sm flex-1 min-w-0">
                <option>2025</option>
              </select>
            </div>
          </div>

          {/* Calendar Grid - Adjust spacing for mobile */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {[
              ...Array(3).fill(""),
              "01", "02", "03",
              "04", "05", "06", "07", "08",
              "09", "10", "11", "12", "13", "14", "15", "16", "17",
              "18", "19", "20", "21", "22", "23", "24",
              "25", "26", "27", "28", "29", "30", "31",
            ].map((day, index) => (
              <div
                key={index}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm rounded-md ${
                  ["01", "02", "03", "04", "05", "06", "07", "08"].includes(day)
                    ? "bg-orange-400 text-white"
                    : "text-gray-700"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Close Button for mobile */}
          <div className="sm:hidden mt-4 flex justify-center">
            <button
              onClick={toggleCalendar}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDropdown;