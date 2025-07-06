import EmployeeCard from "@/components/UserDashoboard/EmployeeCard";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  SearchIcon,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  status: "Available" | "Busy";
  offDay: string;
  avatar: string;
}

export default function UserShiftScheduling() {
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
      status: "Unavailable",
      offDay: "Wednesday",
      avatar: "/placeholder.svg?height=64&width=64",
    },
  ];

  const getShiftForEmployeeAndDay = (employeeId: string, day: string) => {
    return shifts.find(
      (shift) => shift.employeeId === employeeId && shift.day === day
    );
  };

  return (
    <div className="py-3">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-primary">
          Shift Scheduling Project 1
        </h3>
        <button className="flex gap-2 items-center border rounded-lg px-4 p-3 border-primary text-primary">
          <Download />
          Export
        </button>
      </div>

      <div className="flex mt-10 gap-5">
        {/* left side */}
        <div className="py-5 max-w-[23%]">
          <div className="flex justify-between gap-10">
            <button className="flex gap-1 items-center border px-4 p-3 border-primary text-primary rounded-2xl">
              Everyone <ChevronDown />
            </button>
            <button className="flex gap-1 items-center border px-4 p-3 border-primary text-primary rounded-2xl">
              <ChevronLeft /> Jul 28- Aug 3 <ChevronRight />
            </button>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              name="search"
              placeholder="Search"
              className="bg-gray-100 w-full p-2 pl-4 rounded-lg mt-6 pr-5"
            />
            <SearchIcon className="absolute right-3 translate-y-1/2 size-5 text-gray-400" />
          </div>

          <div className="space-y-5 mt-5">
            <EmployeeCard
              name="Sarah Johnson"
              role="Manager"
              status="Available"
              offDay="Friday"
              avatar="https://i.pravatar.cc"
            />
            <EmployeeCard
              name="Sarah Johnson"
              role="Manager"
              status="Available"
              offDay="Friday"
              avatar="https://i.pravatar.cc"
            />
            <EmployeeCard
              name="Sarah Johnson"
              role="Manager"
              status="Available"
              offDay="Friday"
              avatar="https://i.pravatar.cc"
            />
            <EmployeeCard
              name="Sarah Johnson"
              role="Manager"
              status="Available"
              offDay="Friday"
              avatar="https://i.pravatar.cc"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="border rounded-2xl border-gray-200 p-5 flex-1">
          <h3 className="text-lg font-semibold text-primary">
            Weekly Schedule
          </h3>
          <div className="text-right mt-0">
            <button className="border rounded-full text-sm px-4 p-2 border-primary text-primary">
              Availability
            </button>
          </div>

          {/* Schedule Grid */}
          <div className="bg-white overflow-hidden w-full mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="">
                    {days.map((day) => (
                      <th
                        key={day.short}
                        className="p-4 text-center font-medium text-gray-900 min-w-32"
                      >
                        <div className="text-sm">
                          {day.short} {day.date}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, employeeIndex) => (
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
                                className={`rounded-lg mb-5 mr-3 p-3 min-h-[140px] ${
                                  shift.status === "scheduled"
                                    ? "bg-indigo-100 border border-indigo-200"
                                    : shift.status === "unavailable"
                                    ? "bg-red-100 border border-red-200"
                                    : "bg-white border border-gray-200"
                                }`}
                              >
                                <div
                                  className={`text-xs font-medium mb-1 ${
                                    shift.status === "scheduled"
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
                                    className={`text-xs mb-2 ${
                                      shift.status === "scheduled"
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
                              <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[140px] -mt-5 mr-3 flex items-center justify-center">
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
