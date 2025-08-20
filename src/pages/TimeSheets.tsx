// src/TimeSheets.tsx

// 1. IMPORTS & LEAFLET CONFIGURATION
// External Libraries
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet's core CSS
import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Custom Icons (ensure these paths are correct in your project)
import {
  DropdownArrowIcon,
  LocationPinIcon,
  SearchIcon,
} from "@/components/TimeSheets/Icons";

// --- Leaflet Default Icon Fix (IMPORTANT for marker display) ---
// This is necessary because Webpack/Vite might not correctly bundle Leaflet's default icons.
// These URLs point to Leaflet's CDN, ensuring the icons load correctly.
import PendingRequestModal from "@/components/TimeSheets/PendingRequestModal";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { useGetAllTimeClockAdminQuery } from "@/store/api/admin/time-clock/timeClockApi";

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
}

interface ActivityItem {
  id: number;
  time: string;
  avatars: string[]; // Array of avatar URLs for users involved
  description: string;
}

// 3. TIMESHEETS COMPONENT
export default function TimeSheets() {
  // 3.1. STATE MANAGEMENT
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<string>("19/06/2025");
  const { data } = useGetAllTimeClockAdminQuery(null);

  const pendingTimeClockRequest = data?.data?.filter(
    (el: any) => el.shiftStatus === "DRAFT"
  );
  console.log({ pendingTimeClockRequest });
  const [selectedActivityDate, setSelectedActivityDate] =
    useState<string>("19/06");
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

  // Map Configuration
  const dhakaCoordinates: [number, number] = [23.8103, 90.4125]; // Corrected coordinates for central Dhaka
  const mapZoom = 15; // Good initial zoom level for city view
  const mapStyle = {
    height: "350px", // Adjusted height to be visually balanced
    width: "100%",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  // 3.4. RENDER METHOD (JSX Structure)
  return (
    <div
      className={`py-4 bg-gray-50  min-h-screen ${
        isModalOpen ? "overflow-hidden" : ""
      }`}
    >
      {/* Main content with conditional opacity */}
      <div
        className={`${
          isModalOpen ? "opacity-50  pointer-events-none" : ""
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
          <div className="flex flex-col  sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Pending Requests Button (Badge) */}
            <button
              onClick={handlePendingRequestsClick}
              className="relative cursor-pointer flex items-center justify-center px-4 py-2 rounded-full border border-yellow-500 text-yellow-700 font-semibold text-sm bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200 whitespace-nowrap"
            >
              <span className="absolute -top-2 -left-2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                {pendingTimeClockRequest?.length}
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
        <section className="flex py-4 justify-between gap-2">
          <div className="flex gap-10">
            <div>
              <p className="text-xl font-bold text-gray-900">08.00</p>
              <p className="text-sm text-gray-500">Regular</p>
            </div>
            <div className="flex items-center">+</div>
            <div>
              <p className="text-xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Overtime</p>
            </div>
            <div className="flex items-center">+</div>
            <div>
              <p className="text-xl font-bold text-gray-900">00:00</p>
              <p className="text-sm text-gray-500">Paid time off</p>
            </div>
            <div className="flex items-center">=</div>
            <div>
              <p className="text-xl font-bold text-gray-900">08:00</p>
              <p className="text-sm text-gray-500">Total Paid Hours</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center pl-4">
            <div>
              <p className="text-xl font-bold text-gray-900">00:00</p>
              <p className="text-sm text-gray-500">Unpaid time off</p>
            </div>
          </div>
        </section>

        {/* --- MAIN TABLE CONTENT SECTION --- */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]"
                  >
                    Project
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Clock In
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Clock Out
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Total Hours
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Regular
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Total Overtime
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Paid Time-off
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]"
                  >
                    Regular Payment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((employee: Employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
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
                        {employee.project}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <LocationPinIcon className="w-4 h-4 mr-1" />
                        {employee.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.clockIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.clockOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.totalHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.regular}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.overtime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.paidTimeOff}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.regularPayment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- REAL MAP SECTION --- */}
        <section className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Map Location
          </h3>
          <MapContainer
            key="dhaka-map" // Key helps React re-render correctly on prop changes
            center={dhakaCoordinates}
            zoom={mapZoom}
            style={mapStyle}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={dhakaCoordinates} icon={customIcon}>
              <Popup>A general location in Dhaka, Bangladesh.</Popup>
            </Marker>
          </MapContainer>
        </section>

        {/* --- ACTIVITY SECTION --- */}
        <section className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Activity</h3>

          {/* Activity Date Filter */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-md font-medium text-sm">
              {selectedActivityDate}
            </button>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedActivityDate}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedActivityDate(e.target.value)
                }
              >
                <option value="19/06">19/06</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last-week">Last Week</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                {/* You might need a CalendarIcon here if you have one, otherwise DropdownArrowIcon */}
                <DropdownArrowIcon className="fill-current h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-4">
            {activityData.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                {/* Time Column */}
                <div className="flex-shrink-0 w-[80px] text-right pt-1">
                  <span className="text-sm font-medium text-gray-500">
                    {activity.time}
                  </span>
                </div>

                {/* Activity Details */}
                <div className="flex-grow flex items-start space-x-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {/* Clock Icon - Replace with your actual ClockIcon component if available */}
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>

                  {/* Avatars */}
                  <div className="flex-shrink-0 flex -space-x-2 overflow-hidden">
                    {activity.avatars.map((avatarUrl, index) => (
                      <img
                        key={index}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                        src={avatarUrl}
                        alt={`Activity participant ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Description */}
                  <div className="flex-grow text-sm text-gray-700 leading-relaxed pt-1">
                    {activity.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <PendingRequestModal
            isOpen={isModalOpen}
            onClose={closeModal}
            activityData={pendingTimeClockRequest}
          />
        </div>
      )}
    </div>
  );
}
