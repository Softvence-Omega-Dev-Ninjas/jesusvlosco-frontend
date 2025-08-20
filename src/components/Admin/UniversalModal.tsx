// UniversalModal.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search } from "lucide-react";

// Assuming these interfaces are defined either here or imported from a shared types file
interface Survey {
  id: string;
  title: string;
  createdBY: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending";
  assignTo: string;
  description: string;
  surveyType: string;
  publishTime: string;
  createdAt: string;
}

interface ColumnOption {
  id: string;
  label: string;
  isVisible: boolean;
}

type ModalPosition = { x: number; y: number };

// Interfaces for Calendar Date Picker (unchanged)
type DatePart = string;
interface CalendarDate {
  day: DatePart;
  month: DatePart;
  year: DatePart;
}

// NEW: Interface for Team Member
interface TeamMember {
  id: string;
  name: string;
  email: string;
}

// NEW: Interface for Team Data
interface TeamData {
  teamName: string;
  members: TeamMember[];
}

interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: "filter" | "calendar" | "columns" | "quickView" | "teamMembers"; // Added "teamMembers"
  // Props specific to filter modal
  filterOptions?: string[];
  selectedFilters?: string[];
  onFilterChange?: (filter: string) => void;
  // Props specific to calendar modal
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  fromInitialDate?: CalendarDate;
  toInitialDate?: CalendarDate;
  // Props specific to columns modal
  columnOptions?: ColumnOption[];
  onColumnToggle?: (columnId: string) => void;
  // Props specific to quick view modal
  surveyData?: Survey | null;
  // NEW: Props specific to team members modal
  teamData?: TeamData | null;
  initialPosition?: ModalPosition;
}

