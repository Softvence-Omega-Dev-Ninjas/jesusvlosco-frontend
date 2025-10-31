/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateTime } from "luxon";
import logo from "@/assets/logo.jpg";
import {
  convertUTCToLocalPretty,
  userDefaultTimeZone,
} from "@/utils/dateUtils";
import Swal from "sweetalert2";

/**
 * Payload shape — pass the timesheet pieces from the component
 */
export type ExportTimesheetPayload = {
  userData: any;
  weeklyData: any[];
  paymentData?: any;
  dateRange: { from: string; to: string };
};

const parseNumber = (v: any) => (typeof v === "number" ? v : Number(v || 0));

function computeWeeklyPaidFromWeek(week: any) {
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

/**
 * Main export function — generates and saves the PDF
 */
export function exportTimesheetPdf(payload: ExportTimesheetPayload) {
  const { userData, paymentData, dateRange } = payload;
  let { weeklyData } = payload;

  // Step 1: Sort weeks by ascending start date
  weeklyData = [...(weeklyData || [])].sort(
    (a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
  );

  // Step 2: Adjust first & last weeks based on global range
  const globalStart = DateTime.fromISO(dateRange.from);
  const globalEnd = DateTime.fromISO(dateRange.to);

  if (weeklyData.length > 0) {
    const firstWeek = { ...weeklyData[0] };
    const lastWeek = { ...weeklyData[weeklyData.length - 1] };

    const firstStart = DateTime.fromISO(firstWeek.weekStart);
    const firstEnd = DateTime.fromISO(firstWeek.weekEnd);
    const lastEnd = DateTime.fromISO(lastWeek.weekEnd);

    // Single-week case: adjust both start & end within range
    if (weeklyData.length === 1) {
      if (firstStart < globalStart) firstWeek.weekStart = globalStart.toISO();
      if (firstEnd > globalEnd) firstWeek.weekEnd = globalEnd.toISO();

      weeklyData[0] = firstWeek; // ✅ replace immutably
    } else {
      // Multi-week case
      if (firstStart < globalStart) firstWeek.weekStart = globalStart.toISO();
      if (lastEnd > globalEnd) lastWeek.weekEnd = globalEnd.toISO();

      weeklyData = [
        { ...firstWeek },
        ...weeklyData.slice(1, -1),
        { ...lastWeek },
      ];
    }
  }

  // PDF generation 
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 15;
  const marginRight = 15;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // Add logo (graceful fallback)
  try {
    doc.addImage(logo as any, "JPEG", marginLeft, 10, 30, 15);
  } catch (error) {
    console.error("Error adding logo to PDF:", error);
    doc.setDrawColor(52, 73, 94);
    doc.setLineWidth(0.5);
    doc.rect(marginLeft, 10, 30, 15);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("LOGO", marginLeft + 15, 19, { align: "center" });
  }

  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(52, 73, 94);
  doc.text("EMPLOYEE TIMESHEET", pageWidth / 2, 17, { align: "center" });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.4);
  doc.line(marginLeft, 26, pageWidth - marginRight, 26);

  const leftX = marginLeft;
  const rightX = marginLeft + contentWidth * 0.55;
  const colWidth = contentWidth * 0.4;
  const smallRowY = 32;

  // Employee info block
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

  // Pay summary block
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

  // Timesheet detail table build
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Timesheet Details", marginLeft, smallRowY + 30);

  const tableData: any[] = [];

  weeklyData.forEach((week: any) => {
    const { paidTotal } = computeWeeklyPaidFromWeek(week);
    const weekPaidDisplay =
      week.weeklyPaidTotal !== undefined
        ? parseNumber(week.weeklyPaidTotal)
        : paidTotal;

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

    tableData.push([
      {
        content: `Paid Total Hours: ${weekPaidDisplay?.toFixed?.(2) ?? "0.00"}`,
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
        content: "Total Hours",
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
    });

    // spacer row
    tableData.push(["", "", "", "", "", "", ""]);
  });

  const colWidths: Record<number, number> = {
    0: 28,
    1: 52,
    2: 22,
    3: 22,
    4: 16,
    5: 20,
    6: 20,
  };

  const desiredTotal = Object.values(colWidths).reduce((s, v) => s + v, 0);
  if (desiredTotal > contentWidth) {
    const scale = contentWidth / desiredTotal;
    Object.keys(colWidths).forEach((k) => {
      const idx = Number(k);
      colWidths[idx] = Math.floor(colWidths[idx] * scale);
    });
  }

  (autoTable as any)(doc as any, {
    startY: smallRowY + 36,
    head: [],
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

  const lastAuto = (doc as any).lastAutoTable;
  const finalY = lastAuto?.finalY || 200;

  if (finalY + 60 < doc.internal.pageSize.getHeight() - 30) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Approval Section", marginLeft, finalY + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.line(marginLeft, finalY + 22, marginLeft + 40, finalY + 22);
    doc.text("Employee Signature", marginLeft, finalY + 27);
    doc.text("Date: _______________", marginLeft, finalY + 33);

    const supX = marginLeft + 60;
    doc.line(supX, finalY + 22, supX + 40, finalY + 22);
    doc.text("Supervisor Signature", supX, finalY + 27);
    doc.text("Date: _______________", supX, finalY + 33);
  }

  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
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
}
