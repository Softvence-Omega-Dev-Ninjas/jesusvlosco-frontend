/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetClockSheetQuery, useSubmitClockSheetMutation } from "@/store/api/clockInOut/clockinoutapi";
import { File, Send } from "lucide-react";
import { useState } from "react";
import React from "react";
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from "@/assets/logo.jpg";

// Extend jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}
import { FaSpinner } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "sonner";
import { useSendOvertimeRequestMutation } from "@/store/api/admin/overtime";

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

  // Pass date range to API query
  const clockSheets = useGetClockSheetQuery({
    from: dateRange.from,
    to: dateRange.to,
  });

  console.log("========= clockSheets =========>", clockSheets);

  // console.log("clockSheets", clockSheets);

  // Helper functions
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayName} ${day}/${month}`;
  };

  const formatTime = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatWeekRange = (weekStart: string | number | Date, weekEnd: string | number | Date) => {
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
      // Go to previous week
      currentStart.setDate(currentStart.getDate() - 7);
      currentEnd.setDate(currentEnd.getDate() - 7);
    } else {
      // Go to next week
      currentStart.setDate(currentStart.getDate() + 7);
      currentEnd.setDate(currentEnd.getDate() + 7);
    }

    setDateRange({
      from: currentStart.toISOString(),
      to: currentEnd.toISOString(),
    });
  };

  // Show loading state
  if (clockSheets?.isLoading) {
    return (
      <div className="px-4 lg:px-0 flex justify-center items-center py-12">
        <div className="text-gray-500">Loading timesheet...</div>
      </div>
    );
  }

  // Show error state
  if (clockSheets?.error) {
    return (
      <div className="px-4 lg:px-0 flex justify-center items-center py-12">
        <div className="text-red-500">Error loading timesheet data</div>
      </div>
    );
  }

  // Extract data and sort by latest first
  // const totals = calculateTotals();
  const userData = clockSheets?.data?.data?.clockSheet?.user;
  const rawWeeklyData = clockSheets?.data?.data?.clockSheet?.result || [];
  const paymentData = clockSheets?.data?.data?.paymentData;

  // Sort weekly data by weekStart date (latest first)
  const weeklyData = [...rawWeeklyData].sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
  console.log("========= weeklyData =========>", weeklyData);
  const seeNotes = (notes?: string) => {
    Swal.fire({
      title: "Shift Notes",
      text: notes ?? "No notes available",
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const handleSubmit = async() => {
    const data = {
      from: dateRange.from,
      to: dateRange.to
    }
    try{
      await submitClockSheet(data).unwrap();
      Swal.fire({
        title: 'Success',
        text: 'Clock sheet submitted successfully',
        icon: 'success',
        confirmButtonText: 'Close'
      });
    } catch (error) {
      console.error('Failed to submit clock sheet:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit clock sheet',
        icon: 'error',
        confirmButtonText: 'Close'
      });
    }
    // Handle form submission
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add company logo
    try {
      // Use the imported logo directly with jsPDF
      // jsPDF can handle image URLs directly
      doc.addImage(logo, 'JPEG', 20, 15, 60, 30);
    } catch (error) {
      console.log('Logo loading failed:', error);
      // Fallback: create a simple logo placeholder
      doc.setDrawColor(52, 73, 94);
      doc.setLineWidth(0.5);
      doc.rect(20, 15, 55, 25);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("LOGO", 47.5, 30, { align: "center" });
    }
    
    // Company/Header Information with smaller font
    doc.setFontSize(18); // Reduced from 22
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 73, 94);
    doc.text("EMPLOYEE TIMESHEET", 140, 25, { align: "center" });
    
    // Add line under header
    doc.setDrawColor(52, 73, 94);
    doc.setLineWidth(0.5);
    doc.line(55, 30, 190, 30);
    
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
    const employeeName = `${userData?.firstName || 'User'} ${userData?.lastName || ''}`;
    doc.text(`Name: ${employeeName}`, leftColumnX + 5, 55);
    doc.text(`Period: ${formatDateRange(dateRange.from, dateRange.to)}`, leftColumnX + 5, 62);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, leftColumnX + 5, 69);
    
    // Pay Summary Section (Right Column)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Pay Summary", rightColumnX, 45);
    
    // Summary box
    doc.rect(rightColumnX, 48, columnWidth, rowHeight);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    const regularPayRate = Number(paymentData?.payPerDay?.regularPayRate ?? 0).toFixed(2);
    const overtimePayRate = Number(paymentData?.payPerDay?.overTimePayRate ?? 0).toFixed(2);
    const totalRegularHours = Number(paymentData?.totalRegularHour ?? 0).toFixed(2);
    const totalHours = (Number(paymentData?.totalRegularHour ?? 0) + Number(paymentData?.totalOvertimeHour ?? 0)).toFixed(2);
    
    // Left side of pay summary
    doc.text(`Reg Rate: $${regularPayRate}/day`, rightColumnX + 5, 55);
    doc.text(`OT Rate: $${overtimePayRate}/day`, rightColumnX + 5, 62);
    
    // Right side of pay summary
    doc.text(`Reg Hours: ${totalRegularHours}`, rightColumnX + 40, 55);
    doc.text(`Total Hours: ${totalHours}`, rightColumnX + 40, 62);
    
    // Calculate and show estimated earnings
    const regularEarnings = (Number(paymentData?.totalRegularHour ?? 0) * Number(regularPayRate)).toFixed(2);
    const overtimeEarnings = (Number(paymentData?.totalOvertimeHour ?? 0) * Number(overtimePayRate)).toFixed(2);
    const totalEarnings = (Number(regularEarnings) + Number(overtimeEarnings)).toFixed(2);
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
            fontStyle: 'bold', 
            halign: 'left',
            fontSize: 10
          }
        },
        {
          content: `Total Hours: ${week.weeklyTotal?.toFixed(2)}`,
          colSpan: 4,
          styles: { 
            fillColor: [52, 73, 94], 
            textColor: [255, 255, 255], 
            fontStyle: 'bold', 
            halign: 'right',
            fontSize: 10
          }
        }
      ]);
      
      // Add column headers for this week
      tableData.push([
        {
          content: 'Date',
          styles: { fillColor: [70, 90, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }
        },
        {
          content: 'Shift',
          styles: { fillColor: [70, 90, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }
        },
        {
          content: 'Start Time',
          styles: { fillColor: [70, 90, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }
        },
        {
          content: 'End Time',
          styles: { fillColor: [70, 90, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }
        },
        {
          content: 'Hours',
          styles: { fillColor: [70, 90, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }
        },
        {
          content: 'Daily Total',
          styles: { fillColor: [70, 90, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }
        },
        {
          content: 'Regular',
          styles: { fillColor: [70, 90, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }
        },
        {
          content: 'Overtime',
          styles: { fillColor: [70, 90, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }
        }
      ]);
      
      // Add days and entries
      const sortedDays = [...(week.days || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      sortedDays.forEach((day: any) => {
        const sortedEntries = [...(day.entries || [])].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        
        sortedEntries.forEach((entry: any, entryIndex: number) => {
          const isFirstEntryOfDay = entryIndex === 0;
          
          tableData.push([
            formatDate(entry.date),
            entry.shift?.title || "Regular",
            formatTime(entry.start),
            formatTime(entry.end),
            `${entry.totalHours?.toFixed(2)}`,
            isFirstEntryOfDay ? `${day.totalHours?.toFixed(2)}` : '',
            `${entry.regular?.toFixed(2)}`,
            `${entry.overtime?.toFixed(2)}`
          ]);
        });
        
        // Add daily summary if there are multiple entries for the day
        if (day.entries && day.entries.length > 1) {
          tableData.push([
            '', '', '', '', 
            `Daily Total: ${day.totalHours?.toFixed(2)}h`,
            '', '', ''
          ]);
        }
      });
      
      // Add empty row between weeks for better separation
      tableData.push(['', '', '', '', '', '', '', '']);
    });
    
    // Add table with enhanced styling
    autoTable(doc, {
      startY: 101,
      head: [], // No main header since we have individual headers per week
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { cellWidth: 22, halign: 'left' }, // Date
        1: { cellWidth: 24, halign: 'left' }, // Shift
        2: { cellWidth: 20 }, // Start
        3: { cellWidth: 20 }, // End
        4: { cellWidth: 16 }, // Hours
        5: { cellWidth: 20 }, // Daily Total
        6: { cellWidth: 16 }, // Regular
        7: { cellWidth: 16 }  // Overtime
      },
      margin: { left: 20, right: 20 },
      didParseCell: function(data) {
        // Handle week header rows
        if (data.row.index >= 0 && data.cell.raw && typeof data.cell.raw === 'object' && 'colSpan' in data.cell.raw) {
          data.cell.styles.fillColor = [52, 73, 94];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.halign = 'center';
        }
        
        // Highlight daily total rows
        if (data.row.raw && Array.isArray(data.row.raw) && data.row.raw[4] && 
            typeof data.row.raw[4] === 'string' && data.row.raw[4].includes('Daily Total:')) {
          data.cell.styles.fillColor = [233, 236, 239];
          data.cell.styles.fontStyle = 'bold';
        }
        
        // Style empty rows between weeks
        if (data.row.raw && Array.isArray(data.row.raw) && data.row.raw.every(cell => cell === '')) {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.minCellHeight = 5;
        }
      }
    });
    
    // Add footer section
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    
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
      doc.line(20, doc.internal.pageSize.height - 20, 190, doc.internal.pageSize.height - 20);
      
      // Page numbers
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10, { align: "right" });
      
      // Confidentiality notice
      doc.text("CONFIDENTIAL - Employee Timesheet Document", 20, doc.internal.pageSize.height - 10);
      
      // Generated timestamp
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, doc.internal.pageSize.height - 10, { align: "center" });
    }
    
    // Save the PDF with a professional filename
    const fileName = `Timesheet_${employeeName.replace(/\s+/g, '_')}_${formatDateRange(dateRange.from, dateRange.to).replace(/\//g, '-').replace(/\s/g, '')}.pdf`;
    doc.save(fileName);
    
    // Show success message
    Swal.fire({
      title: 'PDF Generated Successfully!',
      text: `Your timesheet for ${formatDateRange(dateRange.from, dateRange.to)} has been downloaded.`,
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
  };

  const handleSendOvertimeRequest = async (id: string) => {
    console.log("Overtime Id  ================>", id);
    setIsOvertimeLoading(true);
    try {
      const result = await sendOvertimeRequest({
        id,
      }).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Overtime request send successfully!");
      }
    } catch (error: any) {
      console.error("Error publishing task:", error);
      toast.error(error?.data?.message); // Add a toast for failure
    } finally {
      setIsOvertimeLoading(false);
    }
  };

  return (
    <div className="px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={userData?.profileUrl !== "N/A" ? userData?.profileUrl : "https://i.pravatar.cc"}
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
              <button onClick={() => handleDateRangeChange("prev")} className="hover:text-gray-600 transition-colors">
                {"<"}
              </button>
              <span className="mx-2">{formatDateRange(dateRange.from, dateRange.to)}</span>
              <button onClick={() => handleDateRangeChange("next")} className="hover:text-gray-600 transition-colors">
                {">"}
              </button>
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="hidden px-6 py-2 bg-[#1EBD66] text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
            Submit timesheet
          </button>
          <button className="hidden px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors items-center justify-center gap-2">
            Export
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex justify-between items-center gap-5">
        <div className="flex flex-wrap gap-4 lg:gap-6 mb-8 items-center">
        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">{Number(paymentData?.payPerDay?.regularPayRate ?? 0).toFixed(2)} $</div>
          <div className="text-xs lg:text-sm text-gray-600">Regular Pay per day</div>
        </div>

          <div className="text-base lg:text-lg font-medium text-gray-900">|</div>

        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">{Number(paymentData?.payPerDay?.overTimePayRate ?? 0).toFixed(2)} $</div>
          <div className="text-xs lg:text-sm text-gray-600">Overtime Pay per day</div>
        </div>

          <div className="text-base lg:text-lg font-medium text-gray-900">|</div>

        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">{Number(paymentData?.totalRegularHour ?? 0).toFixed(2)}</div>
          <div className="text-xs lg:text-sm text-gray-600">Regular Total Hours</div>
        </div>

          <div className="text-base lg:text-lg font-medium text-gray-900">+</div>

        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">{Number(paymentData?.totalOvertimeHour ?? 0).toFixed(2)}</div>
          <div className="text-xs lg:text-sm text-gray-600">Overtime Total Hours</div>
        </div>

          <div className="text-base lg:text-lg font-medium text-gray-900">=</div>

        <div className="text-center">
          <div className="text-xl lg:text-2xl font-bold text-gray-900">
            {(Number(paymentData?.totalRegularHour ?? 0) + Number(paymentData?.totalOvertimeHour ?? 0)).toFixed(2)}
          </div>
          <div className="text-xs lg:text-sm text-gray-600">Total Paid Hours</div>
        </div>
      </div>
      <div className="flex items-center gap-3 ">
        <button 
        onClick={() => handleSubmit()}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        <Send className="w-4 h-4" />
        <span>Submit</span>
      </button>
        <button 
        onClick={exportToPDF}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        <File className="w-4 h-4" />
        <span>Export</span>
      </button>
      </div>
      </div>

      {/* Table */}
      {/* Table */}
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
                  weeklyData.map((week: { weekStart: any; weekEnd: any; weeklyTotal: number; days: any[] }, weekIndex: number) => (
                    <React.Fragment key={`week-${weekIndex}`}>
                      {/* Week Header */}
                      <tr>
                        <td colSpan={12} className="bg-primary text-white text-center py-3 font-medium">
                          {formatWeekRange(week.weekStart, week.weekEnd)} (Weekly Total: {week.weeklyTotal?.toFixed(2)} hours)
                        </td>
                      </tr>

                      {/* Days and Entries - Sort days by date (latest first) */}
                      {[...(week.days || [])]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((day: { entries: any[]; totalHours: number }, dayIndex: number) => (
                          <React.Fragment key={`day-${dayIndex}`}>
                            {/* Sort entries by start time (latest first) */}
                            {[...(day.entries || [])]
                              .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
                              .map(
                                (
                                  entry: {
                                    date: any;
                                    shift: {
                                      title:
                                        | string
                                        | number
                                        | bigint
                                        | boolean
                                        | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                                        | Iterable<React.ReactNode>
                                        | Promise<
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | React.ReactPortal
                                            | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                                            | Iterable<React.ReactNode>
                                            | null
                                            | undefined
                                          >
                                        | null
                                        | undefined;
                                    };
                                    start: any;
                                    end: any;
                                    totalHours: number;
                                    regular: number;
                                    overtime: number;
                                    notes: string | undefined;
                                    overTimeRequestStatus: string;
                                    id: string;
                                  },
                                  entryIndex: number
                                ) => {
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
                                      <td className="py-3 px-2 sm:px-4 text-primary font-medium text-sm">{formatDate(entry?.date)}</td>

                                      <td className="text-gray-500 bg-white min-w-[100px] sm:min-w-[120px] text-sm">
                                        {entry?.shift?.title != null ? String(entry?.shift?.title) : ""}
                                      </td>
                                      <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">{formatTime(entry?.start)}</td>
                                      <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">{formatTime(entry?.end)}</td>
                                      <td className="py-3 px-2 sm:px-4 text-gray-900 text-sm">{entry?.totalHours?.toFixed(2)} Hours</td>
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
                                        <span className={getStatusColor(entry.overTimeRequestStatus)}>{entry?.overTimeRequestStatus}</span>
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
                                                {isOvertimeLoading ? <FaSpinner className="animate-spin" /> : "Send Request"}
                                              </span>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
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
    </div>
  );
}
