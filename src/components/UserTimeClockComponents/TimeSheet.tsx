/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetClockSheetQuery,
  useSubmitClockSheetMutation,
} from "@/store/api/clockInOut/clockinoutapi";
import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useSendOvertimeRequestMutation } from "@/store/api/admin/overtime";
import { userDefaultTimeZone } from "@/utils/dateUtils";
import TimeSheetSummaryCards from "./TimeSheetSummaryCards";
import TimeSheetTable from "./TimeSheetTable";
import { TimeSheetHeader } from "./TimeSheetHeader";
import { DateTime } from "luxon";
import { exportTimesheetPdf } from "@/utils/exportTimesheet";

export default function TimeSheet() {
  const [submitClockSheet] = useSubmitClockSheetMutation();
  const [isOvertimeLoading, setIsOvertimeLoading] = useState(false);
  const [sendOvertimeRequest] = useSendOvertimeRequestMutation();
  // Date range state for API query
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );
    return {
      from: startOfWeek.toISOString(),
      to: endOfWeek.toISOString(),
    };
  });

  // month as YYYY-MM string used for the month <input type="month" />
  const [month, setMonth] = useState<string>(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    return `${today.getFullYear()}-${mm}`;
  });
  console.log("Date Range State:", dateRange.from, dateRange.to);
  console.log("Month State (YYYY-MM):", month);

  const clockSheets = useGetClockSheetQuery({
    from: dateRange.from,
    to: dateRange.to,
  });

  const formatWeekRange = (
    weekStart: string | number | Date,
    weekEnd: string | number | Date,
    timeZone: string = userDefaultTimeZone()
  ) => {
    const start = DateTime.fromJSDate(new Date(weekStart), {
      zone: "utc",
    }).setZone(timeZone);
    const end = DateTime.fromJSDate(new Date(weekEnd), { zone: "utc" }).setZone(
      timeZone
    );

    return `${start.toFormat("dd/MM")} - ${end.toFormat("dd/MM")}`;
  };

  const formatDateRange = (
    from: string | Date,
    to: string | Date,
    timeZone: string = userDefaultTimeZone()
  ) => {
    const startDate = DateTime.fromJSDate(new Date(from), {
      zone: "utc",
    }).setZone(timeZone);
    const endDate = DateTime.fromJSDate(new Date(to), { zone: "utc" }).setZone(
      timeZone
    );

    const formatDateOnly = (dt: DateTime) => dt.toFormat("dd/MM");

    return `${formatDateOnly(startDate)} to ${formatDateOnly(endDate)}`;
  };

  const handleDateRangeChange = (direction: "prev" | "next") => {
    const currentStart = new Date(dateRange.from);
    const currentEnd = new Date(dateRange.to);
    if (direction === "prev") {
      currentStart.setDate(currentStart.getDate() - 7);
      currentEnd.setDate(currentEnd.getDate() - 7);
    } else {
      currentStart.setDate(currentStart.getDate() + 7);
      currentEnd.setDate(currentEnd.getDate() + 7);
    }
    setDateRange({
      from: currentStart.toISOString(),
      to: currentEnd.toISOString(),
    });
  };

  // Update month string and adjust dateRange to cover that month
  const setMonthString = (monthStr: string) => {
    setMonth(monthStr);
    // monthStr expected in "YYYY-MM"
    const [y, m] = monthStr.split("-").map(Number);
    if (!y || !m) return;
    const startOfMonth = new Date(y, m - 1, 1);
    const endOfMonth = new Date(y, m, 0);
    setDateRange({
      from: startOfMonth.toISOString(),
      to: endOfMonth.toISOString(),
    });
  };

  // Handler for header date range inputs (expects ISO strings)
  const handleHeaderDateRangeChange = (range: { from: string; to: string }) => {
    // Basic validation and ensure ISO strings
    const fromIso = new Date(range.from).toISOString();
    const toIso = new Date(range.to).toISOString();
    setDateRange({ from: fromIso, to: toIso });
  };

  if (clockSheets?.isLoading) {
    return (
      <div className="px-4 lg:px-0 flex justify-center items-center py-12">
        <div className="text-gray-500">Loading timesheet...</div>
      </div>
    );
  }

  if (clockSheets?.error) {
    return (
      <div className="px-4 lg:px-0 flex justify-center items-center py-12">
        <div className="text-red-500">Error loading timesheet data</div>
      </div>
    );
  }

  const userData = clockSheets?.data?.data?.clockSheet?.user;
  const rawWeeklyData = clockSheets?.data?.data?.clockSheet?.result || [];
  const paymentData = clockSheets?.data?.data?.paymentData;
  const weeklyData = [...rawWeeklyData].sort(
    (a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
  );

  const seeNotes = (notes?: string) => {
    Swal.fire({
      title: "Shift Notes",
      text: notes ?? "No notes available",
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const handleSubmit = async () => {
    const data = {
      from: dateRange.from,
      to: dateRange.to,
    };
    try {
      await submitClockSheet(data).unwrap();
      Swal.fire({
        title: "Success",
        text: "Clock sheet submitted successfully",
        icon: "success",
        confirmButtonText: "Close",
      });
    } catch (error) {
      console.error("Failed to submit clock sheet:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to submit clock sheet",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  const handleSendOvertimeRequest = async (id: string) => {
    setIsOvertimeLoading(true);
    try {
      const result = await sendOvertimeRequest({ id }).unwrap();
      if (result?.success) {
        toast.success("Overtime request send successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    } finally {
      setIsOvertimeLoading(false);
    }
  };

  const handleExport = () => {
    const userData = clockSheets?.data?.data?.clockSheet?.user;
    const rawWeeklyData = clockSheets?.data?.data?.clockSheet?.result || [];
    const weeklyData = [...rawWeeklyData].sort(
      (a, b) =>
        new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
    );
    const paymentData = clockSheets?.data?.data?.paymentData;

    exportTimesheetPdf({
      userData,
      weeklyData,
      paymentData,
      dateRange,
    });
  };

  return (
    <div className="px-4 lg:px-0">
      <TimeSheetHeader
        userData={userData}
        dateRange={dateRange}
        formatDateRange={formatDateRange}
        handleDateRangeChange={handleDateRangeChange}
        month={month}
        setMonth={setMonthString}
        onDateRangeChange={handleHeaderDateRangeChange}
      />
      <TimeSheetSummaryCards
        paymentData={paymentData}
        handleSubmit={handleSubmit}
        exportToPDF={handleExport}
      />
      <TimeSheetTable
        weeklyData={weeklyData}
        seeNotes={seeNotes}
        isOvertimeLoading={isOvertimeLoading}
        handleSendOvertimeRequest={handleSendOvertimeRequest}
        formatWeekRange={formatWeekRange}
      />
    </div>
  );
}
