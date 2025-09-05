import {
  useGetSingleSubmittedSheetQuery,
  useUpdateSubmittedSheetMutation,
} from "@/store/api/clockInOut/clockinoutapi";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Calendar, FileText } from "lucide-react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/assets/logo.jpg";

interface ClockEntry {
  date: string;
  id: string;
  shift: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    locationLat: number;
    locationLng: number;
  };
  start: string;
  end: string;
  totalHours: number;
  regular: number;
  overtime: number;
  notes: string | null;
  isOvertimeAllowed: boolean;
}

interface DayData {
  date: string;
  totalHours: number;
  entries: ClockEntry[];
}

interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  weeklyTotal: number;
  days: DayData[];
}

const SingleUserSheet = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: userSheet,
    isLoading,
    refetch,
  } = useGetSingleSubmittedSheetQuery(id);
  const [updateSubmittedSheet] = useUpdateSubmittedSheetMutation();
  const navigate = useNavigate();

  console.log(userSheet);

  const exportToPDF = () => {
    if (!userSheet?.data) return;

    const { user, payrollSheet, payroll } = userSheet.data;
    const clockSheetData = payrollSheet?.clockSheet;

    try {
      const doc = new jsPDF();
      
      // Add logo
      doc.addImage(logo, 'JPEG', 10, 10, 40, 20);
      
      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Employee Timesheet Review", 60, 25);
      
      // Employee Info
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const employeeName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
      doc.text(`Employee: ${employeeName} (ID: ${payroll?.user?.employeeID})`, 10, 45);
      doc.text(`Email: ${payroll?.user?.email || 'N/A'}`, 10, 55);
      doc.text(`Phone: ${payroll?.user?.phone || 'N/A'}`, 10, 65);
      doc.text(`Report Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 10, 75);

      let currentY = 90;

      // Payment Summary if available
      if (payrollSheet?.paymentData) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Payment Summary", 10, currentY);
        currentY += 15;

        const paymentData = [
          ["Regular Hours", `${payrollSheet.paymentData.totalRegularHour.toFixed(2)}`],
          ["Overtime Hours", `${payrollSheet.paymentData.totalOvertimeHour.toFixed(2)}`],
          ["Total Hours", `${(payrollSheet.paymentData.totalRegularHour + payrollSheet.paymentData.totalOvertimeHour).toFixed(2)}`],
          ["Regular Pay", `$${payrollSheet.paymentData.totalRegularPay.toFixed(2)}`],
          ["Overtime Pay", `$${payrollSheet.paymentData.totalOvertimePay.toFixed(2)}`],
          ["Regular Rate", `$${payrollSheet.paymentData.payPerDay.regularPayRate}/hr`],
          ["Overtime Rate", `$${payrollSheet.paymentData.payPerDay.overTimePayRate}/hr`]
        ];

        autoTable(doc, {
          startY: currentY,
          head: [['Category', 'Amount']],
          body: paymentData,
          theme: 'grid',
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185] },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto' }
          },
          margin: { left: 10, right: 10 }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        currentY = ((doc as any).lastAutoTable?.finalY || currentY) + 20;
      }

      // Weekly timesheet data
      if (clockSheetData?.result && clockSheetData.result.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Weekly Timesheet Data", 10, currentY);
        currentY += 15;

        clockSheetData.result.forEach((week: WeeklyData, weekIndex: number) => {
          // Week header
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(`Week ${weekIndex + 1}`, 10, currentY);
          currentY += 10;

          // Prepare week data for table
          const weekTableData: string[][] = [];
          
          week.days.forEach((day: DayData) => {
            if (day.entries && day.entries.length > 0) {
              day.entries.forEach((entry: ClockEntry) => {
                const clockInTime = entry.start ? format(new Date(entry.start), 'HH:mm') : 'N/A';
                const clockOutTime = entry.end ? format(new Date(entry.end), 'HH:mm') : 'N/A';
                const totalHours = entry.totalHours ? `${entry.totalHours.toFixed(2)}h` : '0h';
                const overtimeHours = entry.overtime ? `${entry.overtime.toFixed(2)}h` : '0h';
                
                weekTableData.push([
                  format(new Date(day.date), 'dd/MM/yyyy'),
                  entry.shift?.title || 'N/A',
                  clockInTime,
                  clockOutTime,
                  totalHours,
                  overtimeHours
                ]);
              });
            }
          });

          if (weekTableData.length > 0) {
            autoTable(doc, {
              startY: currentY,
              head: [['Date', 'Shift', 'Clock In', 'Clock Out', 'Hours', 'Overtime']],
              body: weekTableData,
              theme: 'striped',
              styles: { fontSize: 9 },
              headStyles: { fillColor: [52, 152, 219] },
              columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 'auto' },
                5: { cellWidth: 'auto' }
              },
              margin: { left: 10, right: 10 }
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            currentY = ((doc as any).lastAutoTable?.finalY || currentY) + 15;
          } else {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("No clock entries for this week", 15, currentY);
            currentY += 15;
          }

          // Add page break if needed
          if (currentY > 250) {
            doc.addPage();
            currentY = 20;
          }
        });
      }

      // Footer with approval status
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("This is an automatically generated timesheet report", 10, pageHeight - 20);
      
      // Save the PDF
      const fileName = `Timesheet_Review_${employeeName.replace(/\s+/g, '_')}_${format(new Date(), 'ddMMyyyy')}.pdf`;
      doc.save(fileName);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "PDF has been generated successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to generate PDF. Please try again.",
        icon: "error"
      });
    }
  };

  const handleAccept = () => {
    const data = {
      id: id,
      status: true,
    };
    Swal.fire({
      title: "Accept Timesheet",
      text: "Are you sure you want to accept this timesheet?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, accept it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateSubmittedSheet(data).unwrap();
          Swal.fire({
            title: "Accepted!",
            text: "The timesheet has been accepted.",
            icon: "success",
          });
          refetch();
          navigate(-1);
        } catch (error) {
          console.error("Failed to accept timesheet:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to accept timesheet",
            icon: "error",
          });
        }
      }
    });
  };

  const handleReject = () => {
    const data = {
      id: id,
      status: false,
    };
    Swal.fire({
      title: "Reject Timesheet",
      text: "Are you sure you want to reject this timesheet?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateSubmittedSheet(data).unwrap();
          Swal.fire({
            title: "Rejected!",
            text: "The timesheet has been rejected.",
            icon: "success",
          });
          refetch();
          navigate(-1);
        } catch (error) {
          console.error("Failed to reject timesheet:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to reject timesheet",
            icon: "error",
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="py-4 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-500">
              Loading timesheet data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!userSheet?.data) {
    return (
      <div className="py-4 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">No timesheet data available</p>
        </div>
      </div>
    );
  }

  const { user, payrollSheet } = userSheet.data;
  const clockSheetData = payrollSheet?.clockSheet;

  return (
    <div className="py-4 bg-gray-50 min-h-screen">
      {/* User Information Header */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4 py-3">
          <div className="flex-shrink-0 h-12 w-12">
            <img
              className="h-12 w-12 rounded-full"
              src={
                user.profileUrl !== "N/A"
                  ? user.profileUrl
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(`${user.firstName} ${user.lastName}`)
              }
              alt={`${user.firstName} ${user.lastName}`}
            />
          </div>
          <div className="">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
          </div>
        </div>
        {/* Action Buttons */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Review & Approve Timesheet
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Please review all clock entries above and take appropriate
                action
              </p>
            </div>
            <div className="flex items-center space-x-3">
             {
                userSheet?.data?.payroll?.status ==="PENDING" ? <>

               <Button
                 variant="outline"
                 onClick={handleReject}
                 className="flex items-center space-x-2 px-6 py-3 border-red-300 text-red-700 hover:bg-red-50"
               >
                 <XCircle className="h-5 w-5" />
                 <span className="font-medium">Reject Timesheet</span>
               </Button>
               <Button
                 onClick={handleAccept}
                 className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
               >
                 <CheckCircle className="h-5 w-5" />
                 <span>Approve Timesheet</span>
               </Button>
             </> : <div>
                <span className="font-semibold">Status: <span className={`${userSheet?.data?.payroll?.status === "APPROVED" ? "bg-green-600" : "bg-red-600"} text-white px-3 py-2 rounded-md`}>{userSheet?.data?.payroll?.status}</span></span>
             </div>
             }

             <button 
               onClick={exportToPDF}
               className="flex items-center space-x-2 px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
             >
               <FileText className="h-6 w-6" /> 
               <span>Export</span>
             </button>
            </div>
          </div>
        </section>
      </section>

      {/* Summary Cards */}
      {payrollSheet?.paymentData && (
        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pay Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {payrollSheet.paymentData.totalRegularHour.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Regular Hours</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">
                {payrollSheet.paymentData.totalOvertimeHour.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Overtime Hours</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                ${payrollSheet.paymentData.totalRegularPay.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                ${payrollSheet.paymentData.payPerDay.regularPayRate}/hr
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">
                ${payrollSheet.paymentData.totalOvertimePay.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                ${payrollSheet.paymentData.payPerDay.overTimePayRate}/hr
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Clock Sheet Data */}
      {clockSheetData?.result?.map((week: WeeklyData, weekIndex: number) => (
        <section
          key={weekIndex}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6"
        >
          {/* Week Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Week {weekIndex + 1}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {format(new Date(week.weekStart), "MMMM dd")} -{" "}
                    {format(new Date(week.weekEnd), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Weekly Total</p>
                <p className="text-lg font-bold text-gray-900">
                  {week.weeklyTotal.toFixed(2)} hrs
                </p>
              </div>
            </div>
          </div>

          {/* Days Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date & Day
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Clock In (Start)
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Clock Out (End)
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Regular Hours
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Overtime Hours
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {week.days.flatMap((day: DayData) =>
                  day.entries.map((entry: ClockEntry, entryIndex: number) => (
                    <tr
                      key={`${day.date}-${entryIndex}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {format(new Date(day.date), "MMM dd")}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(day.date), "EEEE")}
                            </div>
                            {day.entries.length > 1 && (
                              <div className="text-xs text-gray-400">
                                Entry #{entryIndex + 1}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(entry.start), "HH:mm")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(entry.start), "MMM dd")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(entry.end), "HH:mm")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(entry.end), "MMM dd")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {entry.regular.toFixed(2)} hours
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {entry.overtime.toFixed(2)} hours
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.totalHours.toFixed(2)} hours
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {/* Weekly Summary Row */}
                <tr className="bg-gray-50 border-t-2 border-gray-300">
                  <td colSpan={5} className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-gray-900">
                      Weekly Total:
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">
                      {week.weeklyTotal.toFixed(2)} hours
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {/* Grand Total Summary */}
      {payrollSheet?.paymentData && (
        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Grand Totals Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {payrollSheet.paymentData.totalRegularHour.toFixed(2)}
              </div>
              <div className="text-sm text-blue-600">Total Regular Hours</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">
                {payrollSheet.paymentData.totalOvertimeHour.toFixed(2)}
              </div>
              <div className="text-sm text-orange-600">
                Total Overtime Hours
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {(
                  payrollSheet.paymentData.totalRegularHour +
                  payrollSheet.paymentData.totalOvertimeHour
                ).toFixed(2)}
              </div>
              <div className="text-sm text-purple-600">Total Hours</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SingleUserSheet;
