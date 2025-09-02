/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateRange } from "@/components/TimeOffRequest/EmployeeDetailModal";
import ShiftCalendar from "@/components/TimeOffRequest/ShiftCalendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

interface FilterControlsProps {
  groupBy: string;
  setGroupBy: (value: string) => void;
  dateRange: DateRange;
  // setDateRange: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDateRangeSelect: any;
}

export function FilterControls({
  groupBy,
  setGroupBy,
  dateRange,
  isCalendarOpen,
  setIsCalendarOpen,
  searchQuery,
  setSearchQuery,
  handleDateRangeSelect,
}: FilterControlsProps) {
  const formatDateRange = (): string => {
    if (dateRange.startDate && dateRange.endDate) {
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

      const start = dateRange.startDate.toLocaleDateString("en-US", options);
      const end = dateRange.endDate.toLocaleDateString("en-US", options);

      return `${start} - ${end}`;
    }
    return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 mb-5 border-b-1 border-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Group by</span>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-full sm:w-32 border border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-none">
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="label">Status</SelectItem>
              <SelectItem value="assignedTo">Assignee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Date & Filter Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between rounded-full border border-[#4E53B1] px-4 py-1.5 gap-2 flex-wrap">
            {/* Display Selected Date Range */}
            <span className="text-[#4E53B1]  font-medium">{formatDateRange()}</span>
            {/* Button to Open ShiftCalendar */}
            <button onClick={() => setIsCalendarOpen(true)} className="flex cursor-pointer items-center gap-2 text-gray-600 hover:bg-gray-50">
              <CalendarIcon className="cursor-pointer text-[#4E53B1]" />
              {/* <span className="w-[1px] h-5 bg-[#4E53B1]" />
              <ArrowDownIcon /> */}
            </button>
          </div>
        </div>

        {/* ShiftCalendar Modal */}
        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <ShiftCalendar onClose={() => setIsCalendarOpen(false)} onDateRangeSelect={handleDateRangeSelect} initialDateRange={dateRange} />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#F5F6F7] border-1 border-slate-200 focus-within:ring-0 focus-within:outline-0 ring-slate-100 w-full  sm:max-w-72"
        />
        {/* <Button variant="outline" className="whitespace-nowrap bg-[#4E53B1] rounded-md text-white">
          Export
        </Button> */}
      </div>
    </div>
  );
}
