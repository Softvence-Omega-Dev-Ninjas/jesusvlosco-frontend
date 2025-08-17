import { useUserTimeRequestMutation } from "@/store/api/admin/user/timeRequest/createUserTimeRequestApi";
import { useGetUserTimeRequestQuery } from "@/store/api/admin/user/timeRequest/getUserTimeRequestApi";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import type React from "react";
import { useState, useMemo } from "react";

// TypeScript interfaces
interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

// Interface for the fetched time off request data (assuming your API response has a 'data' array and a 'total' count)
interface TimeOffRequestData {
  id: string;
  userId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  reason: string;
  isFullDayOff: boolean;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  totalDaysOff: number;
  status: string;
}




// Updated interface for TimeOffPolicy to include remainingDays
interface TimeOffPolicy {
  type: string;
  days: number;
  remainingDays?: number; // Make it optional
}

// DateRangeCalendar Component (No changes needed here as it's self-contained)
const DateRangeCalendar: React.FC<{
  onClose: () => void;
  onDateRangeSelect: (dateRange: DateRange) => void;
  initialDateRange?: DateRange;
}> = ({ onClose, onDateRangeSelect, initialDateRange }) => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    initialDateRange?.startDate || null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    initialDateRange?.endDate || null
  );

  const months: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const weekDays: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
        date.toDateString() === selectedStartDate.toDateString() ||
        date.toDateString() === selectedEndDate.toDateString()
      );
    }
    return date.toDateString() === selectedStartDate.toDateString();
  };

  const handleDateClick = (date: Date, isCurrentMonth: boolean): void => {
    if (!isCurrentMonth) return;

    // Normalize date to start of day for accurate comparison
    const clickedDate = new Date(date);
    clickedDate.setHours(0, 0, 0, 0);

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection or reset if a range is already selected
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      // Complete the range or set as single day if same date clicked again
      if (clickedDate.toDateString() === selectedStartDate.toDateString()) {
        setSelectedEndDate(null); // Deselect if same date clicked
        setSelectedStartDate(null);
      } else if (clickedDate < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(clickedDate);
      } else {
        setSelectedEndDate(clickedDate);
      }
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

  const handleClearSelection = (): void => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleApplySelection = (): void => {
    if (selectedStartDate) { // Allow applying a single date
      onDateRangeSelect({
        startDate: selectedStartDate,
        endDate: selectedEndDate || selectedStartDate, // If only start date, end date is same
      });
    }
    onClose();
  };

  const formatDateRange = (): string => {
    const formatDate = (date: Date): string => {
      const day: string = date.getDate().toString().padStart(2, "0");
      const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
      const year: number = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    if (selectedStartDate && selectedEndDate && selectedStartDate.toDateString() !== selectedEndDate.toDateString()) {
      return `${formatDate(selectedStartDate)} to ${formatDate(selectedEndDate)}`;
    } else if (selectedStartDate) {
      return formatDate(selectedStartDate);
    }
    return "Select date range";
  };

  const calendarDays: CalendarDay[] = useMemo(generateCalendarDays, [currentYear, currentMonth]); // Memoize calendar days

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Select Date Range</h2>
          <p className="text-sm text-gray-600 mt-1">Choose your time off dates</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Selected Date Range Display */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-800">
          Selected Range: {formatDateRange()}
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {months[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={() => navigateMonth("next")}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>

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
              onClick={() => handleDateClick(day.fullDate, day.isCurrentMonth)}
              className={`
                text-center py-2 text-sm rounded-md transition-colors relative
                ${
                  day.isCurrentMonth
                    ? isSelected
                      ? "bg-blue-500 text-white font-medium"
                      : isInRange
                      ? "bg-blue-100 text-blue-800"
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

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={handleClearSelection}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleApplySelection}
          disabled={!selectedStartDate} // Only disable if no start date is selected
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

// Main TimeOff Component
export default function TimeOffComponent() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [allDayOff, setAllDayOff] = useState(true);
  const [timeOffType, setTimeOffType] = useState("sick-leave");
  const [note, setNote] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null
  });
  const [submissionErrors, setSubmissionErrors] = useState<string[]>([]); // New state for displaying server errors

  // Pagination states for the table display
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can make this configurable

  const initialTimeOffPolicies: TimeOffPolicy[] = useMemo(() => [
    { type: "Time off", days: 22 },
    { type: "Sick leave", days: 10 },
    { type: "Casual leave", days: 12 },
    { type: "Unpaid leave", days: 8 },
  ], []);

  // --- API Calls ---

  // 1. Fetch paginated time-off requests for the table display
  const {
    data: paginatedTimeData,
    isLoading: isPaginatedTimeDataLoading,
    isError: isPaginatedTimeDataError
  } = useGetUserTimeRequestQuery(
    { page: currentPage, limit: itemsPerPage }
  );

  // 2. Fetch ALL time-off requests for accurate remaining days calculation
  // We use a very large limit to try and get all records.
  // Ideally, your API would have a dedicated endpoint for this summary or return total approved days per policy.
  const {
    data: allTimeData,
    
  } = useGetUserTimeRequestQuery(
    { limit: 999999999 } // Fetch a very large number of records to get "all"
  );

  const [createTimeOffRequest, { isLoading, isSuccess, isError }] =
    useUserTimeRequestMutation();

  // Calculate remaining days for policies using ALL fetched data
  const timeOffPolicies: TimeOffPolicy[] = useMemo(() => {
    if (!allTimeData || !allTimeData.data) {
      return initialTimeOffPolicies;
    }

    const approvedDaysUsed: { [key: string]: number } = {};
    allTimeData.data.forEach((request: TimeOffRequestData) => { // Use allTimeData.data for accurate calculation
      if (request.status.toLowerCase() === "approved") {
        // Normalize reason to match policy types (e.g., "sick-leave" to "Sick leave")
        const policyTypeKey = initialTimeOffPolicies.find(
          (policy) => policy.type.toLowerCase().replace(' ', '-') === request.reason.toLowerCase()
        )?.type;

        if (policyTypeKey) {
          approvedDaysUsed[policyTypeKey] = (approvedDaysUsed[policyTypeKey] || 0) + request.totalDaysOff;
        }
      }
    });

    return initialTimeOffPolicies.map(policy => ({
      ...policy,
      remainingDays: policy.days - (approvedDaysUsed[policy.type] || 0)
    }));
  }, [allTimeData, initialTimeOffPolicies]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionErrors([]); // Clear previous errors

    // Client-side validation before sending to server
    if (!dateRange.startDate || !dateRange.endDate) {
      setSubmissionErrors(["Please select a start and end date for your time off."]);
      return;
    }

    const calculatedDays = calculateTotalDays();
    if (calculatedDays < 1) {
      setSubmissionErrors(["Total time off days must be at least 1."]);
      return;
    }

    const formData = {
      type: timeOffType,
      isFullDayOff: allDayOff,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      reason: timeOffType, // Ensure reason matches the policy types
      totalDaysOff: calculatedDays,
    };

    try {
      await createTimeOffRequest(formData).unwrap();
      console.log("Time off request submitted successfully!");
      setIsPopupOpen(false);
      // Optionally, reset form fields or show a success message
      setNote(""); // Clear note
      setDateRange({ startDate: null, endDate: null }); // Clear date range
      setAllDayOff(true); // Reset all day toggle
      setTimeOffType("sick-leave"); // Reset type
    } catch (err: any) {
      console.error("Failed to submit time off request:", err);
      if (err.data && Array.isArray(err.data.message)) {
        setSubmissionErrors(err.data.message); // Set server-side validation errors
        console.error("Server validation errors:", err.data.message);
      } else if (err.data && err.data.message) {
        setSubmissionErrors([err.data.message]); // If message is a single string
        console.error("Server error message:", err.data.message);
      }
      else {
        setSubmissionErrors(["An unexpected error occurred. Please try again."]);
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  const handleDateRangeSelect = (selectedRange: DateRange) => {
    setDateRange(selectedRange);
    console.log("Selected date range:", selectedRange);
    setSubmissionErrors([]); // Clear errors when date range is selected
  };

  const calculateTotalDays = (): number => {
    if (!dateRange.startDate) return 0; // If only start date is selected, it's 1 day

    const start = new Date(dateRange.startDate);
    const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date(dateRange.startDate); // If no end date, it's a single day

    // Set hours to 0 to ensure full day calculation accuracy, avoiding time zone issues
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

    return totalDays;
  };

  const formatDisplayDate = (isoString: string): string => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of year
    return `${day}/${month}/${year}`;
  };

  const getStatusColorClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Pagination logic: Using paginatedTimeData for table total
  const totalPages = paginatedTimeData ? Math.ceil(paginatedTimeData.total / itemsPerPage) : 0;
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-xl font-semibold text-primary">
          Time Off Requests
        </h1>
        <button
          onClick={() => {
            setIsPopupOpen(true);
            setSubmissionErrors([]); // Clear errors when opening modal
          }}
          className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer"
        >
          Request time off
        </button>
      </div>

      <hr className="my-6" />

      {/* Time Off Policies */}
      <div className="mb-8">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Time Off Policies
        </h2>
        <div className="flex flex-wrap gap-6">
          {timeOffPolicies.map((policy, index) => (
            <div key={index} className="bg-primary/10 p-5 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{policy.type}</div>
              <div className="text-xl font-bold text-gray-900">
                {/* Display remainingDays if calculated, otherwise initial days */}
                {policy.remainingDays !== undefined ? policy.remainingDays : policy.days} Days
              </div>
              
            </div>
          ))}
        </div>
      </div>

      <hr className="my-6" />

      {/* Requests History */}
      <div>
        <div className="mb-8">
          <h2 className="text-base font-medium">Requests History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left *:min-w-max *:px-3">
                <th className="pb-3 text-sm font-medium text-primary">
                  Date of time off
                </th>
                <th className="pb-3 text-sm font-medium text-primary">
                  Policy
                </th>
                <th className="pb-3 text-sm font-medium text-primary">
                  Requested on
                </th>
                <th className="pb-3 text-sm font-medium text-primary">
                  Total requested
                </th>
                <th className="pb-3 text-sm font-medium text-primary">
                  Status
                </th>
                <th className="pb-3 text-sm font-medium text-primary">Notes</th>
              </tr>
            </thead>
            <tbody>
              {isPaginatedTimeDataLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Loading requests...
                  </td>
                </tr>
              ) : isPaginatedTimeDataError || !paginatedTimeData || !paginatedTimeData.data ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-red-500">
                    Failed to load time off requests.
                  </td>
                </tr>
              ) : paginatedTimeData.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No time off requests found.
                  </td>
                </tr>
              ) : (
                paginatedTimeData.data.map((request: TimeOffRequestData) => (
                  <tr key={request.id} className="border-t border-gray-200 *:px-3">
                    <td className="py-3 text-sm text-gray-900">
                      {formatDisplayDate(request.startDate)} - {formatDisplayDate(request.endDate)}{request.isFullDayOff ? ' Full day' : ''}
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {request.reason} {/* Assuming 'reason' can be used as 'policy' */}
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {formatDisplayDate(request.createdAt)}
                    </td>
                    <td className="py-3 text-sm text-gray-900">
                      {request.totalDaysOff} Day{request.totalDaysOff !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex min-w-max justify-center px-2 py-1 text-xs font-medium rounded-full w-[60%] ${getStatusColorClass(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  currentPage === index + 1
                    ? "bg-primary text-white"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                New time off request
              </h3>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold w-6 h-6 flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Display submission errors */}
              {submissionErrors.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">Please fix the following issues:</span>
                  <ul className="mt-2 list-disc list-inside">
                    {submissionErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Time off type */}
              <div>
                <label
                  htmlFor="time-off-type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Time off type
                </label>
                <select
                  id="time-off-type"
                  value={timeOffType}
                  onChange={(e) => setTimeOffType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="sick-leave">Sick leave</option>
                  <option value="time-off">Time off</option>
                  <option value="casual-leave">Casual leave</option>
                  <option value="unpaid-leave">Unpaid leave</option>
                </select>
              </div>

              {/* All day toggle */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="all-day"
                  className="text-sm font-medium text-gray-700"
                >
                  All day time off
                </label>
                <button
                  type="button"
                  onClick={() => setAllDayOff(!allDayOff)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    allDayOff ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      allDayOff ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Date picker */}
              <div className="flex justify-between">
                <label
                  htmlFor="date-time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date and time of time off
                </label>
                <div
                  onClick={() => {
                    setIsCalendarOpen(true);
                    setSubmissionErrors([]); // Clear errors when opening calendar
                  }}
                  className="p-2 flex items-center border border-primary text-primary rounded-lg justify-center cursor-pointer hover:bg-primary/5 transition-colors"
                >
                  <Calendar className="border-r px-2 size-4 min-w-max" />
                  <ChevronDown className="size-4 px-2 min-w-max" />
                </div>
              </div>

              {/* Total days */}
              <div className="flex justify-between bg-gray-100 p-2 py-4 rounded-lg items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Total time off days
                </label>
                <div className="text-sm text-gray-600">
                  {calculateTotalDays()} work day{calculateTotalDays() !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Note */}
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Attach a note to your request (max 200 characters)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  maxLength={200} // Added maxLength for client-side hint
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {note.length} / 200
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="bg-green-100 hover:bg-[#1EBD66] text-green-600 hover:text-white py-2 px-8 rounded-full text-sm transition-colors mt-20 cursor-pointer"
                disabled={isLoading || !dateRange.startDate || calculateTotalDays() < 1} // Disable if dates not selected or days < 1
              >
                {isLoading ? "Sending..." : "Send for approval"}
              </button>
              {isSuccess && (
                <p className="text-green-600 text-sm mt-2">Request sent successfully! 🎉</p>
              )}
                {isError && submissionErrors.length === 0 && ( // Generic error if specific ones not captured
                <p className="text-red-600 text-sm mt-2">Failed to send request due to an unknown error. Please try again. ❌</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <DateRangeCalendar
            onClose={() => setIsCalendarOpen(false)}
            onDateRangeSelect={handleDateRangeSelect}
            initialDateRange={dateRange}
          />
        </div>
      )}
    </div>
  );
}