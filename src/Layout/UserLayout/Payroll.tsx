// src/TimeSheets.tsx

// 1. IMPORTS & LEAFLET CONFIGURATION
// External Libraries
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet's core CSS
import { useState } from "react";

// Custom Icons (ensure these paths are correct in your project)
// import { DropdownArrowIcon, SearchIcon } from "@/components/TimeSheets/Icons";

// --- Leaflet Default Icon Fix (IMPORTANT for marker display) ---
// This is necessary because Webpack/Vite might not correctly bundle Leaflet's default icons.
// These URLs point to Leaflet's CDN, ensuring the icons load correctly.
import PendingRequestModal from "@/components/TimeSheets/PendingRequestModal";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { useGetSubmittedClockSheetQuery } from "@/store/api/clockInOut/clockinoutapi";
import { Link } from "react-router-dom";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: shadow,
});


interface PayrollEntry {
  id: string;
  userId: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  amount: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    phone: string;
    employeeID: number;
    email: string;
    role: string;
    isLogin: boolean;
    lastLoginAt: string;
    profile: {
      firstName: string;
      lastName: string;
      profileUrl: string;
    };
  };
}

interface ActivityItem {
  id: number;
  time: string;
  avatars: string[]; // Array of avatar URLs for users involved
  description: string;
}

