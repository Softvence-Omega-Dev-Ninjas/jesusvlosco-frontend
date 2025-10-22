import React from "react";
import { DateTime } from "luxon";

interface TimeSheetHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
}) => {
  const handleFromChange = (value: string) => {
    const fromIso =
      DateTime.fromISO(value, { zone: "local" }).toUTC().toISO() || "";
    const toIso = dateRange.to;
    if (DateTime.fromISO(fromIso) > DateTime.fromISO(toIso)) {
      onDateRangeChange?.({ from: fromIso, to: fromIso });
    } else {
      onDateRangeChange?.({ from: fromIso, to: toIso });
    }
  };

  const handleToChange = (value: string) => {
    const toIso =
      DateTime.fromISO(value, { zone: "local" }).toUTC().toISO() || "";
    const fromIso = dateRange.from;
    if (DateTime.fromISO(toIso) < DateTime.fromISO(fromIso)) {
      onDateRangeChange?.({ from: toIso, to: toIso });
    } else {
      onDateRangeChange?.({ from: fromIso, to: toIso });
    }
  };

  return (
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
              alt={`${userData?.firstName || "User"} ${
                userData?.lastName || ""
              }`}
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
          <div className="flex items-center gap-1">
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
          </div>
        </div>

        <div className="flex items-center gap-2 justify-start px-5 border-l border-gray-300">
          <label className="font-semibold" htmlFor="monthSelector">
            Select month:
          </label>
          <input
            id="monthSelector"
            value={month}
            onChange={(e) => setMonth?.(e.target.value)}
            type="month"
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-2 justify-start px-5 border-l border-gray-300">
          <label className="font-semibold" htmlFor="fromDate">
            Select Date Range:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="fromDate"
              type="date"
              value={
                dateRange.from
                  ? DateTime.fromISO(dateRange.from)
                      .toLocal()
                      .toFormat("yyyy-MM-dd")
                  : ""
              }
              onChange={(e) => handleFromChange(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <span>to</span>
            <input
              id="toDate"
              type="date"
              value={
                dateRange.to
                  ? DateTime.fromISO(dateRange.to)
                      .toLocal()
                      .toFormat("yyyy-MM-dd")
                  : ""
              }
              onChange={(e) => handleToChange(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
