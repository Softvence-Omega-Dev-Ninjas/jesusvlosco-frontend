// src/TimeSheets.tsx

// 1. IMPORTS & LEAFLET CONFIGURATION
// External Libraries
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet's core CSS
import React, { useState } from "react";

// Custom Icons (ensure these paths are correct in your project)
import { DropdownArrowIcon, SearchIcon } from "@/components/TimeSheets/Icons";

// --- Leaflet Default Icon Fix (IMPORTANT for marker display) ---
// This is necessary because Webpack/Vite might not correctly bundle Leaflet's default icons.
// These URLs point to Leaflet's CDN, ensuring the icons load correctly.
import PendingRequestModal from "@/components/TimeSheets/PendingRequestModal";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: shadow,
});
// --- End Leaflet Default Icon Fix ---

// 2. INTERFACES
interface Employee {
  id: number;
  name: string;
  avatar: string;
  project: string;
  location: string;
  clockIn: string;
  clockOut: string;
  totalHours: string;
  regular: string;
  overtime: string;
  paidTimeOff: string;
  regularPayment: string;
  totalPay?: string;
}

interface ActivityItem {
  id: number;
  time: string;
  avatars: string[]; // Array of avatar URLs for users involved
  description: string;
}

export default function Payroll() {
  // 3. STATE MANAGEMENT
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<string>("19/06/2025");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // New state for modal visibility

  // 3.2. DUMMY DATA
  const employeeData: Employee[] = [
    {
      id: 1,
      name: "Jane Cooper",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      project: "Metro Shopping Center",
      location: "Los Angeles, California",
      clockIn: "8:00 AM",
      clockOut: "6:00 PM",
      totalHours: "10 hours",
      regular: "9 hours",
      overtime: "1 hour",
      paidTimeOff: "8 hours",
      regularPayment: "100 US $",
      totalPay: "100 US $",
    },
    {
      id: 2,
      name: "Robert Fox",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      project: "Riverside Apartments",
      location: "Chicago, Illinois",
      clockIn: "8:00 AM",
      clockOut: "6:00 PM",
      totalHours: "10 hours",
      regular: "9 hours",
      overtime: "1 hour",
      paidTimeOff: "8 hours",
      regularPayment: "100 US $",
      totalPay: "100 US $",
    },
    {
      id: 3,
      name: "Esther Howard",
      avatar: "https://randomuser.me/api/portraits/women/27.jpg",
      project: "City Bridge Renovations",
      location: "Miami, Florida",
      clockIn: "8:00 AM",
      clockOut: "6:00 PM",
      totalHours: "10 hours",
      regular: "9 hours",
      overtime: "1 hour",
      paidTimeOff: "8 hours",
      regularPayment: "100 US $",
      totalPay: "100 US $",
    },
    {
      id: 4,
      name: "Desirae Botosh",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      project: "Tech Campus Phase 2",
      location: "Seattle, Washington",
      clockIn: "8:00 AM",
      clockOut: "6:00 PM",
      totalHours: "10 hours",
      regular: "9 hours",
      overtime: "1 hour",
      paidTimeOff: "8 hours",
      regularPayment: "100 US $",
      totalPay: "100 US $",
    },
    {
      id: 5,
      name: "Marley Stanton",
      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
      project: "Golden Hills Estates",
      location: "New York City",
      clockIn: "8:00 AM",
      clockOut: "6:00 PM",
      totalHours: "10 hours",
      regular: "9 hours",
      overtime: "1 hour",
      paidTimeOff: "8 hours",
      regularPayment: "100 US $",
      totalPay: "100 US $",
    },
    {
      id: 6,
      name: "Kaylynn Stanton",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      project: "City Bridge Renovations",
      location: "Miami, Florida",
      clockIn: "8:00 AM",
      clockOut: "6:00 PM",
      totalHours: "10 hours",
      regular: "9 hours",
      overtime: "1 hour",
      paidTimeOff: "8 hours",
      regularPayment: "100 US $",
      totalPay: "100 US $",
    },
    {
      id: 7,
      name: "Brandon Vaccaro",
      avatar: "https://randomuser.me/api/portraits/men/77.jpg",
      project: "Metro Shopping Center",
      location: "Los Angeles, California",
      clockIn: "8:00 AM",
      clockOut: "6:00 PM",
      totalHours: "10 hours",
      regular: "9 hours",
      overtime: "1 hour",
      paidTimeOff: "8 hours",
      regularPayment: "100 US $",
      totalPay: "100 US $",
    },
  ];

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
  const filteredData: Employee[] = employeeData.filter(
    (employee: Employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePendingRequestsClick = (): void => {
    setIsModalOpen(true); // Open the modal when button is clicked
  };

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
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Time Clock</h2>

        {/* --- DASHBOARD HEADER SECTION --- */}
        <section className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          {/* Time Period Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">Time Period:</span>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedTimePeriod(e.target.value)
                }
                value={selectedTimePeriod}
              >
                <option value="19/06/2025">19/06/2025</option>
                <option value="recent-7-days">Recent 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <DropdownArrowIcon className="fill-current h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Search and Pending Requests */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Pending Requests Button (Badge) */}
            <button
              onClick={handlePendingRequestsClick}
              className="relative flex items-center justify-center px-4 py-2 rounded-full border border-yellow-500 text-yellow-700 font-semibold text-sm bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200 whitespace-nowrap"
            >
              <span className="absolute -top-2 -left-2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                1
              </span>
              <span className="block leading-tight">Pending Requests</span>
            </button>

            <div className="relative w-full bg-white sm:w-auto">
              {/* Search Input */}
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
          </div>
        </section>

        {/* --- TOP SUMMARY SECTION --- */}
        <div className="py-4 flex justify-between gap-2  ">
          <div className="flex gap-10">
            <div>
              <p className="text-xl font-bold text-gray-900">183.75</p>
              <p className="text-sm text-gray-500">Regular</p>
            </div>
            <div className="flex items-center">+</div>
            <div>
              <p className="text-xl font-bold text-gray-900">11</p>
              <p className="text-sm text-gray-500">1.5 X Overtime</p>
            </div>
            <div className="flex items-center">+</div>
            <div>
              <p className="text-xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500">Paid time off</p>
            </div>
            <div className="flex items-center">=</div>
            <div>
              <p className="text-xl font-bold text-gray-900">202.75</p>
              <p className="text-sm text-gray-500">Total Paid Hours</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-500">Unpaid time off</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-gray-200 pl-4">
            <p className="text-xl font-bold text-gray-900">2340,58 US$</p>
            <p className="text-sm text-gray-500">Pay per dates</p>
          </div>
        </div>

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
                {filteredData.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* Placeholder for profile picture */}
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={employee.avatar}
                            alt={employee.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.totalHours}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.regular}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.overtime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.paidTimeOff}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap ">
                      <div className="text-sm text-gray-900">
                        {employee.totalPay}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex place-self-center">
                      <button className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4E53B1] hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
