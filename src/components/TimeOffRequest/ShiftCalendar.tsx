import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState } from "react";

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface ShiftCalendarProps {
  onClose?: () => void;
  onDateRangeSelect?: (dateRange: DateRange) => void;
  initialDateRange?: DateRange;
}

const ShiftCalendar: React.FC<ShiftCalendarProps> = ({
  onClose,
  onDateRangeSelect,
  initialDateRange,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Last month");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // dynamic

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    initialDateRange?.startDate || null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    initialDateRange?.endDate || null
  );
  const [, setIsSelectingRange] = useState<boolean>(false);

  const periods: string[] = ["Today", "Last 8 days", "Last month"];
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const weekDays: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const formatDateRange = (): string => {
    if (selectedStartDate && selectedEndDate) {
      const formatDate = (date: Date): string => {
        const day: string = date.getDate().toString().padStart(2, "0");
        const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
        const year: number = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      return `${formatDate(selectedStartDate)} to ${formatDate(
        selectedEndDate
      )}`;
    }
    return "Select date range";
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const firstDayOfMonth: Date = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth: Date = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday: number = firstDayOfMonth.getDay();
    const daysInMonth: number = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonth: Date = new Date(currentYear, currentMonth - 1, 0);
    const daysInPrevMonth: number = prevMonth.getDate();
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let date = 1; date <= daysInMonth; date++) {
      days.push({
        date,
        isCurrentMonth: true,
        fullDate: new Date(currentYear, currentMonth, date),
      });
    }

    // Next month days to fill the grid
    const remainingDays: number = 42 - days.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        fullDate: new Date(currentYear, currentMonth + 1, date),
      });
    }

    return days;
  };

  const isDateInRange = (date: Date): boolean => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedStartDate) return false;
    if (selectedEndDate) {
      return (
        date.getTime() === selectedStartDate.getTime() ||
        date.getTime() === selectedEndDate.getTime()
      );
    }
    return date.getTime() === selectedStartDate.getTime();
  };

  const handleDateClick = (date: Date, isCurrentMonth: boolean): void => {
    if (!isCurrentMonth) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setIsSelectingRange(true);
    } else if (selectedStartDate && !selectedEndDate) {
      // Complete the range
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
      setIsSelectingRange(false);
    }
  };

  const handlePeriodSelect = (period: string): void => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);

    // Set predefined ranges
    const today: Date = new Date();
    const startOfToday: Date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    switch (period) {
      case "Today":
        setSelectedStartDate(startOfToday);
        setSelectedEndDate(startOfToday);
        break;
      case "Last 8 days": {
        const eightDaysAgo: Date = new Date(startOfToday);
        eightDaysAgo.setDate(eightDaysAgo.getDate() - 7);
        setSelectedStartDate(eightDaysAgo);
        setSelectedEndDate(startOfToday);
        break;
      }
      case "Last month": {
        const lastMonth: Date = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastDayOfLastMonth: Date = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        setSelectedStartDate(lastMonth);
        setSelectedEndDate(lastDayOfLastMonth);
        break;
      }
      default:
        setSelectedStartDate(null);
        setSelectedEndDate(null);
    }
  };

  const navigateMonth = (direction: "prev" | "next"): void => {
    if (direction === "prev") {
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

  const navigateToMonth = (monthIndex: number): void => {
    setCurrentMonth(monthIndex);
  };

  const handleClearSelection = (): void => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedPeriod("Custom Range");
  };

  const handleApplySelection = (): void => {
    if (selectedStartDate && selectedEndDate && onDateRangeSelect) {
      onDateRangeSelect({
        startDate: selectedStartDate,
        endDate: selectedEndDate,
      });
    }

    console.log("Selected Range Shiftcalendar.tsx:", formatDateRange());
  };

  const calendarDays: CalendarDay[] = generateCalendarDays();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Shift Calendar
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            View and manage employee shifts for the month
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Selected Date Range Display */}
      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-sm font-medium text-orange-800">
          Selected Range: {formatDateRange()}
        </p>
      </div>

      {/* Period Selector */}
      <div className="relative mb-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex cursor-pointer items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex space-x-6">
            {periods.map((period) => (
              <span
                key={period}
                className={`text-sm font-medium ${
                  selectedPeriod === period
                    ? "text-gray-900 border-b-2 border-orange-400 pb-1"
                    : "text-gray-600"
                }`}
              >
                {period}
              </span>
            ))}
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodSelect(period)}
                className="w-full px-4 cursor-pointer py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                {period}
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedPeriod("Custom Range");
                setIsDropdownOpen(false);
                setSelectedStartDate(null);
                setSelectedEndDate(null);
              }}
              className="w-full px-4 cursor-pointer py-2 text-left text-sm hover:bg-gray-50 border-t border-gray-100 rounded-b-lg"
            >
              Custom Range
            </button>
          </div>
        )}
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {months[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={() => navigateMonth("next")}
          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week Days Header */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day: CalendarDay, index: number) => {
              const isSelected: boolean = isDateSelected(day.fullDate);
              const isInRange: boolean = isDateInRange(day.fullDate);

              return (
                <button
                  key={index}
                  onClick={() =>
                    handleDateClick(day.fullDate, day.isCurrentMonth)
                  }
                  className={`
                    text-center py-2 text-sm rounded-md transition-colors relative cursor-pointer
                    ${
                      day.isCurrentMonth
                        ? isSelected
                          ? "bg-orange-400 text-white font-medium"
                          : isInRange
                          ? "bg-orange-100 text-orange-800"
                          : "text-gray-900 hover:bg-gray-100"
                        : "text-gray-400"
                    }
                  `}
                >
                  {day.date.toString().padStart(2, "0")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Month Sidebar */}
        <div className="ml-4 flex flex-col space-y-1">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => navigateToMonth(index)}
              className={`
                text-xs px-2 py-1 rounded text-left cursor-pointer
                ${
                  index === currentMonth
                    ? "bg-gray-900 text-white font-medium"
                    : "text-gray-400 hover:text-gray-600"
                }
              `}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={handleClearSelection}
          className="flex-1 px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleApplySelection}
          disabled={!selectedStartDate || !selectedEndDate}
          className="flex-1 px-4 py-2 text-sm cursor-pointer font-medium text-white bg-orange-400 hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default ShiftCalendar;
