import React, { useState, useEffect, useRef } from 'react';

// Helper data for months
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const monthNameToNumber = (monthName: string): number => {
  return monthNames.indexOf(monthName);
};

interface CalendarDate {
  day: string;
  month: string;
  year: string;
}

interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateChange: (dateRange: string) => void;
}

const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({ isOpen, onClose, onDateChange }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const today = new Date();
  const currentDay = String(today.getDate()).padStart(2, '0');
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = String(today.getFullYear());

  const [fromDate, setFromDate] = useState<CalendarDate>({
    day: currentDay,
    month: currentMonth,
    year: currentYear,
  });

  const [toDate, setToDate] = useState<CalendarDate>({
    day: currentDay,
    month: currentMonth,
    year: currentYear,
  });

  const [activeCalendarDateType, setActiveCalendarDateType] = useState<'from' | 'to'>('from');

  const daysInMonth = (month: string, year: string): number => {
    const monthIndex = monthNameToNumber(month);
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: string, year: string): number => {
    const monthIndex = monthNameToNumber(month);
    return new Date(parseInt(year), monthIndex, 1).getDay();
  };

  const calendarDays = React.useMemo(() => {
    const numDays = daysInMonth(fromDate.month, fromDate.year);
    const firstDay = getFirstDayOfMonth(fromDate.month, fromDate.year);

    const daysArray: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= numDays; i++) {
      daysArray.push(i);
    }

    const remainingSlots = 7 - (daysArray.length % 7);
    if (remainingSlots !== 7) {
      daysArray.push(...Array(remainingSlots).fill(null));
    }

    return daysArray;
  }, [fromDate.month, fromDate.year]);

  const onCalendarDayClick = (day: number) => {
    const newDate: CalendarDate = {
      day: String(day).padStart(2, '0'),
      month: fromDate.month,
      year: fromDate.year,
    };

    if (activeCalendarDateType === 'from') {
      setFromDate(newDate);
      setActiveCalendarDateType('to');
    } else {
      setToDate(newDate);
      const from = new Date(parseInt(fromDate.year), monthNameToNumber(fromDate.month), parseInt(fromDate.day));
      const to = new Date(parseInt(newDate.year), monthNameToNumber(newDate.month), parseInt(newDate.day));
      if (to < from) {
        setFromDate(newDate);
        setToDate({ ...fromDate });
      }
    }
  };

  const isDateInRange = (day: number) => {
    const current = new Date(parseInt(fromDate.year), monthNameToNumber(fromDate.month), day);
    const start = new Date(parseInt(fromDate.year), monthNameToNumber(fromDate.month), parseInt(fromDate.day));
    const end = new Date(parseInt(toDate.year), monthNameToNumber(toDate.month), parseInt(toDate.day));
    const min = start < end ? start : end;
    const max = start < end ? end : start;
    return current >= min && current <= max;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current && !(e.target as HTMLElement).closest('.no-drag')) {
      setIsDragging(true);
      setOffsetX(e.clientX - modalRef.current.getBoundingClientRect().left);
      setOffsetY(e.clientY - modalRef.current.getBoundingClientRect().top);
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && modalRef.current) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      modalRef.current.style.left = `${x}px`;
      modalRef.current.style.top = `${y}px`;
      modalRef.current.style.transform = 'none';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto relative  "
        style={{ left: offsetX, top: offsetY }}
      >
        {/* Modal Body */}
        <div className="p-3 border-2 border-gray-300 m-4 rounded-md">
          <div className="flex  justify-between items-start mb-4 gap-8">
            {/* From Section */}
            <div className="flex gap-5   items-center justify-center space-y-2 no-drag flex-1">
              <div
                className={`text-lg font-medium text-[#4F46E5] cursor-pointer ${activeCalendarDateType === 'from' ? 'border-b-2 border-[#4F46E5]' : ''}`}
                onClick={() => setActiveCalendarDateType('from')}
              >
                From
              </div>
              <div className="flex items-center space-x-2">
                <select className="px-2 py-2 border rounded-md text-sm" value={fromDate.day} onChange={(e) => setFromDate({ ...fromDate, day: e.target.value })}>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{String(i + 1).padStart(2, "0")}</option>
                  ))}
                </select>
                <select className="px-2 py-2 border rounded-md text-sm" value={fromDate.month} onChange={(e) => setFromDate({ ...fromDate, month: e.target.value })}>
                  {monthNames.map((month) => <option key={month} value={month}>{month}</option>)}
                </select>
                <select className="px-2 py-2 border rounded-md text-sm" value={fromDate.year} onChange={(e) => setFromDate({ ...fromDate, year: e.target.value })}>
                  {Array.from({ length: 10 }, (_, i) => <option key={2020 + i} value={String(2020 + i)}>{2020 + i}</option>)}
                </select>
              </div>
            </div>

            {/* To Section */}
            <div className="flex gap-5   items-center justify-center  space-y-2 no-drag flex-1">
              <div
                className={`text-lg font-medium text-[#4F46E5] cursor-pointer ${activeCalendarDateType === 'to' ? 'border-b-2 border-[#4F46E5]' : ''}`}
                onClick={() => setActiveCalendarDateType('to')}
              >
                To
              </div>
              <div className="flex items-center space-x-2">
                <select className="px-2 py-2 border rounded-md text-sm" value={toDate.day} onChange={(e) => setToDate({ ...toDate, day: e.target.value })}>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{String(i + 1).padStart(2, "0")}</option>
                  ))}
                </select>
                <select className="px-2 py-2 border rounded-md text-sm" value={toDate.month} onChange={(e) => setToDate({ ...toDate, month: e.target.value })}>
                  {monthNames.map((month) => <option key={month} value={month}>{month}</option>)}
                </select>
                <select className="px-2 py-2 border rounded-md text-sm" value={toDate.year} onChange={(e) => setToDate({ ...toDate, year: e.target.value })}>
                  {Array.from({ length: 10 }, (_, i) => <option key={2020 + i} value={String(2020 + i)}>{2020 + i}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="mt-6 px-2">
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 font-medium mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {calendarDays.map((day, index) => {
                const firstDayOfMonth = getFirstDayOfMonth(fromDate.month, fromDate.year);
                const isPrev = index < firstDayOfMonth;
                const isNext = (index - firstDayOfMonth + 1) > daysInMonth(fromDate.month, fromDate.year);
                const isSelected = day !== null && isDateInRange(day);
                return (
                  <div
                    key={index}
                    onClick={() => day !== null && onCalendarDayClick(day)}
                    className={`text-sm rounded-md w-9 h-9 flex items-center justify-center
                      ${day === null || isPrev || isNext ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}
                      ${isSelected ? "bg-[#FFBA5C] text-black font-medium" : "hover:bg-gray-100"}`}
                  >
                    {day !== null ? String(day).padStart(2, "0") : ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
     
      </div>
    </div>
  );
};

export default DateRangePickerModal;
