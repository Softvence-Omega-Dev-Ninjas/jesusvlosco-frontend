
import { useState } from "react";
import { ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarDropdownProps {
      selectedRange: string;
      onSelectRange: (range: string) => void;
}

export default function CalendarDropdown({ selectedRange, onSelectRange }: CalendarDropdownProps) {
      const [showCalendar, setShowCalendar] = useState(false);
      const [currentMonth, setCurrentMonth] = useState(4); // May = 4 (0-indexed)
      const [currentYear, setCurrentYear] = useState(2025);
      const [monthViewOffset, setMonthViewOffset] = useState(0); // Controls which 9 months to show

      const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const toggleCalendar = () => {
            setShowCalendar(!showCalendar);
      };

      const handleRangeSelect = (range: string) => {
            onSelectRange(range);
            setShowCalendar(false);
      };

      const closeCalendar = () => {
            setShowCalendar(false);
      };

      const cycleMonthsView = () => {
            // Cycle through different sets of 9 months
            setMonthViewOffset((prev) => (prev + 1) % 4); // 4 different views of 9 months each
      };

      const getDaysInMonth = (month: number, year: number) => {
            return new Date(year, month + 1, 0).getDate();
      };

      const getFirstDayOfMonth = (month: number, year: number) => {
            return new Date(year, month, 1).getDay();
      };

      const isDateInRange = (date: number) => {
            return date >= 25 && date <= 30;
      };

      const getVisibleMonths = () => {
            // Create 4 different sets of 9 months each
            const monthSets = [
                  ['Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'], // Set 0
                  ['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr'], // Set 1
                  ['Mar', 'Feb', 'Jan', 'Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul'], // Set 2
                  ['Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan', 'Dec', 'Nov', 'Oct']  // Set 3
            ];

            return monthSets[monthViewOffset];
      };

      const renderCalendarDays = () => {
            const daysInMonth = getDaysInMonth(currentMonth, currentYear);
            const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
            const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);

            const days = [];

            // Previous month's trailing days
            for (let i = firstDay - 1; i >= 0; i--) {
                  const date = daysInPrevMonth - i;
                  days.push(
                        <button
                              key={`prev-${date}`}
                              className="w-8 h-8 text-gray-400 text-sm hover:bg-gray-100 rounded-full flex items-center justify-center"
                        >
                              {date}
                        </button>
                  );
            }

            // Current month's days
            for (let date = 1; date <= daysInMonth; date++) {
                  days.push(
                        <button
                              key={date}
                              className={`w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors ${isDateInRange(date)
                                          ? 'bg-orange-400 text-white font-medium'
                                          : 'text-gray-900 hover:bg-gray-100'
                                    }`}
                              onClick={() => handleRangeSelect('May 25 - May 30')}
                        >
                              {date}
                        </button>
                  );
            }

            return days;
      };

      const navigateMonth = (direction: 'prev' | 'next') => {
            if (direction === 'prev') {
                  if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                  } else {
                        setCurrentMonth(currentMonth - 1);
                  }
            } else {
                  if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                  } else {
                        setCurrentMonth(currentMonth + 1);
                  }
            }
      };

      return (
            <div className="relative">
                  <button
                        onClick={toggleCalendar}
                        className="flex cursor-pointer items-center gap-2 border border-[#4E53B1] rounded-full py-2 px-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                        <span className="text-sm font-medium text-[#4E53B1]">{selectedRange}</span>
                        {showCalendar ? (
                              <ChevronUp className="w-4 h-4 text-[#4E53B1]" />
                        ) : (
                              <ChevronDown className="w-4 h-4 text-[#4E53B1]" />
                        )}
                  </button>

                  {showCalendar && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-96">
                              {/* Header */}
                              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <div>
                                          <h3 className="text-lg font-semibold text-gray-900">Shift Calendar</h3>
                                          <p className="text-sm text-gray-600 mt-1">View and manage employee shifts for the month</p>
                                    </div>
                                    <button
                                          onClick={closeCalendar}
                                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                          <X className="w-5 h-5 text-gray-500" />
                                    </button>
                              </div>

                              {/* Quick Actions */}
                              <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                          <button
                                                className="text-sm text-[#4E53B1] hover:underline font-medium"
                                                onClick={() => handleRangeSelect('Today')}
                                          >
                                                Today
                                          </button>
                                          <button
                                                className="text-sm text-[#4E53B1] hover:underline font-medium"
                                                onClick={() => handleRangeSelect('Last 8 days')}
                                          >
                                                Last 8 days
                                          </button>
                                          <button
                                                className="text-sm text-[#4E53B1] hover:underline font-medium"
                                                onClick={() => handleRangeSelect('Last month')}
                                          >
                                                Last month
                                          </button>
                                          <button
                                                onClick={cycleMonthsView}
                                                className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                title="Cycle through months"
                                          >
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                          </button>
                                    </div>
                              </div>

                              <div className="flex">
                                    {/* Calendar Section */}
                                    <div className="flex-1 p-4">
                                          {/* Month Navigation */}
                                          <div className="flex items-center justify-between mb-4">
                                                <button
                                                      onClick={() => navigateMonth('prev')}
                                                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <h4 className="text-sm font-semibold text-gray-900">
                                                      {months[currentMonth]} {currentYear}
                                                </h4>
                                                <button
                                                      onClick={() => navigateMonth('next')}
                                                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                      <ChevronRight className="w-4 h-4 text-gray-600" />
                                                </button>
                                          </div>

                                          {/* Day Headers */}
                                          <div className="grid grid-cols-7 gap-1 mb-2">
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                      <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                                                            {day}
                                                      </div>
                                                ))}
                                          </div>

                                          {/* Calendar Grid */}
                                          <div className="grid grid-cols-7 gap-1">
                                                {renderCalendarDays()}
                                          </div>
                                    </div>

                                    {/* Month Sidebar with Cycling */}
                                    <div className="w-16 border-l border-gray-100 py-4">
                                          <div className="flex flex-col items-center space-y-3">
                                                {getVisibleMonths().map((month, index) => (
                                                      <button
                                                            key={`${month}-${index}-${monthViewOffset}`}
                                                            className={`text-xs px-2 py-1 rounded transition-colors w-10 ${month === monthsShort[currentMonth]
                                                                        ? 'bg-gray-900 text-white font-medium'
                                                                        : 'text-gray-600 hover:bg-gray-100'
                                                                  }`}
                                                            onClick={() => setCurrentMonth(monthsShort.indexOf(month))}
                                                      >
                                                            {month}
                                                      </button>
                                                ))}
                                          </div>
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      );
}