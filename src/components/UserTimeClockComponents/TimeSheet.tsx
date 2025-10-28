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
import {
  convertUTCToLocalPretty,
  userDefaultTimeZone,
} from "@/utils/dateUtils";

import TimeSheetSummaryCards from "./TimeSheetSummaryCards";
import TimeSheetTable from "./TimeSheetTable";
import { TimeSheetHeader } from "./TimeSheetHeader";
import { DateTime } from "luxon";

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
    // Handle form submission
  };

  // --- Helpers to ensure parity with backend-paid totals ---
  const parseNumber = (v: any) => (typeof v === "number" ? v : Number(v || 0));

  function computeWeeklyPaidFromWeek(week: any) {
    // Prefer explicit backend fields if present
    if (week.weeklyPaidTotal !== undefined) {
      return {
        paidTotal: parseNumber(week.weeklyPaidTotal),
        paidRegular: parseNumber(week.weeklyPaidRegular || 0),
        paidOvertime: parseNumber(week.weeklyPaidOvertime || 0),
      };
    }

    if (
      week.weeklyPaidRegular !== undefined ||
      week.weeklyPaidOvertime !== undefined
    ) {
      const paidRegular = parseNumber(week.weeklyPaidRegular || 0);
      const paidOvertime = parseNumber(week.weeklyPaidOvertime || 0);
      return {
        paidRegular,
        paidOvertime,
        paidTotal: paidRegular + paidOvertime,
      };
    }

    // Fallback: compute from per-entry fields
    if (Array.isArray(week.days)) {
      const sums = week.days.reduce(
        (acc: any, d: any) =>
          d.entries
            ? d.entries.reduce(
                (a: any, e: any) => ({
                  paidRegular: a.paidRegular + parseNumber(e.regular || 0),
                  paidOvertime: a.paidOvertime + parseNumber(e.overtime || 0),
                }),
                acc
              )
            : acc,
        { paidRegular: 0, paidOvertime: 0 }
      );

      return {
        paidRegular: sums.paidRegular,
        paidOvertime: sums.paidOvertime,
        paidTotal: sums.paidRegular + sums.paidOvertime,
      };
    }

    return { paidRegular: 0, paidOvertime: 0, paidTotal: 0 };
  }

  const exportToPDF = () => {
    // Use mm units and explicit A4 sizing to make column widths reliable
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 15;
    const marginRight = 15;
    const contentWidth = pageWidth - marginLeft - marginRight;

    // Add company logo with reasonable dimensions (mm)
    try {
      doc.addImage(logo as any, "JPEG", marginLeft, 10, 30, 15);
    } catch (error) {
      console.error("Error adding logo:", error);
      // Fallback placeholder
      doc.setDrawColor(52, 73, 94);
      doc.setLineWidth(0.5);
      doc.rect(marginLeft, 10, 30, 15);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("LOGO", marginLeft + 15, 19, { align: "center" });
    }

    // Header text
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 73, 94);
    doc.text("EMPLOYEE TIMESHEET", pageWidth / 2, 17, { align: "center" });

    // Draw a subtle line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.line(marginLeft, 26, pageWidth - marginRight, 26);

    // Employee block left, Pay summary right
    const leftX = marginLeft;
    const rightX = marginLeft + contentWidth * 0.55; // right column starts ~55% across
    const colWidth = contentWidth * 0.4;
    const smallRowY = 32;

    // Employee information
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Employee Information", leftX, smallRowY);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.rect(leftX, smallRowY + 2, colWidth, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const employeeName = `${userData?.firstName || "User"} ${
      userData?.lastName || ""
    }`;
    doc.text(`Name: ${employeeName}`, leftX + 2, smallRowY + 8);
    doc.text(
      `Period: ${formatDateRange(dateRange.from, dateRange.to)}`,
      leftX + 2,
      smallRowY + 13
    );
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      leftX + 2,
      smallRowY + 18
    );

    // Pay summary (prefer server paymentData; fallback to client-summed weekly paid)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Pay Summary", rightX, smallRowY);
    doc.rect(rightX, smallRowY + 2, colWidth, 18);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const regularPayRate = Number(
      paymentData?.payPerDay?.regularPayRate ?? 0
    ).toFixed(2);
    const overtimePayRate = Number(
      paymentData?.payPerDay?.overTimePayRate ?? 0
    ).toFixed(2);

    // Compute fallback totals from weeklyData
    const canonical = weeklyData.reduce(
      (acc: any, w: any) => {
        const { paidRegular, paidOvertime, paidTotal } =
          computeWeeklyPaidFromWeek(w);
        acc.paidRegular += paidRegular;
        acc.paidOvertime += paidOvertime;
        acc.paidTotal += paidTotal;
        return acc;
      },
      { paidRegular: 0, paidOvertime: 0, paidTotal: 0 }
    );

    const serverRegular = parseNumber(paymentData?.totalRegularHour || 0);
    const serverOvertime = parseNumber(paymentData?.totalOvertimeHour || 0);

    const useServerSummary =
      paymentData && (serverRegular !== 0 || serverOvertime !== 0);

    const displayRegularHours = useServerSummary
      ? serverRegular
      : canonical.paidRegular;
    const displayOvertimeHours = useServerSummary
      ? serverOvertime
      : canonical.paidOvertime;
    const displayTotalHours = displayRegularHours + displayOvertimeHours;

    doc.text(`Reg Rate: $${regularPayRate}/day`, rightX + 2, smallRowY + 8);
    doc.text(`OT Rate: $${overtimePayRate}/day`, rightX + 2, smallRowY + 13);

    doc.text(
      `Reg Hours: ${displayRegularHours.toFixed(2)}`,
      rightX + colWidth - 2,
      smallRowY + 8,
      { align: "right" }
    );
    doc.text(
      `Total Hours: ${displayTotalHours.toFixed(2)}`,
      rightX + colWidth - 2,
      smallRowY + 13,
      { align: "right" }
    );

    // Estimated earnings (compute using display hours)
    const regularEarnings = (
      displayRegularHours * Number(regularPayRate)
    ).toFixed(2);
    const overtimeEarnings = (
      displayOvertimeHours * Number(overtimePayRate)
    ).toFixed(2);
    const totalEarnings = (
      Number(regularEarnings) + Number(overtimeEarnings)
    ).toFixed(2);

    doc.setFont("helvetica", "bold");
    doc.text(`Est. Earnings: $${totalEarnings}`, rightX + 2, smallRowY + 18);

    // Timesheet Details title
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Timesheet Details", marginLeft, smallRowY + 30);

    // Build table rows. We'll define 7 columns:
    // [Date, Shift, Start Time, End Time, Hours, Regular, Overtime]
    const tableData: any[] = [];

    weeklyData.forEach((week: any) => {
      const { paidTotal } = computeWeeklyPaidFromWeek(week);

      const weekPaidDisplay =
        week.weeklyPaidTotal !== undefined
          ? parseNumber(week.weeklyPaidTotal)
          : paidTotal;

      // Week header as full-width row (colSpan: 7)
      tableData.push([
        {
          content: `WEEK: ${formatWeekRange(week.weekStart, week.weekEnd)}`,
          colSpan: 7,
          styles: {
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "left",
            fontSize: 10,
          },
        },
      ]);

      // Week sub-header with paid total on right (spanning 7)
      tableData.push([
        {
          content: `Paid Total Hours: ${
            weekPaidDisplay?.toFixed?.(2) ?? "0.00"
          }`,
          colSpan: 7,
          styles: {
            fillColor: [70, 90, 110],
            textColor: [255, 255, 255],
            fontStyle: "normal",
            halign: "right",
            fontSize: 9,
          },
        },
      ]);

      // Column headers row (7 columns)
      tableData.push([
        {
          content: "Date",
          styles: { fillColor: [240, 240, 240], fontStyle: "bold" },
        },
        {
          content: "Shift",
          styles: { fillColor: [240, 240, 240], fontStyle: "bold" },
        },
        {
          content: "Start Time",
          styles: { fillColor: [240, 240, 240], fontStyle: "bold" },
        },
        {
          content: "End Time",
          styles: { fillColor: [240, 240, 240], fontStyle: "bold" },
        },
        {
          content: "Hours",
          styles: { fillColor: [240, 240, 240], fontStyle: "bold" },
        },
        {
          content: "Regular",
          styles: { fillColor: [240, 240, 240], fontStyle: "bold" },
        },
        {
          content: "Overtime",
          styles: { fillColor: [240, 240, 240], fontStyle: "bold" },
        },
      ]);

      const sortedDays = [...(week.days || [])].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      sortedDays.forEach((day: any) => {
        const sortedEntries = [...(day.entries || [])].sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );

        sortedEntries.forEach((entry: any) => {
          // Use convertUTCToLocalPretty to keep consistent formatting
          const startPretty = convertUTCToLocalPretty(entry.start);
          const endPretty = convertUTCToLocalPretty(entry.end);

          tableData.push([
            startPretty.date,
            entry.shift?.title || "Regular",
            startPretty.time,
            endPretty.time,
            `${parseNumber(entry.totalHours || 0).toFixed(2)}`,
            `${parseNumber(entry.regular || 0).toFixed(2)}`,
            `${parseNumber(entry.overtime || 0).toFixed(2)}`,
          ]);
        });

        // NOTE: removed per-day summary rows (no "Daily Total" row)
      });

      // spacer row between weeks (7 columns)
      tableData.push(["", "", "", "", "", "", ""]);
    });

    // Configure sensible column widths in mm so total fits inside contentWidth (A4 contentWidth ≈ 180mm)
    // Chosen widths sum to contentWidth: 28 + 52 + 22 + 22 + 16 + 20 + 20 = 180
    const colWidths: Record<number, number> = {
      0: 28, // Date
      1: 52, // Shift
      2: 22, // Start Time
      3: 22, // End Time
      4: 16, // Hours
      5: 20, // Regular
      6: 20, // Overtime
    };

    const desiredTotal = Object.values(colWidths).reduce((s, v) => s + v, 0);
    if (desiredTotal > contentWidth) {
      const scale = contentWidth / desiredTotal;
      Object.keys(colWidths).forEach((k) => {
        const idx = Number(k);
        colWidths[idx] = Math.floor(colWidths[idx] * scale);
      });
    }

    // Render table using jspdf-autotable (autoTable should be available globally/imported)
    (autoTable as any)(doc as any, {
      startY: smallRowY + 36,
      head: [], // we embedded headers inside body rows
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
        valign: "middle",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      columnStyles: {
        0: { cellWidth: colWidths[0], halign: "left" },
        1: { cellWidth: colWidths[1], halign: "left" },
        2: { cellWidth: colWidths[2], halign: "center" },
        3: { cellWidth: colWidths[3], halign: "center" },
        4: { cellWidth: colWidths[4], halign: "center" },
        5: { cellWidth: colWidths[5], halign: "center" },
        6: { cellWidth: colWidths[6], halign: "center" },
      },
      margin: { left: marginLeft, right: marginRight },
      tableWidth: contentWidth,
      styles: {
        overflow: "linebreak",
        fontSize: 8,
        cellPadding: 3,
      },
      didParseCell: function (data: any) {
        // Week header rows (we used colSpan: 7)
        if (
          data.cell.raw &&
          typeof data.cell.raw === "object" &&
          "colSpan" in data.cell.raw
        ) {
          data.cell.styles.fillColor = [52, 73, 94];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.halign = "center";
        }

        // Style spacer rows
        if (
          data.row.raw &&
          Array.isArray(data.row.raw) &&
          data.row.raw.every((cell: any) => cell === "")
        ) {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.minCellHeight = 4;
        }
      },
      willDrawCell: (data: any) => {
        data.cell.styles.cellPadding = 3;
      },
    });

    // Footer position and signatures
    const lastAuto = (doc as any).lastAutoTable;
    const finalY = lastAuto?.finalY || 200;

    // Add signature area if space remains
    if (finalY + 60 < doc.internal.pageSize.getHeight() - 30) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Approval Section", marginLeft, finalY + 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Employee signature
      doc.line(marginLeft, finalY + 22, marginLeft + 40, finalY + 22);
      doc.text("Employee Signature", marginLeft, finalY + 27);
      doc.text("Date: _______________", marginLeft, finalY + 33);

      // Supervisor signature
      const supX = marginLeft + 60;
      doc.line(supX, finalY + 22, supX + 40, finalY + 22);
      doc.text("Supervisor Signature", supX, finalY + 27);
      doc.text("Date: _______________", supX, finalY + 33);
    }

    // Page footer (page numbers + notice)
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(
        marginLeft,
        doc.internal.pageSize.height - 15,
        pageWidth - marginRight,
        doc.internal.pageSize.height - 15
      );

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - marginRight - 5,
        doc.internal.pageSize.height - 8,
        { align: "right" }
      );

      doc.text(
        "CONFIDENTIAL - Employee Timesheet Document",
        marginLeft,
        doc.internal.pageSize.height - 8
      );
      doc.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 8,
        { align: "center" }
      );
    }

    // Save file
    const fileName = `Timesheet_${employeeName.replace(
      /\s+/g,
      "_"
    )}_${formatDateRange(dateRange.from, dateRange.to)
      .replace(/\//g, "-")
      .replace(/\s/g, "")}.pdf`;
    doc.save(fileName);

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
        onDateRangeChange={handleHeaderDateRangeChange}
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
