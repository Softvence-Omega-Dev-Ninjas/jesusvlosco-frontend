import { useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineBell,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronUp,
} from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { useGetAllShiftsQuery } from "@/store/api/admin/shift-sheduling/CreateShiftApi";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { TUser } from "@/types/usertype";
import { formatTimeFromISO } from "@/utils/formatDateToMDY";

interface User {
  id: string;
  email: string;
  role?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
  };
}

interface ShiftData {
  id?: string;
  allDay: boolean;
  createdAt: string;
  date: string; // ISO format: "2025-08-12T08:00:00.000Z"
  endTime: string; // ISO format: "2025-08-12T16:00:00.000Z"
  job: string;
  location: string;
  note: string;
  shiftActivity: unknown[];
  shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
  shiftTask: unknown[];
  shiftTitle: string;
  startTime: string; // ISO format: "2025-08-12T08:00:00.000Z"
  updatedAt: string;
  users: Array<{
    createdAt: string;
    email: string;
    employeeId: string;
    id: string;
    isLogin: boolean;
    isVerified: boolean;
    lastLoginAt: string;
    otpExpiresAt: string | null;
    password: string;
    phone: string;
    pinCode: string;
    role: string;
    updatedAt: string;
    profile: {
      address: string;
      city: string;
      country: string;
      createdAt: string;
      department: string;
      dob: string;
      firstName: string;
      gender: string;
      id: string;
      jobTitle: string;
      lastName: string;
      nationality: string;
      profileUrl: string;
      updatedAt: string;
    };
  }>;
}

