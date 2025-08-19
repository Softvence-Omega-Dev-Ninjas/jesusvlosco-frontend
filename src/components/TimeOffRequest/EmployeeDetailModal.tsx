/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSingleTimeOffRequestQuery } from "@/store/api/admin/dashboard/TimeOffRequestsApi";
import React, { useState } from "react";
import {
  ApprovedIcon,
  ArrowDownIcon,
  CalendarIcon,
  CanceledIcon,
  CloseIcon,
} from "./Icons";
import ShiftCalendar from "./ShiftCalendar"; // Import ShiftCalendar component

interface EmployeeDetailModalProps {
  employee: string | null;
  onClose: () => void;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const Avatar = ({
  src,
  initials,
  className = "",
}: {
  src?: string;
  initials: string;
  className?: string;
}) => {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-[#484848]">
          {initials}
        </div>
      )}
    </div>
  );
};

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
}) => {
  // State to manage calendar visibility
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  // State to store selected date range
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null, // Default: 01/01/2025
    endDate: null, // Default: 31/12/2025
  });

  const { data, isLoading } = useGetSingleTimeOffRequestQuery({
    page: 1,
    limit: 10,
    userId: employee,
    startDate: dateRange.startDate
      ? dateRange.startDate.toISOString()
      : undefined,
    endDate: dateRange.endDate ? dateRange.endDate.toISOString() : undefined,
  });

  // console.log(data, "tested");

  // Format date range for display
  const formatDateRange = (): string => {
    if (dateRange.startDate && dateRange.endDate) {
      const formatDate = (date: Date): string => {
        const day: string = date.getDate().toString().padStart(2, "0");
        const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
        const year: number = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      return `${formatDate(dateRange.startDate)} to ${formatDate(
        dateRange.endDate
      )}`;
    }
    return `${new Date().toLocaleDateString()}`;
  };

  // Handle date range selection from ShiftCalendar
  const handleDateRangeSelect = (selectedRange: DateRange): void => {
    setDateRange(selectedRange);
    setIsCalendarOpen(false); // Close calendar after selection
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-end p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex justify-between items-center py-6 px-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-[#4E53B1]">
            Time off requests
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-6">
          {/* Date & Filter Controls */}
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              {/* Display Selected Date Range */}
              <span className="text-gray-600 border border-gray-200 rounded-md p-2 font-medium">
                {formatDateRange()}
              </span>
              {/* Button to Open ShiftCalendar */}
              <button
                onClick={() => setIsCalendarOpen(true)}
                className="p-2 border flex cursor-pointer items-center gap-2 border-[#4E53B1] rounded-md text-gray-600 hover:bg-gray-50"
              >
                <CalendarIcon />
                <span className="w-[1px] h-5 bg-[#4E53B1]" />
                <ArrowDownIcon />
              </button>
            </div>
            {/* <button className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
              <SearchIcon />
            </button> */}
          </div>

          {/* ShiftCalendar Modal */}
          {isCalendarOpen && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
              <ShiftCalendar
                onClose={() => setIsCalendarOpen(false)}
                onDateRangeSelect={handleDateRangeSelect}
                initialDateRange={dateRange}
              />
            </div>
          )}

          {/* Leave Requests */}

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : data?.data?.length > 0 ? (
            data.data
              .filter((request: any) => request.status !== "PENDING")
              .map((request: any) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border border-[#4E53B1] mb-4"
                >
                  {/* Header: Avatar and Name */}
                  <div className="flex items-center mb-4">
                    {/* <img
                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                    src={request.user.profile.profileUrl}
                    alt={request.user.profile.firstName}
                  /> */}

                    <Avatar
                      src={request.user.profile.profileUrl}
                      initials={request.user.profile.firstName
                        .split(" ")
                        .map((n: any[]) => n[0])
                        .join("")}
                    />

                    <div className="ml-3">
                      <p className="text-sm font-semibold text-[#4E53B1]">
                        {request.user.profile.firstName}{" "}
                        {request.user.profile.lastName}
                      </p>
                      <p className="text-xs text-[#4E53B1]">
                        Requested on{" "}
                        {new Date(request.createdAt).toLocaleDateString(
                          "en-US"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Request Info */}
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {/* Type + Status */}
                    <div className="grid grid-cols-3 items-center bg-[#EDEEF7] p-4 rounded-md">
                      <span className="font-medium text-[#949494]">
                        Time off type
                      </span>
                      <span className="text-[#4E53B1] font-bold">
                        {request.reason}
                      </span>
                      <div className="flex justify-end">
                        <span
                          className={`px-4 py-0.5 text-xs font-semibold rounded-sm ${
                            request.status === "APPROVED"
                              ? "bg-[#4E53B1] text-white"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status === "APPROVED" ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-3 items-center bg-[#EDEEF7] p-4 rounded-md">
                      <span className="font-medium text-[#949494]">Dates</span>
                      <span className="text-[#4E53B1] font-bold whitespace-nowrap">
                        {new Date(request.startDate).toLocaleDateString(
                          "en-US"
                        )}{" "}
                        <span> - </span>{" "}
                        {new Date(request.endDate).toLocaleDateString("en-US")}
                      </span>
                      <div className="flex justify-end">
                        {/* <span className="text-[#4E53B1]">{request.duration}</span> */}
                        <span className="text-[#4E53B1] font-semibold">
                          <span className="text-[#4E53B1] font-semibold">
                            {(() => {
                              const startTime = new Date(
                                request.startDate
                              ).getTime();
                              const endTime = new Date(
                                request.endDate
                              ).getTime();

                              if (isNaN(startTime) || isNaN(endTime)) {
                                return "Invalid date";
                              }

                              const diffTime = endTime - startTime;
                              const diffDays =
                                Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                              return `${diffDays} day${
                                diffDays > 1 ? "s" : ""
                              }`;
                            })()}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Note */}
                    <div className="grid grid-cols-3 items-center bg-[#EDEEF7] p-4 rounded-md">
                      <span className="font-medium text-[#949494]">Note</span>
                      <span className="text-[#4E53B1] font-bold">
                        {request.reason}
                      </span>
                    </div>

                    {/* Admin Note */}
                    {request?.adminNote && (
                      <div className="grid grid-cols-3 items-center bg-[#EDEEF7] p-4 rounded-md">
                        <span className="font-medium text-[#949494]">
                          Admin note
                        </span>
                        <span className="font-bold text-[#4E53B1] col-span-2">
                          {request?.adminNote}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Footer */}
                  <div
                    className={`mt-4 p-3 rounded-md text-center font-semibold ${
                      request.status === "APPROVED"
                        ? "bg-[#4E53B1] text-white"
                        : "bg-[#DC1E28] text-white"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {request.status === "APPROVED" ? (
                        <ApprovedIcon />
                      ) : (
                        <CanceledIcon />
                      )}
                      {request.status}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500">
              No leave requests found for this employee.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
