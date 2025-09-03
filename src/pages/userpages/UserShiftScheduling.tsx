import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import AddUnavailabilityModal from "@/components/ShiftScheduling/AddUnavailabilityModal";
// import VisibilityToggle from "@/components/ShiftScheduling/VisibilityToggle";
import { useParams } from "react-router-dom";
// import { formatTimeFromISO } from "@/utils/formatDateToMDY";
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
  const [showAddUnavailability, setShowAddUnavailability] = useState(false);
  // const [showVisibilityToggle, setShowVisibilityToggle] = useState(false);
  // const [exportScope, setExportScope] = useState<"everyone" | "only-me">(
  //   "everyone"
  // );
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

  // const handleExportScopeChange = (scope: "everyone" | "only-me") => {
  //   setExportScope(scope);
  //   setShowVisibilityToggle(false);
  //   triggerExport(scope);
  // };

  // const triggerExport = (scope: "everyone" | "only-me") => {
  //   // Here you would implement the actual export functionality
  //   console.log(`Exporting schedule for ${scope}`);
  //   // For demonstration, we'll just show an alert
  //   alert(
  //     `Exporting schedule for ${scope === "everyone" ? "Everyone" : "Only me"}`
  //   );
  // };

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
        {/* <div className="relative inline-block">
          <button
            ref={buttonRef}
            onClick={() => setShowVisibilityToggle(!showVisibilityToggle)}
            className="flex gap-2 items-center border rounded-lg px-3 sm:px-4 py-2 sm:p-3 border-primary text-primary text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Export
          </button>

          {showVisibilityToggle && (
            <div
              ref={popupRef}
              className="absolute z-50 right-0 sm:right-auto lg:right-0 left-0 sm:left-auto top-full mt-2 sm:mt-3"
            >
              <div className="relative bg-white shadow-lg rounded-lg w-[280px] sm:w-[320px] border border-gray-200 p-4">
                <VisibilityToggle
                  selected={exportScope}
                  onSelect={handleExportScopeChange}
                />
              </div>
            </div>
          )}
        </div> */}

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
      <div className="border mt-6 sm:mt-10 rounded-2xl border-gray-200 p-3 sm:p-5 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-primary">
            Current Weekly Schedule
          </h3>

          {showAddUnavailability && (
            <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowAddUnavailability(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <AddUnavailabilityModal
                  isOpen={showAddUnavailability}
                  onClose={() => setShowAddUnavailability(false)}
                  onSubmit={() => setShowAddUnavailability(false)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Schedule Grid */}
        <div className="bg-white overflow-hidden w-full mt-3 sm:mt-4 lg:mt-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] sm:min-w-full">
              <thead>
                <tr>
                  <th className="p-2 sm:p-4 text-center font-medium text-gray-900 min-w-[180px]">
                    <div className="text-xs sm:text-sm">Team Member</div>
                  </th>
                  {days.map((day) => (
                    <th
                      key={day.short}
                      className="p-2 sm:p-4 text-center font-medium text-gray-900 min-w-24 sm:min-w-32"
                    >
                      <div className="text-xs sm:text-sm">
                        {day.day} {day.date}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="p-2 sm:p-4 min-w-[180px] border-b-2 border-gray-200">
                      <div className="flex items-start justify-start">
                        <div className="flex  items-center space-x-3">
                          <img
                            src={
                              employee.avatar ||
                              "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(employee.name)
                            }
                            alt={employee.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex flex-col gap-2 justify-start text-start">
                            <div className="text-sm font-medium text-gray-900 truncate">
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
                    {days.map((day) => {
                      const shift = getShiftForEmployeeAndDay(
                        employee.id,
                        day.short,
                        day?.fullDate as string
                      );
                      return (
                        <td key={day.short}>
                          {shift && shift.status !== "empty" ? (
                            <div
                              className={`rounded-lg mb-3 sm:mb-5 mr-2 sm:mr-3 p-2 sm:p-3 min-h-[100px] sm:min-h-[140px] ${
                                shift.status === "scheduled"
                                  ? "bg-indigo-100 border border-indigo-200"
                                  : shift.status === "unavailable"
                                  ? "bg-red-100 border border-red-200"
                                  : "bg-white border border-gray-200"
                              }`}
                            >
                              <div className="space-y-1 sm:space-y-2">
                                {shift.title && (
                                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                                    {shift.title}
                                  </div>
                                )}
                                <div className="text-xs sm:text-sm text-gray-600">
                                  {shift.time}
                                </div>
                                {shift.location && (
                                  <div className="text-xs text-gray-500 break-words">
                                    {shift.location}
                                  </div>
                                )}
                                {shift.isOffDay && (
                                  <div className="text-xs text-red-600 font-medium">
                                    Off Day
                                  </div>
                                )}
                                {shift?.date && (
                                  <div className="text-xs text-gray-500">
                                    With:{" "}
                                    {new Date(shift.date).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[100px] sm:min-h-[140px] -mt-3 sm:-mt-5 mr-2 sm:mr-3 flex items-center justify-center">
                              <div className="text-xs text-gray-400"></div>
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
    </div>
  );
}