export default function Payroll() {
  const [pagination, setPagination] = useState<{ page: number; limit: number }>({
    page: 1,
    limit: 10,
  });
  const {data: getSubmittedClockSheet, isLoading} = useGetSubmittedClockSheetQuery(pagination);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // New state for modal visibility

  console.log("getSubmittedClockSheet", getSubmittedClockSheet);
  // 3.2. DUMMY DATA (Commented out - using real API data now)
  // const employeeData: Employee[] = [
  //   {
  //     id: 1,
  //     name: "Jane Cooper",
  //     avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  //     project: "Metro Shopping Center",
  //     location: "Los Angeles, California",
  //     clockIn: "8:00 AM",
  //     clockOut: "6:00 PM",
  //     totalHours: "10 hours",
  //     regular: "9 hours",
  //     overtime: "1 hour",
  //     paidTimeOff: "8 hours",
  //     regularPayment: "100 US $",
  //     totalPay: "100 US $",
  //   },
  //   {
  //     id: 2,
  //     name: "Robert Fox",
  //     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  //     project: "Riverside Apartments",
  //     location: "Chicago, Illinois",
  //     clockIn: "8:00 AM",
  //     clockOut: "6:00 PM",
  //     totalHours: "10 hours",
  //     regular: "9 hours",
  //     overtime: "1 hour",
  //     paidTimeOff: "8 hours",
  //     regularPayment: "100 US $",
  //     totalPay: "100 US $",
  //   },
  //   {
  //     id: 3,
  //     name: "Esther Howard",
  //     avatar: "https://randomuser.me/api/portraits/women/27.jpg",
  //     project: "City Bridge Renovations",
  //     location: "Miami, Florida",
  //     clockIn: "8:00 AM",
  //     clockOut: "6:00 PM",
  //     totalHours: "10 hours",
  //     regular: "9 hours",
  //     overtime: "1 hour",
  //     paidTimeOff: "8 hours",
  //     regularPayment: "100 US $",
  //     totalPay: "100 US $",
  //   },
  //   {
  //     id: 4,
  //     name: "Desirae Botosh",
  //     avatar: "https://randomuser.me/api/portraits/women/63.jpg",
  //     project: "Tech Campus Phase 2",
  //     location: "Seattle, Washington",
  //     clockIn: "8:00 AM",
  //     clockOut: "6:00 PM",
  //     totalHours: "10 hours",
  //     regular: "9 hours",
  //     overtime: "1 hour",
  //     paidTimeOff: "8 hours",
  //     regularPayment: "100 US $",
  //     totalPay: "100 US $",
  //   },
  //   {
  //     id: 5,
  //     name: "Marley Stanton",
  //     avatar: "https://randomuser.me/api/portraits/men/18.jpg",
  //     project: "Golden Hills Estates",
  //     location: "New York City",
  //     clockIn: "8:00 AM",
  //     clockOut: "6:00 PM",
  //     totalHours: "10 hours",
  //     regular: "9 hours",
  //     overtime: "1 hour",
  //     paidTimeOff: "8 hours",
  //     regularPayment: "100 US $",
  //     totalPay: "100 US $",
  //   },
  //   {
  //     id: 6,
  //     name: "Kaylynn Stanton",
  //     avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  //     project: "City Bridge Renovations",
  //     location: "Miami, Florida",
  //     clockIn: "8:00 AM",
  //     clockOut: "6:00 PM",
  //     totalHours: "10 hours",
  //     regular: "9 hours",
  //     overtime: "1 hour",
  //     paidTimeOff: "8 hours",
  //     regularPayment: "100 US $",
  //     totalPay: "100 US $",
  //   },
  //   {
  //     id: 7,
  //     name: "Brandon Vaccaro",
  //     avatar: "https://randomuser.me/api/portraits/men/77.jpg",
  //     project: "Metro Shopping Center",
  //     location: "Los Angeles, California",
  //     clockIn: "8:00 AM",
  //     clockOut: "6:00 PM",
  //     totalHours: "10 hours",
  //     regular: "9 hours",
  //     overtime: "1 hour",
  //     paidTimeOff: "8 hours",
  //     regularPayment: "100 US $",
  //     totalPay: "100 US $",
  //   },
  // ];

  const activityData: ActivityItem[] = [
    {
      id: 1,
      time: "12:37 am",
      avatars: [
        "https://randomuser.me/api/portraits/men/77.jpg", // Admin
        "https://randomuser.me/api/portraits/women/45.jpg", // Jane Cooper
      ],
      description:
        "Admin approved Jane Employees shift on 18/06/2025 from 08:00 to 05:00",
    },
    {
      id: 2,
      time: "12:32 am",
      avatars: [
        "https://randomuser.me/api/portraits/men/32.jpg", // Employee
        "https://randomuser.me/api/portraits/women/27.jpg", // Esther Howard
      ],
      description:
        "Employee requested to add a new shift on 18/06/2025 from 08:00 to 05:00",
    },
    {
      id: 3,
      time: "11:38 am",
      avatars: [
        "https://randomuser.me/api/portraits/men/77.jpg",
        "https://randomuser.me/api/portraits/women/27.jpg",
      ],
      description:
        "Admin approved Jane Employees shift on 18/06/2025 from 08:00 to 05:00",
    },
    {
      id: 4,
      time: "12:30 am",
      avatars: [
        "https://randomuser.me/api/portraits/men/18.jpg",
        "https://randomuser.me/api/portraits/women/12.jpg",
      ],
      description:
        "Employee requested to add a new shift on 18/06/2025 from 08:00 to 05:00",
    },
    {
      id: 5,
      time: "12:00 am",
      avatars: [
        "https://randomuser.me/api/portraits/men/77.jpg",
        "https://randomuser.me/api/portraits/women/63.jpg",
      ],
      description:
        "Admin approved Jane Employees shift on 18/06/2025 from 08:00 to 05:00",
    },
  ];

  // 3.3. DERIVED DATA & HELPERS
  // const filteredData: Employee[] = employeeData.filter(
  //   (employee: Employee) =>
  //     employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     employee.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     employee.location.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const closeModal = (): void => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div
      className={`py-4 bg-gray-50 min-h-screen ${
        isModalOpen ? "overflow-hidden" : ""
      }`}
    >
      {/* Main content with conditional opacity */}
      <div
        className={`${
          isModalOpen ? "opacity-50 pointer-events-none" : ""
        } transition-all duration-300`}
      >

        {/* --- MAIN TABLE CONTENT SECTION --- */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Total hours
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Regular hours
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Overtime
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Paid time-off
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Total Pay
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Admin Approval
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-2 text-gray-500">Loading payroll data...</span>
                      </div>
                    </td>
                  </tr>
                ) : getSubmittedClockSheet?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No payroll entries found
                    </td>
                  </tr>
                ) : (
                  getSubmittedClockSheet?.data?.map((payrollEntry: PayrollEntry) => (
                    <tr key={payrollEntry.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* Employee profile picture */}
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={payrollEntry.user?.profile?.profileUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(`${payrollEntry.user?.profile?.firstName || 'User'} ${payrollEntry.user?.profile?.lastName || ''}`)}
                              alt={`${payrollEntry.user?.profile?.firstName || 'User'} ${payrollEntry.user?.profile?.lastName || ''}`}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {payrollEntry.user?.profile?.firstName || 'User'} {payrollEntry.user?.profile?.lastName || ''}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {payrollEntry.user?.employeeID || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payrollEntry.totalHours?.toFixed(2)} hours
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payrollEntry.regularHours?.toFixed(2)} hours
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payrollEntry.overtimeHours?.toFixed(2)} hours
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(payrollEntry.startDate).toLocaleDateString()} - {new Date(payrollEntry.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${payrollEntry.amount?.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 place-self-center">
                        <Link to={`${payrollEntry.id}`} className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-900">
                          Open
                        </Link>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payrollEntry.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : payrollEntry.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payrollEntry.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {getSubmittedClockSheet?.metadata && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(getSubmittedClockSheet.metadata.totalPage, prev.page + 1) }))}
                  disabled={pagination.page === getSubmittedClockSheet.metadata.totalPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, getSubmittedClockSheet.metadata.total)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{getSubmittedClockSheet.metadata.total}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, getSubmittedClockSheet.metadata.totalPage) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(getSubmittedClockSheet.metadata.totalPage - 4, pagination.page - 2)) + i;
                      if (pageNum > getSubmittedClockSheet.metadata.totalPage) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === pageNum
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(getSubmittedClockSheet.metadata.totalPage, prev.page + 1) }))}
                      disabled={pagination.page === getSubmittedClockSheet.metadata.totalPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <PendingRequestModal
            isOpen={isModalOpen}
            onClose={closeModal}
            activityData={activityData}
          />
        </div>
      )}
    </div>
  );
}
