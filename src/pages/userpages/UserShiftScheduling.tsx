
import { useRef, useState, useEffect } from "react";
import EmployeeCard from "@/components/UserDashoboard/EmployeeCard";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  SearchIcon,
  X,
} from "lucide-react";
import AddUnavailabilityModal from "@/components/ShiftScheduling/AddUnavailabilityModal";
import VisibilityToggle from "@/components/ShiftScheduling/VisibilityToggle";

interface Employee {
  id: string;
  name: string;
  role: string;
  status: "Available" | "Busy";
  offDay: string;
  avatar: string;
}

export default function UserShiftScheduling() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showAddUnavailability, setShowAddUnavailability] = useState(false);
  const [showVisibilityToggle, setShowVisibilityToggle] = useState(false);
  const [exportScope, setExportScope] = useState<"everyone" | "only-me">("everyone");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const days = [
    { short: "Mon", date: "6/9" },
    { short: "Tue", date: "6/10" },
    { short: "Wed", date: "6/11" },
    { short: "Thu", date: "6/12" },
    { short: "Fri", date: "6/13" },
    { short: "Sat", date: "6/14" },
    { short: "Sun", date: "6/15" },
  ];

  const employees: Employee[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Manager",
      status: "Available",
      offDay: "Friday",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Emma Willson",
      role: "Associate",
      status: "Available",
      offDay: "Friday",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Sarah Johnson",
      role: "Supervisor",
      status: "Busy",
      offDay: "Friday",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Emma Willson",
      role: "Associate",
      status: "Available",
      offDay: "Friday",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "John Smith",
      role: "Supervisor",
      status: "Busy",
      offDay: "Monday",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "6",
      name: "Lisa Chen",
      role: "Associate",
      status: "Busy",
      offDay: "Wednesday",
      avatar: "/placeholder.svg?height=64&width=64",
    },
  ];

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowVisibilityToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getShiftForEmployeeAndDay = (employeeId: string, day: string) => {
    return shifts.find(
      (shift) => shift.employeeId === employeeId && shift.day === day
    );
  };

  const handleEmployeeClick = (employeeId: string) => {
    if (selectedEmployee === employeeId) {
      setSelectedEmployee(null);
    } else {
      setSelectedEmployee(employeeId);
    }
  };

  const handleExportScopeChange = (scope: "everyone" | "only-me") => {
    setExportScope(scope);
    setShowVisibilityToggle(false);
    triggerExport(scope);
  };

  const triggerExport = (scope: "everyone" | "only-me") => {
    // Here you would implement the actual export functionality
    console.log(`Exporting schedule for ${scope}`);
    // For demonstration, we'll just show an alert
    alert(`Exporting schedule for ${scope === "everyone" ? "Everyone" : "Only me"}`);
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (selectedEmployee) {
      if (a.id === selectedEmployee) return -1;
      if (b.id === selectedEmployee) return 1;
    }
    return 0;
  });

  return (
    <div className="py-3 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-primary">
          Shift Scheduling Project 1
        </h3>

        <div className="relative inline-block">
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-6 sm:mt-10 gap-3 sm:gap-5">
        {/* left side */}
        <div className="py-3 sm:py-5 w-full lg:max-w-[23%]">
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-between gap-3 sm:gap-5 lg:gap-3 xl:gap-5">
            <button className="flex gap-1 items-center justify-center border px-3 sm:px-4 py-2 sm:p-3 border-primary text-primary rounded-2xl text-sm sm:text-base">
              Everyone <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="flex gap-1 items-center justify-center border px-3 sm:px-4 py-2 sm:p-3 border-primary text-primary rounded-2xl text-sm sm:text-base">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Jul 28- Aug 3</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <div className="relative flex items-center mt-4 sm:mt-6">
            <input
              type="text"
              name="search"
              placeholder="Search"
              className="bg-gray-100 w-full p-2 pl-4 rounded-lg pr-5 text-sm sm:text-base"
            />
            <SearchIcon className="absolute  lg:-mt-4 right-3 translate-y-1/2 size-4 sm:size-5 text-gray-400" />
          </div>

          <div className="space-y-3 sm:space-y-5 mt-4 sm:mt-5">
            {employees
              .filter(employee => !selectedEmployee || employee.id === selectedEmployee)
              .map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee.id)}
                  className={`cursor-pointer transition-all ${selectedEmployee === employee.id ? 'ring-2 ring-primary rounded-lg' : ''}`}
                >
                  <EmployeeCard
                    name={employee.name}
                    role={employee.role}
                    status={employee.status}
                    offDay={employee.offDay}
                    avatar={employee.avatar}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="border mt-auto rounded-2xl border-gray-200 p-3 sm:p-5 flex-1 overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-primary">
              Weekly Schedule
            </h3>
            <button
              onClick={() => setShowAddUnavailability(true)}
              className="border rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 border-primary text-primary"
            >
              My Availability
            </button>

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
              <table className="w-full min-w-[700px] sm:min-w-full">
                <thead>
                  <tr>
                    {days.map((day) => (
                      <th
                        key={day.short}
                        className="p-2 sm:p-4 text-center font-medium text-gray-900 min-w-24 sm:min-w-32"
                      >
                        <div className="text-xs sm:text-sm">
                          {day.short} {day.date}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedEmployees
                    .filter(employee => !selectedEmployee || employee.id === selectedEmployee)
                    .map((employee) => (
                      <tr key={employee.id}>
                        {days.map((day) => {
                          const shift = getShiftForEmployeeAndDay(
                            employee.id,
                            day.short
                          );
                          return (
                            <td key={day.short}>
                              {shift && shift.status !== "empty" ? (
                                <div
                                  className={`rounded-lg mb-3 sm:mb-5 mr-2 sm:mr-3 p-2 sm:p-3 min-h-[100px] sm:min-h-[140px] ${shift.status === "scheduled"
                                    ? "bg-indigo-100 border border-indigo-200"
                                    : shift.status === "unavailable"
                                      ? "bg-red-100 border border-red-200"
                                      : "bg-white border border-gray-200"
                                    }`}
                                >
                                  <div
                                    className={`text-xs mb-1 ${shift.status === "scheduled"
                                      ? "text-indigo-800"
                                      : shift.status === "unavailable"
                                        ? "text-red-800"
                                        : "text-gray-800"
                                      }`}
                                  >
                                    {shift.time}
                                  </div>
                                  {shift.location && (
                                    <div
                                      className={`text-xs mb-1 sm:mb-2 ${shift.status === "scheduled"
                                        ? "text-indigo-600"
                                        : shift.status === "unavailable"
                                          ? "text-red-600"
                                          : "text-gray-600"
                                        }`}
                                    >
                                      {shift.location}
                                    </div>
                                  )}
                                  {shift.status === "scheduled" &&
                                    shift.tasksDone && (
                                      <div className="flex items-center text-xs text-indigo-600">
                                        <svg
                                          className="w-3 h-3 mr-1"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        Tasks Done
                                      </div>
                                    )}
                                  {shift.status === "unavailable" && (
                                    <div className="text-xs font-medium text-red-600">
                                      Unavailable
                                    </div>
                                  )}
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
    </div>
  );
}

interface Shift {
  id: string;
  employeeId: string;
  day: string;
  time: string;
  location: string;
  status: "scheduled" | "available" | "unavailable" | "empty";
  tasksDone?: boolean;
}

const shifts: Shift[] = [
  // Sarah Johnson (Manager) - Row 1
  {
    id: "s1",
    employeeId: "1",
    day: "Mon",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "available",
  },
  {
    id: "s2",
    employeeId: "1",
    day: "Tue",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s3",
    employeeId: "1",
    day: "Wed",
    time: "9:00am - 5:00pm",
    location: "",
    status: "unavailable",
  },
  {
    id: "s4",
    employeeId: "1",
    day: "Thu",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s5",
    employeeId: "1",
    day: "Fri",
    time: "",
    location: "",
    status: "empty",
  },
  {
    id: "s6",
    employeeId: "1",
    day: "Sat",
    time: "",
    location: "",
    status: "empty",
  },
  {
    id: "s7",
    employeeId: "1",
    day: "Sun",
    time: "",
    location: "",
    status: "empty",
  },

  // Emma Willson (Associate) - Row 2
  {
    id: "s8",
    employeeId: "2",
    day: "Mon",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "available",
  },
  {
    id: "s9",
    employeeId: "2",
    day: "Tue",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s10",
    employeeId: "2",
    day: "Wed",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s11",
    employeeId: "2",
    day: "Thu",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s12",
    employeeId: "2",
    day: "Fri",
    time: "9:00am - 5:00pm",
    location: "",
    status: "unavailable",
  },
  {
    id: "s13",
    employeeId: "2",
    day: "Sat",
    time: "",
    location: "",
    status: "empty",
  },
  {
    id: "s14",
    employeeId: "2",
    day: "Sun",
    time: "",
    location: "",
    status: "empty",
  },

  // Sarah Johnson (Supervisor) - Row 3
  {
    id: "s15",
    employeeId: "3",
    day: "Mon",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "available",
  },
  {
    id: "s16",
    employeeId: "3",
    day: "Tue",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s17",
    employeeId: "3",
    day: "Wed",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s18",
    employeeId: "3",
    day: "Thu",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s19",
    employeeId: "3",
    day: "Fri",
    time: "9:00am - 5:00pm",
    location: "",
    status: "unavailable",
  },
  {
    id: "s20",
    employeeId: "3",
    day: "Sat",
    time: "",
    location: "",
    status: "empty",
  },
  {
    id: "s21",
    employeeId: "3",
    day: "Sun",
    time: "",
    location: "",
    status: "empty",
  },

  // Emma Willson (Associate) - Row 4
  {
    id: "s22",
    employeeId: "4",
    day: "Mon",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "available",
  },
  {
    id: "s23",
    employeeId: "4",
    day: "Tue",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s24",
    employeeId: "4",
    day: "Wed",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s25",
    employeeId: "4",
    day: "Thu",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s26",
    employeeId: "4",
    day: "Fri",
    time: "9:00am - 5:00pm",
    location: "",
    status: "unavailable",
  },
  {
    id: "s27",
    employeeId: "4",
    day: "Sat",
    time: "",
    location: "",
    status: "empty",
  },
  {
    id: "s28",
    employeeId: "4",
    day: "Sun",
    time: "",
    location: "",
    status: "empty",
  },

  // John Smith (Supervisor) - Row 5
  {
    id: "s29",
    employeeId: "5",
    day: "Mon",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "available",
  },
  {
    id: "s30",
    employeeId: "5",
    day: "Tue",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s31",
    employeeId: "5",
    day: "Wed",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s32",
    employeeId: "5",
    day: "Thu",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s33",
    employeeId: "5",
    day: "Fri",
    time: "9:00am - 5:00pm",
    location: "",
    status: "unavailable",
  },
  {
    id: "s34",
    employeeId: "5",
    day: "Sat",
    time: "",
    location: "",
    status: "empty",
  },
  {
    id: "s35",
    employeeId: "5",
    day: "Sun",
    time: "",
    location: "",
    status: "empty",
  },

  // Lisa Chen (Associate) - Row 6
  {
    id: "s36",
    employeeId: "6",
    day: "Mon",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "available",
  },
  {
    id: "s37",
    employeeId: "6",
    day: "Tue",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s38",
    employeeId: "6",
    day: "Wed",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s39",
    employeeId: "6",
    day: "Thu",
    time: "9:00am - 5:00pm",
    location: "Parkside Retreat",
    status: "scheduled",
    tasksDone: true,
  },
  {
    id: "s40",
    employeeId: "6",
    day: "Fri",
    time: "9:00am - 5:00pm",
    location: "",
    status: "unavailable",
  },
  {
    id: "s41",
    employeeId: "6",
    day: "Sat",
    time: "",
    location: "",
    status: "empty",
  },
  {
    id: "s42",
    employeeId: "6",
    day: "Sun",
    time: "",
    location: "",
    status: "empty",
  },
];