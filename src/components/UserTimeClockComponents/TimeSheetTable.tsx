import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { convertUTCToLocalPretty } from "@/utils/dateUtils";

interface TimeSheetTableProps {
  weeklyData: any[];
  seeNotes: (notes?: string) => void;
  isOvertimeLoading: boolean;
  handleSendOvertimeRequest: (id: string) => void;
  formatWeekRange: (weekStart: string | number | Date, weekEnd: string | number | Date) => string;
}

const TimeSheetTable: React.FC<TimeSheetTableProps> = ({
  weeklyData,
  seeNotes,
  isOvertimeLoading,
  handleSendOvertimeRequest,
  formatWeekRange,
}) => (
  <div className="overflow-x-auto -mx-4 sm:mx-0">
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Date</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Shift</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Start</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">End</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Total Hours</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden md:table-cell">Daily Total</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">Weekly Total</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">Regular</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm hidden lg:table-cell">Overtime</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Notes</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Overtime Status</th>
              <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  No time sheet data available for the selected period
                </td>
              </tr>
            ) : (
              weeklyData.map((week, weekIndex) => (
                <React.Fragment key={`week-${weekIndex}`}>
                  {/* Week Header */}
                  <tr>
                    <td colSpan={12} className="bg-primary text-white text-center py-3 font-medium">
                      {formatWeekRange(week.weekStart, week.weekEnd)} (Weekly Total: {week.weeklyTotal?.toFixed(2)} hours)
                    </td>
                  </tr>
                  {/* Days and Entries */}
                  {[...(week.days || [])]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((day, dayIndex) => (
                      <React.Fragment key={`day-${dayIndex}`}>
                        {[...(day.entries || [])]
                          .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
                          .map((entry, entryIndex) => {
                            const isFirstEntryOfDay = entryIndex === 0;
                            const isFirstWeek = weekIndex === 0;
                            const isFirstDay = dayIndex === 0;
                            const isFirstEntry = entryIndex === 0;
                            const getStatusColor = (status: string) => {
                              switch (status) {
                                case "APPROVED":
                                  return "text-green-600";
                                case "REJECTED":
                                  return "text-red-600";
                                case "PENDING":
                                  return "text-yellow-600";
                                default:
                                  return "text-gray-500";
                              }
                            };
                            return (
                              <tr key={`entry-${entryIndex}`} className="border-b border-gray-100">
                                <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">
                                  {convertUTCToLocalPretty(entry?.end).date}
                                </td>
                                <td className="text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm">
                                  {entry?.shift?.title != null ? String(entry?.shift?.title) : ""}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                                  {convertUTCToLocalPretty(entry?.start).time}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                                  {convertUTCToLocalPretty(entry?.end).time}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">
                                  {entry?.totalHours?.toFixed(2)} Hours
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden md:table-cell">
                                  {isFirstEntryOfDay ? `${day.totalHours?.toFixed(2)} Hours` : ""}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                                  {isFirstWeek && isFirstDay && isFirstEntry ? `${week.weeklyTotal?.toFixed(2)} Hours` : ""}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                                  {entry?.regular?.toFixed(2)} Hours
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm hidden lg:table-cell">
                                  {entry?.overtime?.toFixed(2)} Hours
                                </td>
                                <td className="py-3 px-2 sm:px-4">
                                  {entry?.notes ? (
                                    <button
                                      className="text-primary hover:text-indigo-800 text-sm"
                                      title={entry.notes}
                                      onClick={() => seeNotes(entry?.notes)}
                                    >
                                      View Notes
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-sm">--</span>
                                  )}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-sm font-semibold">
                                  <span className={getStatusColor(entry.overTimeRequestStatus)}>
                                    {entry?.overTimeRequestStatus}
                                  </span>
                                </td>
                                <td className="py-3 px-2 sm:px-4">
                                  <div className="relative">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger className="outline-none hover:scale-105 active:scale-95 duration-700 cursor-pointer">
                                        <BsThreeDots className="mt-2" />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        side="bottom"
                                        className="bg-[#f7fbfe] border-none shadow-md shadow-secondary-bg-light outline-none p-2 flex flex-col gap-2"
                                      >
                                        <span
                                          className="hover:text-green-700 hover:bg-green-50 border-2 border-[#e9ebec]  py-2 px-5 rounded-lg hover:bg-light-primary-bg dark:hover:bg-dark-secondary-bg font-medium text-sm w-full cursor-pointer flex items-center justify-center"
                                          onClick={() => handleSendOvertimeRequest(entry?.id)}
                                        >
                                          {isOvertimeLoading ? (
                                            <FaSpinner className="animate-spin" />
                                          ) : (
                                            "Send Request"
                                          )}
                                        </span>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
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
);

export default TimeSheetTable;