const WeeklyScheduleGrid = () => {
  // Note: We're fetching shift data directly from API instead of using props
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const getShifts = useGetAllShiftsQuery({});
  const users = useGetAllUserQuery({});
  const userList =
    users?.data?.data.filter((user: TUser) => user.role != "ADMIN") || [];
  console.log("getShifts.data:", getShifts.data);
  
  // Utility functions for handling ISO date formats
  const parseISODate = (isoString: string): Date | null => {
    try {
      const date = new Date(isoString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Format ISO datetime to time string in hh:mm AM/PM format, always padded

  const getDaysForWeek = (): {
    day: string;
    date: string;
    fullDate: Date;
  }[] => {
    const days = [];
    const startDate = new Date(currentDate);
    const dayOfWeek = startDate.getDay();
    const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      days.push({
        day: currentDay.toLocaleString("default", { weekday: "short" }),
        date: formatDate(currentDay),
        fullDate: new Date(currentDay),
      });
    }

    return days;
  };

  const formatDate = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatDateRange = (): string => {
    const startDate = new Date(currentDate);
    const dayOfWeek = startDate.getDay();
    const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startDate.setDate(diff);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return `${startDate.toLocaleString("default", {
      month: "short",
    })} ${startDate.getDate()} - ${endDate.toLocaleString("default", {
      month: "short",
    })} ${endDate.getDate()}`;
  };

  const changeWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "prev" ? -7 : 7));
    setCurrentDate(newDate);
  };

  // Get all shifts for a specific day (can return multiple shifts)
  const getShiftsForUserAndDay = (
    dayDate: Date,
    userId: string
  ): ShiftData[] => {
    // console.log(`\n--- Looking for shifts for user ${userId} on: ${dayDate.toDateString()} ---`);

    // Safety check: ensure data exists and is an array
    if (!getShifts.data || !Array.isArray(getShifts.data)) {
      // console.log('❌ No data available or not an array');
      return [];
    }

    const matchingShifts = getShifts.data.filter((shift: ShiftData) => {
      // Parse ISO format date (e.g., "2025-08-12T08:00:00.000Z")
      const shiftDate = parseISODate(shift.date);

      if (!shiftDate) {
        console.warn("❌ Invalid date format in shift:", shift.date);
        return false;
      }

      // Check if the date matches AND if the shift belongs to this user
      const isDateMatch = isSameDay(shiftDate, dayDate);
      const isUserMatch = shift.users.some((user) => user.id === userId);

      // if (isDateMatch && isUserMatch) {
      //     console.log('✅ USER SHIFT MATCH FOUND!', {
      //         userId,
      //         shiftDate: shift.date,
      //         shiftStatus: shift.shiftStatus,
      //         employee: shift.users?.[0]?.profile?.firstName || 'No name'
      //     });
      // }

      return isDateMatch && isUserMatch;
    });

    // console.log(`📊 Found ${matchingShifts.length} shifts for user ${userId} on ${dayDate.toDateString()}`);
    return matchingShifts;
  };
  const days = getDaysForWeek();

  // console.log('=== WEEK DAYS ===');
  // days.forEach((day, index) => {
  //     console.log(`Day ${index}: ${day.day} ${day.date} (${day.fullDate.toDateString()})`);
  // });

  return (
    <section className="w-full mb-12 bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm overflow-x-auto">
      {isTemplateOpen && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[320px] bg-white shadow-xl z-50 transition-transform border-l flex flex-col rounded-none sm:rounded-lg">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-gray-700">Shifts</h2>
            <button
              onClick={() => setIsTemplateOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <p className="text-sm text-gray-500 mb-2">
              Drag and drop to the schedule
            </p>
            <input
              type="text"
              placeholder="Search Templates"
              className="w-full border border-gray-300 px-3 py-2 rounded mb-4 text-sm"
            />
            <div className="space-y-3">
              <div className="bg-[rgba(78,83,177,1)] text-white p-3 rounded cursor-pointer">
                <p className="text-sm font-medium">9:00 am – 5:00 pm</p>
                <p className="text-xs">Morning Shift</p>
              </div>
              <div className="bg-[rgba(78,83,177,1)] text-white p-3 rounded cursor-pointer">
                <p className="text-sm font-medium">10:00 am – 6:00 pm</p>
                <p className="text-xs">Night Shift</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <button className="w-full border border-[rgba(78,83,177,1)] text-[rgba(78,83,177,1)] px-4 py-2 rounded hover:bg-indigo-50 text-sm">
              Add Template
            </button>
          </div>
        </div>
      )}

      <h1 className="text-[rgba(78,83,177,1)] mb-2 text-lg font-bold">
        Weekly Schedule
      </h1>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-3 min-w-[450px]">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center justify-center border-indigo-300 text-[rgba(78,83,177,1)] px-2 font-bold py-1.5 rounded-full">
            <img
              className="rounded-full border  px-2 font-bold py-1  mt-1"
              src="../src/assets/filter.png"
              alt=""
            />
          </button>
          <button className="flex items-center gap-1 text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50">
            Week <HiOutlineChevronDown className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-white border border-indigo-300 rounded-full px-1">
            <button
              className="text-sm text-[rgba(78,83,177,1)] p-1 rounded-full hover:bg-indigo-50"
              onClick={() => changeWeek("prev")}
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            <button className="text-sm text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50 whitespace-nowrap">
              {formatDateRange()}
            </button>
            <button
              className="text-sm text-[rgba(78,83,177,1)] p-1 rounded-full hover:bg-indigo-50"
              onClick={() => changeWeek("next")}
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isTemplateOpen && (
            <div
              onClick={() => setIsTemplateOpen(true)}
              className="fixed top-120 right-0 h-34 w-4 sm:w-6 md:w-8 lg:w-8 bg-[rgba(78,83,177,1)] text-white text-[20px] font-semibold flex items-center justify-center cursor-pointer rounded-l-md z-50"
            >
              <span className="transform -rotate-90 whitespace-nowrap">
                Templates
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1">
            Actions <HiOutlineChevronUp className="w-4 h-4 " />
          </button>
          <button className="text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1">
            Add <HiOutlineChevronUp className="w-4 h-4" />
          </button>
          <button className="text-sm bg-[rgba(78,83,177,1)] text-white px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-indigo-800">
            Publish <HiOutlineBell className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="min-w-max mt-6">
        {/* Header row with day names */}
        <div className="grid grid-cols-7 gap-2 text-sm font-medium text-[rgba(78,83,177,1)] mb-2">
          {/* Day columns */}
          {days.map((day, i) => (
            <div key={i} className="text-center whitespace-nowrap">
              {day.day} {day.date}
            </div>
          ))}
        </div>

        {/* Multiple rows - one for each user */}
        <div className="space-y-2">
          {userList.map((user: User, rowIdx: number) => (
            <div key={user.id || rowIdx} className="grid grid-cols-7 gap-2">
              {/* 7 day columns for this user */}
              {days.map((day, colIdx) => {
                const shiftsForUserAndDay = getShiftsForUserAndDay(
                  day.fullDate,
                  user.id
                );
                // Get only the last shift if multiple shifts exist for this user on this day
                const lastShift =
                  shiftsForUserAndDay.length > 0
                    ? shiftsForUserAndDay[shiftsForUserAndDay.length - 1]
                    : null;
                return (
                  <div key={`${rowIdx}-${colIdx}`} className="space-y-2">
                    {lastShift ? (
                      <div
                        className={`min-h-[100px] lg:w-40 lg:h-32.5 rounded-md p-2 transition-all relative flex flex-col justify-center items-center gap-2 ${
                          lastShift.shiftStatus === "PUBLISHED"
                            ? "bg-indigo-200 border border-[rgba(78,83,177,1)]"
                            : "bg-white border-2 border-indigo-400"
                        }`}
                      >
                        <p className="text-sm text-center font-medium">
                          {user.profile?.firstName ||
                            user.email?.split("@")[0] ||
                            "Unknown"}
                        </p>
                        <p className="text-xs mt-2 px-1 font-medium text-indigo-800 mb-2 text-center">
                          {formatTimeFromISO(lastShift.startTime)} -{" "}
                          {formatTimeFromISO(lastShift.endTime)}
                        </p>

                        <p className="text-sm text-center font-semibold text-purple-800">
                          {lastShift.shiftTitle}
                        </p>
                      </div>
                    ) : (
                      /* Empty cell with consistent styling */
                      <div className="min-h-[100px] lg:w-40 lg:h-32.5 rounded-md p-2 border border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
                        <CiCirclePlus className="text-2xl text-gray-400 hover:text-gray-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyScheduleGrid;
