import React from "react";

interface TimeSheetHeaderProps {
  userData: any;
  dateRange: { from: string; to: string };
  formatDateRange: (from: string, to: string) => string;
  handleDateRangeChange: (direction: "prev" | "next") => void;
}

export const TimeSheetHeader: React.FC<TimeSheetHeaderProps> = ({
  userData,
  dateRange,
  formatDateRange,
  handleDateRangeChange,
}) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
      <div className="flex items-center gap-2 text-[#484848] font-semibold">
        <span>Pay Period:</span>
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
    </div>
  </div>
);