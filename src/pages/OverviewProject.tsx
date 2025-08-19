/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  RefreshCw,
  UserPlus,
  MoreHorizontal,
  LucideCalendarDays,
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

import { Link, useParams } from "react-router-dom";
import { useGetUsersQuery } from "@/store/api/admin/shift-sheduling/getAllUser";
import TimeOffRequests from "@/components/Dashboard/TimeOffRequests";
import { ShiftNotifications } from "@/components/Dashboard/ShiftNotifications";
import {
  useApproveTimeOffRequestMutation,
  useDeclineTimeOffRequestMutation,
  useGetAllTimeOffRequestsQuery,
} from "@/store/api/admin/dashboard/TimeOffRequestsApi";

interface Employee {
  id: string;
  profileUrl?: string;
  name: string;
  jobTitle: string;
  project?: string;
  shift?: string;
  time?: string;
  date?: string;
  additionalProjects?: number;
}

const OverviewProject = () => {
  const projectId = useParams().id;

  const [approveTimeOffRequest] = useApproveTimeOffRequestMutation();

  const [declineTimeOffRequest] = useDeclineTimeOffRequestMutation();

  const { data: timeOff, refetch } = useGetAllTimeOffRequestsQuery({
    page: 1,
    limit: 10,
    status: "DRAFT",
    orderBy: "asc",
  });

  // Map backend data to UI-friendly shape
  const timeOffRequests =
    timeOff?.data?.map((req: any) => ({
      id: req.id,
      name: req.user?.profile?.firstName || "Unknown User", // or backend name field
      avatar:
        req.user?.profile?.profileUrl ||
        `https://i.pravatar.cc/40?img=${Math.random()}`,
      type: req.reason,
      date: new Date(req.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: req.status?.toLowerCase(),
    })) || [];

  const handleApprove = (id: string, adminNote: string) => {
    approveTimeOffRequest({ id, adminNote })
      .unwrap()
      .then(() => {
        console.log("Time off request approved:", id, adminNote);
        refetch();
      })
      .catch((err) => {
        console.error("Failed to approve time off request:", err);
      });
  };

  const handleDecline = async (
    id: string,
    adminNote: string,
    status: string
  ) => {
    try {
      const result = await declineTimeOffRequest({
        id,
        adminNote,
        status,
      }).then(() => {
        console.log("Time off request declined:", id, adminNote, status);
        refetch();
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // State for the calendar modal visibility
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // States for calendar month and year selection
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

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
    const startDayOfWeek = firstDayOfMonth.getDay();

    const datesArray: (Date | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      datesArray.push(null);
    }

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
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date | null) => {
    setSelectedDate(date);
  };

  const getYears = () => {
    const years = [];
    const currentYr = new Date().getFullYear();
    for (let i = currentYr - 5; i <= currentYr + 5; i++) {
      years.push(i);
    }
    return years;
  };

  // API call
  const { data, isLoading, error } = useGetUsersQuery({});
  console.log(data);

  // Default avatar images array for fallback
  const defaultAvatars = [user1, user2, user3, user4, user5, user6];

  // Helper function to get job title display name
  const getJobTitleDisplay = (jobTitle: string) => {
    const jobTitleMap: { [key: string]: string } = {
      FRONT_END_DEVELOPER: "Frontend Developer",
      BACK_END_DEVELOPER: "Backend Developer",
      FULL_STACK_DEVELOPER: "Full Stack Developer",
      PROJECT_MANAGER: "Project Manager",
      DESIGNER: "Designer",
      QA_ENGINEER: "QA Engineer",
      DEVOPS_ENGINEER: "DevOps Engineer",
      BUSINESS_ANALYST: "Business Analyst",
      PRODUCT_MANAGER: "Product Manager",
      SCRUM_MASTER: "Scrum Master",
    };
    return (
      jobTitleMap[jobTitle] ||
      jobTitle
        ?.replace(/_/g, " ")
        ?.toLowerCase()
        ?.replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "Employee"
    );
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "N/A";
    }
  };

  // Process the employees data from API
  const processedEmployees = data?.data
    ? data.data.map((user: any, index: number) => {
        const profile = user.profile;
        const primaryProject = user.projects?.[0];
        const additionalProjectsCount =
          user.projects?.length > 1 ? user.projects.length - 1 : 0;

        return {
          id: user.id,
          name: profile
            ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
            : "Unknown User",
          jobTitle: getJobTitleDisplay(profile?.jobTitle),
          profileUrl:
            profile?.profileUrl ||
            defaultAvatars[index % defaultAvatars.length],
          project: primaryProject
            ? primaryProject.title
            : "No Project Assigned",
          additionalProjects: additionalProjectsCount,
          shift: "Morning", // Default since shift data structure seems to be empty in the API
          time: "9:00am-5:00pm", // Default time
          date: formatDate(user.updatedAt),
          location: primaryProject?.projectLocation || "Not specified",
        };
      })
    : [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin mr-2" size={24} />
        <span>Loading employees...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading employees</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                  className="flex items-center gap-1 lg:px-4 lg:py-3 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setIsCalendarModalOpen(true)}
                >
                  <LucideCalendarDays></LucideCalendarDays>
                  <Tally1 />
                  <span>
                    <ChevronDown />
                  </span>
                </button>

                <Link to={`/admin/schedule/shift-scheduling/${projectId}`}>
                  <button className="flex items-center gap-2 lg:px-5 lg:py-3 px-3 py-2 bg-primary text-white font-medium rounded-lg transition-colors cursor-pointer">
                    <UserPlus />
                    Assign
                  </button>
                </Link>
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
                {processedEmployees && processedEmployees.length > 0 ? (
                  processedEmployees.map(
                    (employee: Employee, index: number) => (
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
                                <img
                                  src={employee.profileUrl}
                                  alt={employee.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src =
                                      defaultAvatars[
                                        index % defaultAvatars.length
                                      ];
                                  }}
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-primary">
                                  {employee.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {employee.jobTitle}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Project Name */}
                          <div>
                            <div className="text-sm text-gray-700">
                              {employee.project}
                              {employee.additionalProjects &&
                                employee.additionalProjects > 0 && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    +{employee.additionalProjects} more
                                  </span>
                                )}
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
                    )
                  )
                ) : (
                  <div className="px-5 py-8 text-center text-gray-500">
                    No employees found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (will not dim) */}
        <div className="border-t border-gray-200 w-full lg:border-t-0 col-span-3 mt-4">
          {/* Time-off Requests */}

          <TimeOffRequests
            requests={timeOffRequests}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
          <ShiftNotifications />
        </div>
      </div>

      {/* Shift Calendar Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-10 lg:left-48">
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
                <X size={20} className="text-gray-500" />
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
                    setSelectedDate(today);
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
                        date.toDateString() === selectedDate?.toDateString()
                          ? "bg-indigo-600 text-white font-semibold"
                          : date && date.toDateString() === today.toDateString()
                          ? "bg-yellow-300 text-gray-800 font-semibold"
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
                    }`}
                    onClick={() => {
                      setCurrentMonth(index);
                      setSelectedDate(null);
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

export default OverviewProject;
