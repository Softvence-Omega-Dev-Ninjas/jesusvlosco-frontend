/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetClockSheetQuery } from "@/store/api/clockInOut/clockinoutapi";
import { useState } from "react";
import React from "react";
import Swal from "sweetalert2";

export default function TimeSheet() {
  // Date range state for API query
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return {
      from: startOfWeek.toISOString(),
      to: endOfWeek.toISOString()
    };
  });

  
  // Pass date range to API query
  const clockSheets = useGetClockSheetQuery({
    from: dateRange.from,
    to: dateRange.to
  });
  
  // console.log("clockSheets", clockSheets);

  // Helper functions
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayName} ${day}/${month}`;
  };

  const formatTime = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatWeekRange = (weekStart: string | number | Date, weekEnd: string | number | Date) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  const formatDateRange = (from: string, to: string) => {
    const startDate = new Date(from);
    const endDate = new Date(to);
    
    const formatDateOnly = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    };

    return `${formatDateOnly(startDate)} to ${formatDateOnly(endDate)}`;
  };


  const handleDateRangeChange = (direction: 'prev' | 'next') => {
    const currentStart = new Date(dateRange.from);
    const currentEnd = new Date(dateRange.to);
    
    if (direction === 'prev') {
      // Go to previous week
      currentStart.setDate(currentStart.getDate() - 7);
      currentEnd.setDate(currentEnd.getDate() - 7);
    } else {
      // Go to next week
      currentStart.setDate(currentStart.getDate() + 7);
      currentEnd.setDate(currentEnd.getDate() + 7);
    }
    
    setDateRange({
      from: currentStart.toISOString(),
      to: currentEnd.toISOString()
    });
  };

  // Show loading state
  if (clockSheets?.isLoading) {
    return (
      <div className="px-4 lg:px-0 flex justify-center items-center py-12">
        <div className="text-gray-500">Loading timesheet...</div>
      </div>
    );
  }

  // Show error state
  if (clockSheets?.error) {
    return (
      <div className="px-4 lg:px-0 flex justify-center items-center py-12">
        <div className="text-red-500">Error loading timesheet data</div>
      </div>
    );
  }

  // Extract data and sort by latest first
  // const totals = calculateTotals();
  const userData = clockSheets?.data?.data?.clockSheet?.user;
  const rawWeeklyData = clockSheets?.data?.data?.clockSheet?.result || [];
  const paymentData = clockSheets?.data?.data?.paymentData
  
  // Sort weekly data by weekStart date (latest first)
  const weeklyData = [...rawWeeklyData].sort((a, b) => 
    new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
  );

  const seeNotes = (notes?: string) => {
    Swal.fire({
      title: 'Shift Notes',
      text: notes ?? 'No notes available',
      icon: 'info',
      confirmButtonText: 'Close'
    });
  };

  return (
    <div className="px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={userData?.profileUrl !== "N/A" ? userData?.profileUrl : "https://i.pravatar.cc"}
                alt={`${userData?.firstName || 'User'} ${userData?.lastName || ''}`}
                className="rounded-full size-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">
                {userData?.firstName || 'User'} {userData?.lastName || ''}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#484848] font-semibold">
            <span>Pay Period:</span>
            <button className="flex items-center gap-1">
              <button 
                onClick={() => handleDateRangeChange('prev')}
                className="hover:text-gray-600 transition-colors"
              >
                {"<"}
              </button>
              <span className="mx-2">
                {formatDateRange(dateRange.from, dateRange.to)}
              </span>
              <button 
                onClick={() => handleDateRangeChange('next')}
                className="hover:text-gray-600 transition-colors"
              >
                {">"}
              </button>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="hidden px-6 py-2 bg-[#1EBD66] text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
            Submit timesheet
          </button>
          <button className="hidden px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors items-center justify-center gap-2">
            Export
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4 lg:gap-6 mb-8 items-center">
        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            {Number(paymentData?.payPerDay?.regularPayRate ?? 0).toFixed(2)} $
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Regular Pay per day</div>
        </div>

        <div className="text-base lg:text-lg font-medium text-gray-900">|</div>

        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            {Number(paymentData?.payPerDay?.overTimePayRate ?? 0).toFixed(2)} $
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Overtime Pay per day</div>
        </div>

        <div className="text-base lg:text-lg font-medium text-gray-900">|</div>

        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            {Number(paymentData?.totalRegularHour ?? 0).toFixed(2)}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Regular Total Hours</div>
        </div>

        <div className="text-base lg:text-lg font-medium text-gray-900">+</div>

        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            {Number(paymentData?.totalOvertimeHour ?? 0).toFixed(2)}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Overtime Total Hours</div>
        </div>

        <div className="text-base lg:text-lg font-medium text-gray-900">=</div>

        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            {(
              Number(paymentData?.totalRegularHour ?? 0) +
              Number(paymentData?.totalOvertimeHour ?? 0)
            ).toFixed(2)}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Total Paid Hours</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Shift
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Start
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    End
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Total Hours
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden md:table-cell">
                    Daily Total
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">
                    Weekly Total
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">
                    Regular
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">
                    Overtime
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-500">
                      No time sheet data available for the selected period
                    </td>
                  </tr>
                ) : (
                  weeklyData.map((week: { weekStart: any; weekEnd: any; weeklyTotal: number; days: any[]; }, weekIndex: number) => (
                    <React.Fragment key={`week-${weekIndex}`}>
                      {/* Week Header */}
                      <tr>
                        <td
                          colSpan={10}
                          className="bg-primary text-white text-center py-3 font-medium"
                        >
                          {formatWeekRange(week.weekStart, week.weekEnd)} (Weekly Total: {week.weeklyTotal?.toFixed(2)} hours)
                        </td>
                      </tr>
                      
                      {/* Days and Entries - Sort days by date (latest first) */}
                      {([...(week.days || [])]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((day: { entries: any[]; totalHours: number; }, dayIndex: number) => (
                        <React.Fragment key={`day-${dayIndex}`}>
                          {/* Sort entries by start time (latest first) */}
                          {([...(day.entries || [])]).sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
                            .map((entry: { date: any; shift: { title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; start: any; end: any; totalHours: number; regular: number; overtime: number; notes: string | undefined; }, entryIndex: number) => {
                            const isFirstEntryOfDay = entryIndex === 0;
                            const isFirstWeek = weekIndex === 0;
                            const isFirstDay = dayIndex === 0;
                            const isFirstEntry = entryIndex === 0;
                            
                            return (
                              <tr key={`entry-${entryIndex}`} className="border-b border-gray-100">
                                <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                                  {formatDate(entry.date)}
                                </td>

                                <td className="text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm">
                                  {entry.shift?.title != null ? String(entry.shift.title) : ""}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                                  {formatTime(entry.start)}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                                  {formatTime(entry.end)}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                                  {entry.totalHours?.toFixed(2)} Hours
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                                  {isFirstEntryOfDay ? `${day.totalHours?.toFixed(2)} Hours` : ''}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                                  {isFirstWeek && isFirstDay && isFirstEntry ? `${week.weeklyTotal?.toFixed(2)} Hours` : ''}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                                  {entry.regular?.toFixed(2)} Hours
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                                  {entry.overtime?.toFixed(2)} Hours
                                </td>
                                <td className="py-3 px-2 sm:px-4">
                                  {entry.notes ? (
                                    <button 
                                      className="text-primary hover:text-indigo-800 text-sm"
                                      title={entry.notes}
                                      onClick={() => seeNotes(entry.notes)}
                                    >
                                      View Notes
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-sm">--</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}