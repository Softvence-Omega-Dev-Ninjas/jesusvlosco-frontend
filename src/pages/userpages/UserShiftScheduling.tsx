import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { userDefaultTimeZone } from "@/utils/dateUtils";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useGetUserProjectDetailsQuery } from "@/store/api/user/project/projectApi";

interface Employee {
  id: string;
  name: string;
  role: string;
  status: "Available" | "Busy";
  offDay: string;
  avatar: string;
}

interface UserProject {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profileUrl?: string;
    offDay: string[];
    isAvailable: boolean;
  };
  project: {
    id: number;
    title: string;
  };
  shifts?: Array<{
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    shiftStatus: string;
    location: string;
    lat: number;
    lng: number;
  }>;
  allShifts?: Array<{
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    shiftStatus: string;
    location: string;
    lat: number;
    lng: number;
  }>;
}

export default function UserShiftScheduling() {
  const projectId = useParams<{ id: string }>().id;
  const [currentDate, setCurrentDate] = useState<DateTime>(
    DateTime.now().setZone(userDefaultTimeZone()).startOf("week")
  );
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const {
    data: projectInformation,
    isLoading,
    error,
  } = useGetUserProjectDetailsQuery(projectId as string);

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        // setShowVisibilityToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(projectInformation);

  // Transform API data to match component structure
  const users: UserProject[] = projectInformation?.data || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-3 px-4 sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading project information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !projectInformation?.data) {
    return (
      <div className="py-3 px-4 sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600">Error loading project information</p>
            <p className="text-gray-600 mt-2">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  // Generate week days using Luxon
  const timeZone = userDefaultTimeZone();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const dt = currentDate.plus({ days: i });
    return {
      day: dt.toFormat("ccc"), // Mon, Tue, etc.
      short: dt.toFormat("ccc"),
      date: dt.toFormat("MM/dd"),
      fullDate: dt.toISODate(), // YYYY-MM-DD
      dt,
    };
  });

  // Transform users data to employee format
  const employees: Employee[] = users.map((userProject: UserProject) => ({
    id: userProject.user.id.toString(),
    name: `${userProject.user.firstName} ${userProject.user.lastName}`,
    role: "Employee", // You can customize this based on your role system
    status: userProject.user.isAvailable ? "Available" : "Busy",
    offDay: userProject.user.offDay?.join(", ") || "None",
    avatar: userProject.user.profileUrl || "",
  }));

  const getShiftForEmployeeAndDay = (
    employeeId: string,
    day: string,
    fullDate: string
  ) => {
    const userProject = users.find(
      (up: UserProject) => up.user.id.toString() === employeeId
    );
    if (!userProject) return null;

    // Check if it's user's off day
    const dayNames = {
      Mon: "MONDAY",
      Tue: "TUESDAY",
      Wed: "WEDNESDAY",
      Thu: "THURSDAY",
      Fri: "FRIDAY",
      Sat: "SATURDAY",
      Sun: "SUNDAY",
    };

    const dayName = dayNames[day as keyof typeof dayNames];
    const isOffDay = userProject.user.offDay?.includes(dayName);

    if (isOffDay) {
      return {
        id: `off-${employeeId}-${day}`,
        status: "unavailable",
        time: "",
        location: "Off Day",
        isOffDay: true,
      };
    }

    // Find matching shift for the date using Luxon for comparison
    const shift = userProject.shifts?.find((shift) => {
      // Compare in user's timezone
      const shiftDate = DateTime.fromISO(shift.date, {
        zone: timeZone,
      }).toISODate();
      return shiftDate === fullDate;
    });

    if (shift) {
      // Format times in user's timezone
      const startTime = DateTime.fromISO(shift.startTime, {
        zone: timeZone,
      }).toFormat("h:mm a");
      const endTime = DateTime.fromISO(shift.endTime, {
        zone: timeZone,
      }).toFormat("h:mm a");

      return {
        id: shift.id,
        status: shift.shiftStatus === "PUBLISHED" ? "scheduled" : "available",
        time: `${startTime} - ${endTime}`,
        location: shift.location,
        title: shift.title,
        date: shift.date,
        isOffDay: false,
      };
    }

    return {
      id: `empty-${employeeId}-${day}`,
      status: "empty",
      time: "",
      location: "",
      isOffDay: false,
    };
  };
  const sortedEmployees = [...employees];

  // Week navigation helpers
  const goToPreviousWeek = () =>
    setCurrentDate(currentDate.minus({ weeks: 1 }));
  const goToNextWeek = () => setCurrentDate(currentDate.plus({ weeks: 1 }));

  // Format week range for display
  const formatDateRange = () => {
    const start = currentDate;
    const end = currentDate.plus({ days: 6 });
    return `${start.toFormat("MMM d")} - ${end.toFormat("MMM d, yyyy")}`;
  };

  return (
    <div className="py-3 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-primary">
          {`Shift Scheduling of Project ${users[0]?.project?.title}` ||
            "Shift Scheduling"}
        </h3>

        {/* Week Navigation */}
        <div className="flex items-center gap-2 mt-6 mb-2">
          <button
            onClick={goToPreviousWeek}
            className="p-1 rounded-md hover:bg-gray-200 transition-colors"
          >
            <HiOutlineChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 min-w-max font-medium">
            {formatDateRange()}
          </span>
          <button
            onClick={goToNextWeek}
            className="p-1 rounded-md hover:bg-gray-200 transition-colors"
          >
            <HiOutlineChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Weekly Schedule Container */}
      <div className="bg-white overflow-hidden w-full mt-3 sm:mt-4 rounded shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] sm:min-w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-white shadow-sm">
              <tr>
                <th className="p-3 sm:p-4 text-center font-semibold text-gray-900 min-w-[180px] bg-gray-50 border-b border-gray-200 rounded-tl-xl">
                  <div className="text-xs sm:text-sm">Team Member</div>
                </th>
                {days.map((day, idx) => (
                  <th
                    key={day.short}
                    className={`p-3 sm:p-4 text-center font-semibold text-gray-900 min-w-24 sm:min-w-32 bg-gray-50 border-b border-gray-200 ${
                      idx === days.length - 1 ? "rounded-tr-xl" : ""
                    }`}
                  >
                    <div className="text-xs sm:text-sm">
                      {day.day} {day.date}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.map((employee, rowIdx) => (
                <tr
                  key={employee.id}
                  className={`transition-colors ${
                    rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50`}
                >
                  <td className="p-3 sm:p-4 min-w-[180px] border-b border-gray-200 align-top">
                    <div className="flex items-start justify-start">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            employee.avatar ||
                            "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(employee.name)
                          }
                          alt={employee.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-200 shadow-sm"
                        />
                        <div className="min-w-0 flex flex-col gap-1 justify-start text-start">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {employee.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {employee.role}
                          </div>
                          <div
                            className={`text-xs ${
                              employee.status === "Available"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {employee.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  {days.map((day, colIdx) => {
                    const shift = getShiftForEmployeeAndDay(
                      employee.id,
                      day.short,
                      day?.fullDate as string
                    );
                    return (
                      <td
                        key={day.short}
                        className={`align-top border-b border-gray-200 px-2 py-2 sm:px-3 sm:py-3 min-w-[110px] ${
                          colIdx === days.length - 1 ? "" : "border-r"
                        }`}
                      >
                        {shift && shift.status !== "empty" ? (
                          <div
                            className={`rounded-lg p-2 sm:p-3 min-h-[90px] sm:min-h-[120px] flex flex-col justify-center items-center gap-1 shadow-xs
                                ${
                                  shift.status === "scheduled"
                                    ? "bg-indigo-100 border border-indigo-200"
                                    : shift.status === "unavailable"
                                    ? "bg-red-50 border border-red-200"
                                    : "bg-white border border-gray-200"
                                }
                              `}
                          >
                            <div className="space-y-1 sm:space-y-2 w-full">
                              {shift.title && (
                                <div className="text-xs sm:text-sm font-semibold text-indigo-900 truncate text-center">
                                  {shift.title}
                                </div>
                              )}
                              <div className="text-xs sm:text-sm text-gray-700 text-center">
                                {shift.time}
                              </div>
                              {shift.location && (
                                <div className="text-xs text-gray-500 break-words text-center">
                                  {shift.location}
                                </div>
                              )}
                              {shift.isOffDay && (
                                <div className="text-xs text-red-600 font-semibold text-center">
                                  Off Day
                                </div>
                              )}
                              {shift?.date && (
                                <div className="text-[10px] text-gray-400 text-center">
                                  {DateTime.fromISO(shift.date).toLocaleString(
                                    DateTime.DATE_MED
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg min-h-[90px] sm:min-h-[120px] flex items-center justify-center bg-gray-50">
                            <span className="text-xs text-gray-300">—</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
