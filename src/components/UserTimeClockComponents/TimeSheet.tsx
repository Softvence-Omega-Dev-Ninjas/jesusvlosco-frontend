/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetClockSheetQuery,
  useSubmitClockSheetMutation,
} from "@/store/api/clockInOut/clockinoutapi";
import { useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/logo.jpg";
import { toast } from "sonner";
import { useSendOvertimeRequestMutation } from "@/store/api/admin/overtime";
import { convertUTCToLocalPretty } from "@/utils/dateUtils";

import TimeSheetSummaryCards from "./TimeSheetSummaryCards";
import TimeSheetTable from "./TimeSheetTable";
import { TimeSheetHeader } from "./TimeSheetHeader";

export default function TimeSheet() {
  const [submitClockSheet] = useSubmitClockSheetMutation();
  const [isOvertimeLoading, setIsOvertimeLoading] = useState(false);
  const [sendOvertimeRequest] = useSendOvertimeRequestMutation();
  // Date range state for API query
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
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
    weekEnd: string | number | Date
  ) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  const formatDateRange = (from: string, to: string) => {
    const startDate = new Date(from);
    const endDate = new Date(to);
    const formatDateOnly = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };
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
    setDateRange({ from: startOfMonth.toISOString(), to: endOfMonth.toISOString() });
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
    // Handle form submission
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add company logo with standard dimensions
    try {
      // Use the imported logo directly with jsPDF
      // jsPDF can handle image URLs directly
      doc.addImage(logo, "JPEG", 20, 15, 40, 20);
    } catch (error) {
      console.log("Logo loading failed:", error);
      // Fallback: create a simple logo placeholder
      doc.setDrawColor(52, 73, 94);
      doc.setLineWidth(0.5);
      doc.rect(20, 15, 40, 20);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("LOGO", 40, 27, { align: "center" });
    }

    // Company/Header Information with smaller font
    doc.setFontSize(18); // Reduced from 22
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 73, 94);
    doc.text("EMPLOYEE TIMESHEET", 140, 25, { align: "center" });

    // Add line under header
    doc.setDrawColor(52, 73, 94);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Create two-column layout: Employee Info (left) and Pay Summary (right)
    const leftColumnX = 20;
    const rightColumnX = 110;
    const columnWidth = 80;
    const rowHeight = 25;

    // Employee Information Section (Left Column)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Employee Information", leftColumnX, 45);

    // Employee details box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(leftColumnX, 48, columnWidth, rowHeight);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const employeeName = `${userData?.firstName || "User"} ${
      userData?.lastName || ""
    }`;
    doc.text(`Name: ${employeeName}`, leftColumnX + 5, 55);
    doc.text(
      `Period: ${formatDateRange(dateRange.from, dateRange.to)}`,
      leftColumnX + 5,
      62
    );
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      leftColumnX + 5,
      69
    );

    // Pay Summary Section (Right Column)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Pay Summary", rightColumnX, 45);

    // Summary box
    doc.rect(rightColumnX, 48, columnWidth, rowHeight);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const regularPayRate = Number(
      paymentData?.payPerDay?.regularPayRate ?? 0
    ).toFixed(2);
    const overtimePayRate = Number(
      paymentData?.payPerDay?.overTimePayRate ?? 0
    ).toFixed(2);
    const totalRegularHours = Number(
      paymentData?.totalRegularHour ?? 0
    ).toFixed(2);
    const totalHours = (
      Number(paymentData?.totalRegularHour ?? 0) +
      Number(paymentData?.totalOvertimeHour ?? 0)
    ).toFixed(2);

    // Left side of pay summary
    doc.text(`Reg Rate: $${regularPayRate}/day`, rightColumnX + 5, 55);
    doc.text(`OT Rate: $${overtimePayRate}/day`, rightColumnX + 5, 62);

    // Right side of pay summary
    doc.text(`Reg Hours: ${totalRegularHours}`, rightColumnX + 40, 55);
    doc.text(`Total Hours: ${totalHours}`, rightColumnX + 40, 62);

    // Calculate and show estimated earnings
    const regularEarnings = (
      Number(paymentData?.totalRegularHour ?? 0) * Number(regularPayRate)
    ).toFixed(2);
    const overtimeEarnings = (
      Number(paymentData?.totalOvertimeHour ?? 0) * Number(overtimePayRate)
    ).toFixed(2);
    const totalEarnings = (
      Number(regularEarnings) + Number(overtimeEarnings)
    ).toFixed(2);
    doc.setFont("helvetica", "bold");
    doc.text(`Est. Earnings: $${totalEarnings}`, rightColumnX + 5, 69);

    // Timesheet Details Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Timesheet Details", 20, 93);

    // Prepare table data with week headers on top
    const tableData: any[] = [];

    weeklyData.forEach((week: any) => {
      // Add week header as separate rows
      tableData.push([
        {
          content: `WEEK: ${formatWeekRange(week.weekStart, week.weekEnd)}`,
          colSpan: 4,
          styles: {
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "left",
            fontSize: 10,
          },
        },
        {
          content: `Total Hours: ${week.weeklyTotal?.toFixed(2)}`,
          colSpan: 4,
          styles: {
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "right",
            fontSize: 10,
          },
        },
      ]);

      // Add column headers for this week
      tableData.push([
        {
          content: "Date",
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
        },
        {
          content: "Shift",
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
        },
        {
          content: "Start Time",
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
        },
        {
          content: "End Time",
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
        },
        {
          content: "Hours",
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
        },
        {
          content: "Daily Total",
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
        },
        {
          content: "Regular",
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
        },
        {
          content: "Overtime",
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
        },
      ]);

      // Add days and entries
      const sortedDays = [...(week.days || [])].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      sortedDays.forEach((day: any) => {
        const sortedEntries = [...(day.entries || [])].sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );

        sortedEntries.forEach((entry: any, entryIndex: number) => {
          const isFirstEntryOfDay = entryIndex === 0;

          tableData.push([
            convertUTCToLocalPretty(entry.start).date,
            entry.shift?.title || "Regular",
            convertUTCToLocalPretty(entry.start).time,
            convertUTCToLocalPretty(entry.end).time,
            `${entry.totalHours?.toFixed(2)}`,
            isFirstEntryOfDay ? `${day.totalHours?.toFixed(2)}` : "",
            `${entry.regular?.toFixed(2)}`,
            `${entry.overtime?.toFixed(2)}`,
          ]);
        });

        // Add daily summary if there are multiple entries for the day
        if (day.entries && day.entries.length > 1) {
          tableData.push([
            "",
            "",
            "",
            "",
            `Daily Total: ${day.totalHours?.toFixed(2)}h`,
            "",
            "",
            "",
          ]);
        }
      });

      // Add empty row between weeks for better separation
      tableData.push(["", "", "", "", "", "", "", ""]);
    });

    // Add table with enhanced styling and full width
    autoTable(doc, {
      startY: 106,
      head: [], // No main header since we have individual headers per week
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      columnStyles: {
        0: { cellWidth: "auto", halign: "left" }, // Date - auto width, left align
        1: { cellWidth: "auto", halign: "left" }, // Shift - auto width, left align
        2: { cellWidth: "auto", halign: "center" }, // Start - auto width, center align
        3: { cellWidth: "auto", halign: "center" }, // End - auto width, center align
        4: { cellWidth: "auto", halign: "center" }, // Hours - auto width, center align
        5: { cellWidth: "auto", halign: "center" }, // Daily Total - auto width, center align
        6: { cellWidth: "auto", halign: "center" }, // Regular - auto width, center align
        7: { cellWidth: "auto", halign: "center" }, // Overtime - auto width, center align
      },
      margin: { left: 15, right: 15 },
      tableWidth: "wrap",
      styles: {
        overflow: "linebreak",
        fontSize: 8,
        cellPadding: 3,
      },
      didParseCell: function (data) {
        // Handle week header rows
        if (
          data.row.index >= 0 &&
          data.cell.raw &&
          typeof data.cell.raw === "object" &&
          "colSpan" in data.cell.raw
        ) {
          data.cell.styles.fillColor = [52, 73, 94];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.halign = "center";
        }

        // Highlight daily total rows
        if (
          data.row.raw &&
          Array.isArray(data.row.raw) &&
          data.row.raw[4] &&
          typeof data.row.raw[4] === "string" &&
          data.row.raw[4].includes("Daily Total:")
        ) {
          data.cell.styles.fillColor = [233, 236, 239];
          data.cell.styles.fontStyle = "bold";
        }

        // Style empty rows between weeks
        if (
          data.row.raw &&
          Array.isArray(data.row.raw) &&
          data.row.raw.every((cell) => cell === "")
        ) {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.minCellHeight = 5;
        }
      },
    });

    // Add footer section
    const finalY =
      (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY || 200;

    // Add signature section
    if (finalY < 250) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Approval Section", 20, finalY + 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Employee signature
      doc.line(20, finalY + 40, 90, finalY + 40);
      doc.text("Employee Signature", 20, finalY + 45);
      doc.text("Date: _______________", 20, finalY + 52);

      // Supervisor signature
      doc.line(110, finalY + 40, 180, finalY + 40);
      doc.text("Supervisor Signature", 110, finalY + 45);
      doc.text("Date: _______________", 110, finalY + 52);
    }

    // Add footer with page numbers and disclaimer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(
        20,
        doc.internal.pageSize.height - 20,
        190,
        doc.internal.pageSize.height - 20
      );

      // Page numbers
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );

      // Confidentiality notice
      doc.text(
        "CONFIDENTIAL - Employee Timesheet Document",
        20,
        doc.internal.pageSize.height - 10
      );

      // Generated timestamp
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save the PDF with a professional filename
    const fileName = `Timesheet_${employeeName.replace(
      /\s+/g,
      "_"
    )}_${formatDateRange(dateRange.from, dateRange.to)
      .replace(/\//g, "-")
      .replace(/\s/g, "")}.pdf`;
    doc.save(fileName);

    // Show success message
    Swal.fire({
      title: "PDF Generated Successfully!",
      text: `Your timesheet for ${formatDateRange(
        dateRange.from,
        dateRange.to
      )} has been downloaded.`,
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
    });
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

  return (
    <div className="px-4 lg:px-0">
      <TimeSheetHeader
        userData={userData}
        dateRange={dateRange}
        formatDateRange={formatDateRange}
        handleDateRangeChange={handleDateRangeChange}
        month={month}
        setMonth={setMonthString}
      />
      <TimeSheetSummaryCards
        paymentData={paymentData}
        handleSubmit={handleSubmit}
        exportToPDF={exportToPDF}
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