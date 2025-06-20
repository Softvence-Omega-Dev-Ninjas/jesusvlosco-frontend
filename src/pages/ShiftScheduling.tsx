
import ProjectHeader from "@/components/ShiftScheduling/ProjectHeader";
import ShiftScheduler from "@/components/ShiftScheduling/ShiftScheduler";

export default function ShiftScheduling() {
    return (
        <div>
            <ProjectHeader />
            <ShiftScheduler/>
        </div>
    )

import { useState } from "react";
import {
  RefreshCw,
  UserPlus,
  MoreHorizontal,
  LucideCalendarDays,
  LucideCheck,
  X,
  ChevronDown,
  Tally1,
  LoaderCircle,
} from "lucide-react";

// Imported local image assets
import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";
import user4 from "../assets/user4.png";
import user5 from "../assets/user5.png";
import user6 from "../assets/user6.png";
import { Link } from "react-router-dom";

interface Employee {
  id: number;
  name: string;
  role: string;
  avatar: string; // This will now hold the actual imported image path/URL
  project: string;
  shift: "Morning" | "Night";
  time: string;
  date: string;
}

interface TimeOffRequest {
  id: number;
  name: string;
  avatar: string;
  type: string;
  date: string;
  status: "Pending" | "Approved" | "Declined";
}

interface ShiftNotification {
  id: number;
  message: string;
  time: string;
  type: "schedule" | "assignment";
}

const ShiftScheduling = () => {
  const [employees] = useState<Employee[]>([
    {
      id: 1,
      name: "Jane Cooper",
      role: "Project Manager",
      avatar: user1, // Using imported image asset
      project: "Metro Shopping Center",
      shift: "Morning",
      time: "9:00am-5:00pm",
      date: "22/05/2025",
    },
    {
      id: 2,
      name: "Robert Fox",
      role: "Construction Site Manager",
      avatar: user2, // Using imported image asset
      project: "Riverside Apartments",
      shift: "Night",
      time: "9:00am-6:00pm",
      date: "07/02/2025",
    },
    {
      id: 3,
      name: "Esther Howard",
      role: "Assistant Project Manager",
      avatar: user3, // Using imported image asset
      project: "City Bridge Renovations",
      shift: "Night",
      time: "9:00am-8:00pm",
      date: "22/06/2025",
    },
    {
      id: 4,
      name: "Desirae Botosh",
      role: "Superintendent",
      avatar: user4, // Using imported image asset
      project: "Tech Campus Phase 2",
      shift: "Morning",
      time: "9:00am-5:00pm",
      date: "02/02/2025",
    },
    {
      id: 5,
      name: "Marley Stanton",
      role: "Coordinator",
      avatar: user5, // Using imported image asset
      project: "Golden Hills Estates",
      shift: "Morning",
      time: "9:00am-5:00pm",
      date: "02/02/2025",
    },
    {
      id: 6,
      name: "Kaylynn Stanton",
      role: "Site Supervisor",
      avatar: user6, // Changed to use an imported image, assuming user6 is appropriate
      project: "Parkside Retreat",
      shift: "Night",
      time: "9:00am-6:00pm",
      date: "02/02/2025",
    },
    {
      id: 7,
      name: "Brandon Vaccaro",
      role: "Operations Manager",
      avatar: user6, // Using imported image asset (reused for demo)
      project: "Summit Plaza Offices",
      shift: "Morning",
      time: "9:00am-5:00pm",
      date: "02/02/2025",
    },
    {
      id: 8,
      name: "Erin Press",
      role: "Estimating Manager",
      avatar: user1, // Using imported image asset (reused for demo)
      project: "Innovation Hub Tower",
      shift: "Morning",
      time: "9:00am-5:00pm",
      date: "02/02/2025",
    },
    {
      id: 9,
      name: "Makenna Dorwart",
      role: "Structural Engineer",
      avatar: user2, // Using imported image asset (reused for demo)
      project: "The Commerce Hub",
      shift: "Night",
      time: "9:00am-6:00pm",
      date: "02/02/2025",
    },
    {
      id: 10,
      name: "Ann Gouse",
      role: "Mechanical Engineer",
      avatar: user3, // Using imported image asset (reused for demo)
      project: "CrossCity Tunnel",
      shift: "Night",
      time: "9:00am-6:00pm",
      date: "02/02/2025",
    },
    {
      id: 11,
      name: "Emery Westervelt",
      role: "Site Engineer",
      avatar: user4, // Using imported image asset (reused for demo)
      project: "Parkside Roadway Project",
      shift: "Morning",
      time: "9:00am-5:00pm",
      date: "02/02/2025",
    },
    {
      id: 12,
      name: "Jocelyn Lubin",
      role: "Safety Engineer",
      avatar: user5, // Using imported image asset (reused for demo)
      project: "Redstone Power Station",
      shift: "Morning",
      time: "9:00am-5:00pm",
      date: "02/02/2025",
    },
  ]);

  const [timeOffRequests] = useState<TimeOffRequest[]>([
    {
      id: 1,
      name: "Jane Cooper",
      avatar: user1, // Using imported image asset
      type: "Doctor's appointment",
      date: "Mar 16, 2025",
      status: "Pending",
    },
    {
      id: 2,
      name: "Jenny Wilson",
      avatar: user2, // Using imported image asset
      type: "Sick leave",
      date: "Mar 30, 2025",
      status: "Approved",
    },
    {
      id: 3,
      name: "Kristin Watson",
      avatar: user3, // Using imported image asset
      type: "Personal day",
      date: "Jun 02, 2025",
      status: "Declined",
    },
  ]);

  const [notifications] = useState<ShiftNotification[]>([
    {
      id: 1,
      message: "New shift schedule has been published",
      time: "Yesterday",
      type: "schedule",
    },
    {
      id: 2,
      message: "Robert Fox has been assigned to the closing shift",
      time: "1 hour ago",
      type: "assignment",
    },
    {
      id: 3,
      message: "New shift schedule has been published",
      time: "Yesterday",
      type: "schedule",
    },
  ]);

  // State for the calendar modal visibility
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // States for calendar month and year selection
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed for month
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today); // To highlight selected day

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Function to generate dates for the current month
  const generateDatesForMonth = (month: number, year: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDays = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const datesArray: (Date | null)[] = [];

    // Add nulls for padding at the beginning of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      datesArray.push(null);
    }

    // Add actual dates
    for (let i = 1; i <= numDays; i++) {
      datesArray.push(new Date(year, month, i));
    }
    return datesArray;
  };

  const dates = generateDatesForMonth(currentMonth, currentYear);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [monthName, yearString] = e.target.value.split(" ");
    const newMonth = monthNames.findIndex((name) => name === monthName);
    const newYear = parseInt(yearString, 10);
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    // When month/year changes, deselect date unless the same date exists in new month (optional)
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date | null) => {
    setSelectedDate(date);
    // You can add logic here to pass the selected date back to parent component or another state
  };

  // Helper to get years for the select dropdown (e.g., current year +/- 5 years)
  const getYears = () => {
    const years = [];
    const currentYr = new Date().getFullYear();
    for (let i = currentYr - 5; i <= currentYr + 5; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="w-full lg:p-6 col-span-9">
          {/* Header (will not dim) */}
          <div className="flex items-center justify-between mb-6 px-6 lg:px-0">
            <h1 className="text-xl font-semibold text-primary">
              Overview Project 1
            </h1>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Assigned Employee Card - This is the only part that should dim */}
          <div
            className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-opacity duration-300 ${
              isCalendarModalOpen ? "opacity-30" : "opacity-100"
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between p-5">
              <h2 className="text-xl font-semibold text-primary">
                Assigned Employee
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 lg:px-4 lg:py-3 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors  cursor-pointer"
                  onClick={() => setIsCalendarModalOpen(true)} // Open modal on click
                >
                  <LucideCalendarDays></LucideCalendarDays>
                  <Tally1 /> 
                  <span>
                    <ChevronDown />
                  </span>{" "}
                  {/* Added size for consistency */}
                </button>
                <button className="flex items-center gap-2 lg:px-5 lg:py-3 px-3 py-2  bg-primary text-white  font-medium rounded-lg  transition-colors  cursor-pointer">
                  <UserPlus />
                  Assign
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-5 py-3 border border-primary rounded-xl lg:mx-5">
                <div
                  className="grid items-center"
                  style={{ gridTemplateColumns: "3fr 4fr 2fr 1fr" }}
                >
                  <div className="text-sm font-medium text-primary">
                    Employee
                  </div>
                  <div className="text-sm font-medium text-primary">
                    Project Name
                  </div>
                  <div className="text-sm font-medium text-primary">Shift</div>
                  <div className="text-sm font-medium text-primary">Date</div>
                </div>
              </div>

              {/* Table Body */}
              <div>
                {employees.map((employee, index) => (
                  <div
                    key={employee.id}
                    className={`px-5 py-4 border-b-2 border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <div
                      className="grid items-center"
                      style={{ gridTemplateColumns: "3fr 4fr 2fr 1fr" }}
                    >
                      {/* Employee */}
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            {" "}
                            {/* Added flex-shrink-0 */}
                            <img
                              src={employee.avatar}
                              alt={employee.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-primary">
                              {employee.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {employee.role}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Name */}
                      <div>
                        <div className="text-sm text-gray-700">
                          {employee.project}
                        </div>
                      </div>

                      {/* Shift */}
                      <div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-500">
                            {employee.shift}
                          </div>
                          <div className="text-xs text-gray-500">
                            {employee.time}
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <div className="text-sm text-gray-700">
                          {employee.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (will not dim) */}
        <div className="border-t border-gray-200 w-full lg:border-t-0  col-span-3 mt-4 ">
          {/* Time-off Requests */}
          <div className="mb-8 p-6 lg:p-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 px-3">
                Time-off requests
              </h3>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <LoaderCircle />
              </button>
            </div>

            <div className="space-y-4 p-2">
              {timeOffRequests.map((request) => (
                <Link
                  to="/schedule/timeoffrequest"
                  key={request.id}
                  className="block transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={request.avatar}
                        alt={request.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {request.name}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === "Pending"
                              ? "bg-orange-200 text-orange-800"
                              : request.status === "Approved"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="-ml-10 mt-5">
                        {request.date && (
                          <p className="text-sm text-gray-600 mb-1">
                            <LucideCalendarDays
                              size={14}
                              className="inline-block mr-1"
                            />
                            {request.date}
                          </p>
                        )}
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {request.type}
                        </p>

                        {request.status === "Pending" && (
                          <div className="flex items-center justify-between pt-2">
                            <button className="flex gap-2 border border-gray-200 p-2 rounded-md">
                              <LucideCalendarDays />
                              Deadline
                            </button>
                            <button className="bg-green-500 flex gap-2 p-2 rounded-md text-white">
                              <LucideCheck />
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              <div className="text-center pt-2">
                <button className="text-sm text-primary font-medium">
                  End of Requests
                </button>
              </div>
            </div>
          </div>

          {/* Shift Notifications */}
          <div className="p-6 lg:p-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-3">
              Shift Notification
            </h3>
            <div className="space-y-4 p-2 ">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-gray-100 rounded-lg"
                >
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              ))}

              <div className="text-center pt-2">
                <button className="text-sm text-primary font-medium">
                  End of notification
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Calendar Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-10  lg:left-48">
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-xl lg:w-[500px] p-6 right-0 relative z-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Shift Calendar
                </h3>
                <p className="text-sm text-gray-500">
                  View and manage employee shifts for the month
                </p>
              </div>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" /> {/* Close icon */}
              </button>
            </div>

            {/* Date Navigation */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => {
                    const today = new Date();
                    setCurrentMonth(today.getMonth());
                    setCurrentYear(today.getFullYear());
                    setSelectedDate(today); // Select today's date
                  }}
                >
                  Today
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Last 8 days
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1">
                  Last month <MoreHorizontal size={14} />
                </button>
              </div>

              {/* Dynamic Month and Year Selector */}
              <select
                className="px-2 py-1 text-sm border border-gray-300 rounded-md"
                value={`${monthNames[currentMonth]} ${currentYear}`}
                onChange={handleMonthChange}
              >
                {getYears().map((year) =>
                  monthNames.map((monthName) => (
                    <option
                      key={`${monthName}-${year}`}
                      value={`${monthName} ${year}`}
                    >
                      {monthName} {year}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Calendar Grid */}
            <div className="flex">
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2 flex-1">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className={`text-center text-sm p-1 rounded-md cursor-pointer
                      ${
                        date &&
                        date.toDateString() === selectedDate?.toDateString() // Highlight selected date
                          ? "bg-indigo-600 text-white font-semibold" // Style for selected date
                          : date && date.toDateString() === today.toDateString()
                          ? "bg-yellow-300 text-gray-800 font-semibold" // Highlight today
                          : "text-gray-800"
                      }
                      ${!date ? "text-gray-300 pointer-events-none" : ""}
                      ${
                        date &&
                        (date.getDay() === 0 || date.getDay() === 6) &&
                        date.toDateString() !== selectedDate?.toDateString()
                          ? "text-gray-400"
                          : ""
                      }
                    `}
                    onClick={() => handleDateClick(date)}
                  >
                    {date ? date.getDate() : ""}
                  </div>
                ))}
              </div>

              {/* Month Selector Sidebar (Vertical on the right) */}
              <div className="ml-4 w-20 text-right space-y-1">
                {monthNames.map((month, index) => (
                  <div
                    key={month}
                    className={`text-sm font-medium cursor-pointer ${
                      index === currentMonth
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`} // Highlight current month
                    onClick={() => {
                      setCurrentMonth(index);
                      setSelectedDate(null); // Deselect date when month changes
                    }}
                  >
                    {month}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftScheduling;
