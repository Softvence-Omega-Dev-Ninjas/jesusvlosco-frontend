// src/components/UserDetails/TimesheetHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, Plus, X, Search, Calendar, ChevronDown } from "lucide-react";

import robertFoxAvatar from "../../assets/user2.png";
import estherHowardAvatar from "../../assets/user3.png"; // Assuming you have this avatar

// --- ProjectDropdown Component (Moved Inline) ---
interface ProjectDropdownProps {
  options: string[];
  initialValue?: string;
  onSelect: (value: string) => void;
  label?: string;
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  options,
  initialValue,
  onSelect,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialValue || "");
  const [selectedValue, setSelectedValue] = useState(initialValue || "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setSearchTerm(option);
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    inputRef.current?.select();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label htmlFor="project-search-input" className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id="project-search-input"
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search projects..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
          <ul className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedValue === option ? "bg-gray-50 text-indigo-600" : "text-gray-700"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No projects found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- Add Shift Modal Component (Moved Inline) ---
const AddShiftModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const projectOptions = [
    "Metro Shopping Center",
    "Riverside Apartments",
    "City Bridge Renovations",
    "Tech Campus Phase 2",
    "Summit Plaza Offices",
    "Innovation Hub Tower",
    "The Commerce Hub",
  ];

  const [selectedProject, setSelectedProject] = useState(projectOptions[0]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 left-2/3 -right-32">
      <div className="absolute inset-0  bg-opacity-50 z-40" onClick={onClose}></div>

      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative z-50 mx-4 sm:mx-0">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Shift</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 flex flex-col">
            <ProjectDropdown
              label="Project"
              options={projectOptions}
              initialValue={selectedProject}
              onSelect={setSelectedProject}
            />

            <div className="mt-4">
              <label htmlFor="starts-date" className="block text-sm font-medium text-gray-700 mb-1">Starts</label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="date"
                  id="starts-date"
                  defaultValue="2025-06-19"
                  className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <span className="text-gray-700 sm:w-auto">At:</span>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full sm:w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="ends-date" className="block text-sm font-medium text-gray-700 mb-1">Ends</label>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="date"
                  id="ends-date"
                  defaultValue="2025-06-21"
                  className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <span className="text-gray-700 sm:w-auto">At:</span>
                <input
                  type="time"
                  defaultValue="05:00"
                  className="w-full sm:w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col items-center justify-center bg-purple-100 p-3  h-28 rounded-md  self-stretch">
            <span className="text-sm text-purple-800 font-medium">Total hours</span>
            <span className="text-3xl font-bold text-purple-800">08:00</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 mt-4">Shift attachments</h3>
        <div className="mb-4">
          <textarea
            id="managerNote"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm resize-y min-h-[80px] focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add manager note"
          ></textarea>
        </div>

        <div className="mt-6 flex justify-start">
          <button className="px-6 py-2 bg-primary text-white  font-medium rounded-md  transition-colors shadow-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ShiftCalendarModal Component (Moved Inline) ---
const ShiftCalendarModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentDate] = useState(new Date(2025, 4, 1)); // Month is 0-indexed (4 = May)

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handleMonthYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected:", e.target.value);
  };

  const isSelectedDay = (day: number) => {
    return day === 22 && month === 4 && year === 2025;
  };

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-opacity-50 z-40" onClick={onClose}></div>

      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative z-50">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-2">Shift Calendar</h2>
        <p className="text-sm text-gray-500 mb-4">View and manage employee shifts for the month</p>

        <div className="flex items-center justify-between mb-4 space-x-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            Today
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
            Last 8 days
          </button>
          <div className="relative flex-grow">
             <select
              className="appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              defaultValue="Last month"
              onChange={handleMonthYearChange}
            >
              <option disabled>Last month</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              defaultValue="May 2025"
              onChange={handleMonthYearChange}
            >
              <option>2023</option>
              <option>2024</option>
              <option>May 2025</option>
              <option>2026</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex">
          <div className="flex-grow grid grid-cols-7 gap-2 text-center text-sm">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="font-medium text-gray-700">{day}</div>
            ))}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`p-2 rounded-md ${
                  day === null
                    ? 'text-gray-400'
                    : isSelectedDay(day)
                      ? 'bg-yellow-400 text-white font-bold'
                      : 'text-gray-800'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="ml-4 w-20 text-right text-sm flex flex-col justify-between">
            {monthNames.map((m, idx) => (
              <div
                key={m}
                className={`py-1 cursor-pointer ${
                  idx === month
                    ? 'font-bold text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m}
              </div>
            ))}
            <div className="mt-2 text-gray-500">
                2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AddTimeOffModal Component (Moved Inline) ---
const AddTimeOffModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isAllDay, setIsAllDay] = useState(true);
  const [selectedUser, setSelectedUser] = useState("Esther Howard");
  const [timeOffType, setTimeOffType] = useState("Sick leave");

  const userOptions = [
    { name: "Esther Howard", avatar: estherHowardAvatar },
    { name: "Robert Fox", avatar: robertFoxAvatar },
    { name: "Esther Howard", avatar: estherHowardAvatar },
    { name: "Robert Fox", avatar: robertFoxAvatar },
    { name: "Esther Howard", avatar: estherHowardAvatar },
    { name: "Robert Fox", avatar: robertFoxAvatar },
  ];

  const timeOffTypes = [
    "Sick leave",
    "Casual leave",
    "Unpaid leave",
  ];

  return (
    <div className="fixed inset-0 flex items-center  justify-center z-50 left-2/3 -right-32">
      <div className="absolute inset-0    z-40" onClick={onClose}></div>

      <div className="bg-white p-6  rounded-lg shadow-xl w-full max-w-md relative z-50 mx-4 sm:mx-0">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add time off</h2>

        <div className="mb-4">
          <label htmlFor="select-user" className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
          <div className="relative">
            <select
              id="select-user"
              className="appearance-none w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {userOptions.map((user) => (
                <option key={user.name} value={user.name}>{user.name}</option>
              ))}
            </select>
            <img
              src={userOptions.find(u => u.name === selectedUser)?.avatar || estherHowardAvatar}
              alt="User Avatar"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full object-cover"
            />
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="time-off-type" className="block text-sm font-medium text-gray-700 mb-1">Time off type</label>
          <div className="relative">
            <select
              id="time-off-type"
              className="appearance-none w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
              value={timeOffType}
              onChange={(e) => setTimeOffType(e.target.value)}
            >
              {timeOffTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">All day time off</span>
          <label htmlFor="all-day-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="all-day-toggle"
              className="sr-only peer"
              checked={isAllDay}
              onChange={() => setIsAllDay(!isAllDay)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date and time of time off</label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <input
                type="date"
                defaultValue="2025-06-22"
                className="w-full p-2 pl-9 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {!isAllDay && (
              <>
                <span className="text-gray-700">At:</span>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-24 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </>
            )}
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-4">
          <span className="text-sm font-medium text-gray-700">Total time off days</span>
          <span className="text-base font-semibold text-gray-900">1.00 work days</span>
        </div>

        <div className="mb-6">
          <textarea
            id="timeOffManagerNote"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm resize-y min-h-[80px] focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add manager note"
          ></textarea>
        </div>

        <div className="flex  gap-5">
          <button className="px-6 py-2 bg-primary text-white font-medium rounded-md transition-colors shadow-md">
           Add
          </button>
          <button className="px-6 py-2   font-medium rounded-md  border">
           cancel
          </button>
        </div>
      </div>
    </div>
  );
};


// --- TimesheetHeader Component ---
const TimesheetHeader: React.FC = () => {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [showShiftCalendarModal, setShowShiftCalendarModal] = useState(false);
  const [showAddTimeOffModal, setShowAddTimeOffModal] = useState(false);

  const addBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showAddOptions &&
        addBtnRef.current &&
        !addBtnRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".z-30")
      ) {
        setShowAddOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddOptions]);

  return (
    <>
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <img
            src={robertFoxAvatar}
            alt="Robert Fox"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex items-center gap-5">
            <h1 className="text-xl font-semibold text-primary">Robert Fox</h1>
          
              Pay Period:
              <ChevronLeft size={16} className="mx-1" />
              <span>01/06 to 30/06</span>
              <ChevronRight size={16} className="mx-1" />
           
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Calendar Icon Button */}
         

          <div className="relative">
            <button
              ref={addBtnRef}
              onClick={() => setShowAddOptions(!showAddOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-primary rounded-md font-medium text-white transition-colors cursor-pointer"
            >
              <Plus size={18} />
              Add
            </button>
            {showAddOptions && (
              <div className="absolute top-full right-0 mt-2 w-54 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => {
                        setShowAddOptions(false);
                        setShowAddShiftModal(true);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      <Plus size={18} />
                      Add Shift
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowAddOptions(false);
                        setShowAddTimeOffModal(true);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      <Plus size={18} />
                      Add Time off
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-md font-medium text-white transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {showAddShiftModal && <AddShiftModal onClose={() => setShowAddShiftModal(false)} />}
      {showShiftCalendarModal && <ShiftCalendarModal onClose={() => setShowShiftCalendarModal(false)} />}
      {showAddTimeOffModal && <AddTimeOffModal onClose={() => setShowAddTimeOffModal(false)} />}
    </>
  );
};

export default TimesheetHeader;