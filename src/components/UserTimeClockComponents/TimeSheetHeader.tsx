import React from "react";

interface TimeSheetHeaderProps {
  userData: any;
  dateRange: { from: string; to: string };
  formatDateRange: (from: string, to: string) => string;
  handleDateRangeChange: (direction: "prev" | "next") => void;
  month?: string; // YYYY-MM
  setMonth?: (month: string) => void; // handler to update month (YYYY-MM)
  onDateRangeChange?: (range: { from: string; to: string }) => void;
}

export const TimeSheetHeader: React.FC<TimeSheetHeaderProps> = ({
  userData,
  dateRange,
  formatDateRange,
  handleDateRangeChange,
  month = "",
  setMonth,
  onDateRangeChange,
}) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
    <div className="flex flex-col justify-between sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <img
            src={
              userData?.profileUrl !== "N/A"
                ? userData?.profileUrl
                : `https://ui-avatars.com/api/?name=${userData?.firstName}+${userData?.lastName}`
            }
            alt={`${userData?.firstName || "User"} ${userData?.lastName || ""}`}
            className="rounded-full size-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">
            {userData?.firstName || "User"} {userData?.lastName || ""}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 text-[#484848] font-semibold">
        <span>Weekly Pay Period:</span>
        <button className="flex items-center gap-1">
          <button
            onClick={() => handleDateRangeChange("prev")}
            className="hover:text-gray-600 transition-colors"
          >
            {"<"}
          </button>
          <span className="mx-2">
            {formatDateRange(dateRange.from, dateRange.to)}
          </span>
          <button
            onClick={() => handleDateRangeChange("next")}
            className="hover:text-gray-600 transition-colors"
          >
            {">"}
          </button>
        </button>
      </div>

      <div className="flex items-center gap-2 justify-start px-5 border-l border-gray-300">
        <label className="font-semibold" htmlFor="monthSelector">Select month:</label>
        <input
          id="monthSelector"
          value={month}
          onChange={(e) => setMonth?.(e.target.value)}
          type="month"
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-2 justify-start px-5 border-l border-gray-300">
        <label className="font-semibold" htmlFor="fromDate">Select Date Range:</label>
       <div className="flex items-center gap-2">
         <input
           id="fromDate"
           type="date"
           value={dateRange.from ? new Date(dateRange.from).toISOString().slice(0,10) : ""}
           onChange={(e) => {
             const fromIso = new Date(e.target.value).toISOString();
             const toIso = dateRange.to;
             // ensure from <= to
             if (new Date(fromIso) > new Date(toIso)) {
               // set to same day
               onDateRangeChange?.({ from: fromIso, to: fromIso });
             } else {
               onDateRangeChange?.({ from: fromIso, to: toIso });
             }
           }}
           className="border border-gray-300 rounded px-2 py-1"
         />
         <span>to</span>
         <input
           id="toDate"
           type="date"
           value={dateRange.to ? new Date(dateRange.to).toISOString().slice(0,10) : ""}
           onChange={(e) => {
             const toIso = new Date(e.target.value).toISOString();
             const fromIso = dateRange.from;
             if (new Date(toIso) < new Date(fromIso)) {
               onDateRangeChange?.({ from: toIso, to: toIso });
             } else {
               onDateRangeChange?.({ from: fromIso, to: toIso });
             }
           }}
           className="border border-gray-300 rounded px-2 py-1"
         />
       </div>
      </div>
    </div>
  </div>
);