const UniversalModal: React.FC<UniversalModalProps> = ({
  isOpen,
  onClose,
  modalType,
  selectedFilters,
  onFilterChange,
  selectedDate,
  // onDateChange,
  fromInitialDate,
  toInitialDate,
  columnOptions,
  onColumnToggle,
  surveyData,
  teamData, // Destructure new prop
  initialPosition,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<ModalPosition>(
    initialPosition || { x: 0, y: 0 }
  );
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Calendar related states (unchanged)
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

  const parseDateStringToCalendarDate = (dateString?: string): CalendarDate => {
    if (dateString) {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parts[2];
        return {
          day: day,
          month: monthNames[monthNum],
          year: year,
        };
      }
    }
    const today = new Date();
    return {
      day: String(today.getDate()).padStart(2, "0"),
      month: monthNames[today.getMonth()],
      year: String(today.getFullYear()),
    };
  };

  const initialFrom =
    fromInitialDate ||
    (selectedDate
      ? parseDateStringToCalendarDate(selectedDate.split(" to ")[0])
      : undefined);
  const initialTo =
    toInitialDate ||
    (selectedDate
      ? parseDateStringToCalendarDate(selectedDate.split(" to ")[1])
      : undefined);

  const [fromDate, setFromDate] = useState<CalendarDate>(
    initialFrom || parseDateStringToCalendarDate()
  );
  const [toDate, setToDate] = useState<CalendarDate>(
    initialTo || parseDateStringToCalendarDate()
  );

  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(
    null
  );
  // End Calendar related states

  // API data for filters (unchanged)
  const [apiFilterOptions, setApiFilterOptions] = useState<string[]>([]);
  const [loadingFilters] = useState(false);
  const [filterError] = useState<string | null>(null);

  const centerModal = () => {
    if (modalRef.current) {
      const modalRect = modalRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth / 2 - modalRect.width / 2,
        y: window.innerHeight / 2 - modalRect.height / 2,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialPosition) {
        setPosition(initialPosition);
      } else {
        centerModal();
      }
      // Re-initialize dates when modal opens if initial dates are provided or selectedDate changes
      if (fromInitialDate) setFromDate(fromInitialDate);
      if (toInitialDate) setToDate(toInitialDate);
      // If selectedDate is passed, attempt to parse and set from/to
      if (selectedDate) {
        const parts = selectedDate.split(" to ");
        if (parts.length === 2) {
          setFromDate(parseDateStringToCalendarDate(parts[0]));
          setToDate(parseDateStringToCalendarDate(parts[1]));
        } else {
          // Handle single date or invalid format, default to current date
          setFromDate(parseDateStringToCalendarDate(selectedDate));
          setToDate(parseDateStringToCalendarDate(selectedDate));
        }
      }

      // API call for filters
      if (modalType === "filter") {
        // const fetchFilterData = async () => {
        //   setLoadingFilters(true);
        //   setFilterError(null);
        //   try {
        //     // Replace with your actual API endpoint if needed
        //     const response = await fetch('/api/filters'); // Example API endpoint
        //     if (!response.ok) {
        //       throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     const data: string[] = await response.json();
        //     setApiFilterOptions(data);
        //   } catch (error: any) {
        //     console.error("Failed to fetch filter options:", error);
        //     setFilterError(`Failed to load filters: ${error.message}`);
        //   } finally {
        //     setLoadingFilters(false);
        //   }
        // };
        // This is a placeholder. In a real app, you'd fetch from an API.
        // For now, hardcode some filter options:
        setApiFilterOptions(["All", "Active", "Completed"]); //
      }
    }
  }, [
    isOpen,
    initialPosition,
    fromInitialDate,
    toInitialDate,
    selectedDate,
    modalType,
  ]); //

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Add 'SELECT' to prevent dragging when clicking on dropdowns
    if (
      target.tagName === "INPUT" ||
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.tagName === "SELECT" ||
      target.closest(".no-drag")
    ) {
      return;
    }
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "ACTIVE":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Completed":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "Pending":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getModalWidthClass = () => {
    switch (modalType) {
      case "filter":
        return "w-48";
      case "calendar":
        return "w-[36rem]";
      case "columns":
        return "w-64";
      case "quickView":
        return "w-[24rem]";
      case "teamMembers": // NEW: Width for team members modal
        return "w-[24rem]"; // Adjust width as per design
      default:
        return "w-64";
    }
  };

  // Calendar Helper Functions (unchanged)
  const monthNameToNumber = (monthName: string): number => {
    return monthNames.indexOf(monthName);
  };

  const calendarDateToDate = (calDate: CalendarDate): Date => {
    const monthNum = monthNameToNumber(calDate.month);
    return new Date(parseInt(calDate.year), monthNum, parseInt(calDate.day));
  };

  const isDateInRange = (day: number): boolean => {
    const currentMonthNum = monthNameToNumber(fromDate.month);
    const currentYearNum = parseInt(fromDate.year);
    const dateToCheck = new Date(currentYearNum, currentMonthNum, day);

    const startDate = calendarDateToDate(fromDate);
    const endDate = calendarDateToDate(toDate);

    const [effectiveStartDate, effectiveEndDate] =
      startDate.getTime() <= endDate.getTime()
        ? [startDate, endDate]
        : [endDate, startDate];

    return dateToCheck >= effectiveStartDate && dateToCheck <= effectiveEndDate;
  };

  const onCalendarDayClick = (day: number) => {
    const newDay = String(day).padStart(2, "0");
    const clickedDate = new Date(
      parseInt(fromDate.year),
      monthNameToNumber(fromDate.month),
      day
    );

    const currentFromDateObj = calendarDateToDate(fromDate);
    const currentToDateObj = calendarDateToDate(toDate);

    if (
      selectedCalendarDay === null ||
      currentFromDateObj.getTime() === currentToDateObj.getTime()
    ) {
      setFromDate({ day: newDay, month: fromDate.month, year: fromDate.year });
      setToDate({ day: newDay, month: fromDate.month, year: fromDate.year });
      setSelectedCalendarDay(day);
    } else {
      if (clickedDate < currentFromDateObj) {
        setFromDate({
          day: newDay,
          month: fromDate.month,
          year: fromDate.year,
        });
      } else {
        setToDate({ day: newDay, month: fromDate.month, year: fromDate.year });
        setSelectedCalendarDay(null);
      }
    }
  };

  const timeRemaining = useMemo(() => {
    if (!surveyData?.publishTime) return null;

    const now = new Date();
    const end = new Date(surveyData.publishTime);

    if (isNaN(end.getTime())) return null;

    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return "Expired";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

    if (diffDays > 0) return `${diffDays} day(s) ${diffHours} hr`;
    if (diffHours > 0) return `${diffHours} hr ${diffMinutes} min`;
    return `${diffMinutes} min`;
  }, [surveyData]);
  // End Calendar Helper Functions

  const renderContent = () => {
    // Calendar related calculations (unchanged)
    const daysInMonth = (month: string, year: string): number => {
      const monthNum = monthNames.indexOf(month);
      return new Date(parseInt(year), monthNum + 1, 0).getDate();
    };

    const firstDayOfMonth = new Date(
      parseInt(fromDate.year),
      monthNames.indexOf(fromDate.month),
      1
    ).getDay();

    const prevMonthDate = new Date(
      parseInt(fromDate.year),
      monthNames.indexOf(fromDate.month),
      0
    );
    const daysInPrevMonth = prevMonthDate.getDate();

    const calendarDays: (number | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.unshift(daysInPrevMonth - i);
    }

    for (let i = 1; i <= daysInMonth(fromDate.month, fromDate.year); i++) {
      calendarDays.push(i);
    }

    const remainingCells = 42 - calendarDays.length;
    for (let i = 1; i <= remainingCells; i++) {
      calendarDays.push(i);
    }

    switch (modalType) {
      case "calendar":
        return (
          <>
            <div
              className="py-2 px-3 font-semibold text-gray-700  flex items-center justify-between"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <span>Select Date Range</span>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="flex items-center space-x-2 no-drag">
                  <div className="text-xl font-medium text-[#4F46E5]">From</div>
                  <select
                    className="px-2 py-2 border rounded-md text-sm cursor-pointer"
                    value={fromDate.day}
                    onChange={(e) =>
                      setFromDate({ ...fromDate, day: e.target.value })
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-2 py-2 border rounded-md text-sm cursor-pointer"
                    value={fromDate.month}
                    onChange={(e) =>
                      setFromDate({ ...fromDate, month: e.target.value })
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {monthNames.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-2 py-2 border rounded-md text-sm cursor-pointer"
                    value={fromDate.year}
                    onChange={(e) =>
                      setFromDate({ ...fromDate, year: e.target.value })
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={2020 + i} value={String(2020 + i)}>
                        {2020 + i}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2 no-drag">
                  <div className="text-xl font-medium text-[#4F46E5]">To</div>
                  <select
                    className="px-2 py-2 border rounded-md text-sm cursor-pointer"
                    value={toDate.day}
                    onChange={(e) =>
                      setToDate({ ...toDate, day: e.target.value })
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-2 py-2 border rounded-md text-sm cursor-pointer"
                    value={toDate.month}
                    onChange={(e) =>
                      setToDate({ ...toDate, month: e.target.value })
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {monthNames.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="px-2 py-2 border rounded-md text-sm cursor-pointer"
                    value={toDate.year}
                    onChange={(e) =>
                      setToDate({ ...toDate, year: e.target.value })
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={2020 + i} value={String(2020 + i)}>
                        {2020 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 px-2">
                <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 font-medium mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2 text-center">
                  {calendarDays.map((day, index) => {
                    const isPreviousMonthDay = index < firstDayOfMonth;
                    const isNextMonthDay =
                      index >=
                      firstDayOfMonth +
                        daysInMonth(fromDate.month, fromDate.year);

                    const isSelected = day !== null && isDateInRange(day);

                    return (
                      <div
                        key={index}
                        onClick={() => day !== null && onCalendarDayClick(day)}
                        className={`text-sm rounded-md w-9 h-9 flex items-center justify-center ${
                          day === null || isPreviousMonthDay || isNextMonthDay
                            ? "text-gray-400 cursor-not-allowed"
                            : "cursor-pointer"
                        } ${
                          isSelected
                            ? "bg-[#FFBA5C] text-black font-medium"
                            : isPreviousMonthDay || isNextMonthDay
                            ? "text-gray-400"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {day !== null ? String(day).padStart(2, "0") : ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        );
      case "filter":
        return (
          <>
            <div
              className="py-2 px-3 font-semibold text-gray-700 flex items-center"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <span>Filter Options</span>
            </div>
            <div className="p-4">
              {loadingFilters && (
                <div className="text-gray-500">Loading filters...</div>
              )}
              {filterError && <div className="text-red-500">{filterError}</div>}
              {!loadingFilters &&
                !filterError &&
                apiFilterOptions.length === 0 && (
                  <div className="text-gray-500">No filters available.</div>
                )}
              {!loadingFilters &&
                !filterError &&
                apiFilterOptions.length > 0 &&
                apiFilterOptions.map((filter: string) => (
                  <label
                    key={filter}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
                      checked={selectedFilters?.includes(filter)}
                      onChange={() => onFilterChange && onFilterChange(filter)}
                    />
                    <span className="ml-2 text-gray-700">{filter}</span>
                  </label>
                ))}
            </div>
          </>
        );
      case "columns":
        return (
          <>
            <div
              className="py-2 px-3 font-semibold text-gray-700 border-b border-gray-200"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <div className="relative flex items-center no-drag">
                <Search
                  size={16}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search members"
                  className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded-md"
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {columnOptions
                ?.filter((col) => col.id !== "checkbox" && col.id !== "action")
                .map((column) => (
                  <label
                    key={column.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary rounded border-gray-300"
                      checked={column.isVisible}
                      onChange={() =>
                        onColumnToggle && onColumnToggle(column.id)
                      }
                    />
                    <span className="ml-2 text-gray-700">{column.label}</span>
                  </label>
                ))}
            </div>
            <div className="p-3 border-t border-gray-200">
              <button
                className="w-full bg-primary text-white py-1.5 rounded-md text-sm"
                onClick={onClose}
              >
                Apply
              </button>
            </div>
          </>
        );
      case "quickView":
        if (!surveyData)
          return (
            <div className="p-4 text-red-500">No survey data available.</div>
          );
        return (
          <div>
            <div
              className="py-2 px-3 font-semibold text-gray-700  flex items-center justify-center"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              Survey Quick View
            </div>
            <div className="p-4 text-sm text-gray-700">
              <p className="mb-2">
                <strong>Title:</strong> {surveyData.title}
              </p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span className={`${getStatusBadge(surveyData.status)}`}>
                  {surveyData.status}
                </span>
              </p>
              <p className="mb-2">
                <strong>Duration:</strong>{" "}
                {new Date(surveyData.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(surveyData.publishTime).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {/* <p className="mb-2">
                <strong>Duration:</strong> {surveyData.startDate} -{" "}
                {surveyData.endDate?.replace("04/20/2025", "May 15,2025")}
              </p> */}
              {/* <p className="mb-2">
                <strong>Top Departments by response rate:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Sales (40%)</li>
                <li>HR (30%)</li>
                <li>IT (20%)</li>
              </ul> */}

              <p className="mt-2 mb-2">
                <strong>Creator:</strong> {surveyData.createdBY}
              </p>
              <p className="mb-2">
                <strong>Category:</strong> {surveyData.surveyType}
              </p>
              <div>
                <p className="mb-2">
                  <strong>Time remaining:</strong> {timeRemaining ?? "N/A"}
                </p>
              </div>
              <p className="mt-4">
                <strong>Description:</strong>{" "}
                {/* This survey gathers feedback on
                employee satisfaction and workplace environment. */}
                {surveyData.description}
              </p>
            </div>
            <div className="p-3 border-t border-gray-200 flex justify-center gap-2">
              {/* <Link to={"/admin/survey-details"}>
               <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
                View detail
              </button>
              </Link> */}

              <button
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer "
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        );
      case "teamMembers": // NEW: Case for "teamMembers" modal
        if (!teamData)
          return (
            <div className="p-4 text-red-500">No team data available.</div>
          );
        return (
          <>
            <div
              className="py-2 px-3 font-semibold text-gray-700 flex items-center justify-between"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <span> {teamData.teamName}</span>
              <button
                className="text-gray-500 hover:text-gray-700 no-drag"
                onClick={onClose}
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              {teamData.members.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {" "}
                  {/* Use grid for the team members as per screenshot */}
                  {teamData.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium text-center" // Styled like the "Team A" button
                    >
                      {member.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No members in this team.</p>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={modalRef}
      className={`fixed z-50 bg-white rounded-md shadow-lg py-1 ${getModalWidthClass()}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {renderContent()}
    </div>
  );
};

export default UniversalModal;
