// SurveyMainPage.tsx
import React, { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Eye,
  Columns3,
  ChevronDown,
  ListFilter,
} from "lucide-react";
import UniversalModal from "@/components/Admin/UniversalModal";
import { Link } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";

// Interface for Survey data structure (unchanged)
interface Survey {
  id: string;
  title: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending";
  assignTo: string;
}

// Interface for Survey statistics data structure (unchanged)
interface SurveyStats {
  title: string;
  subtitle: string;
  percentage: number;
  responseRate: string;
  responseCount: string;
  color: string;
}

// Interface for Poll data structure (unchanged)
interface PollData {
  title: string;
  response: string;
  status: string;
  options: { label: string; percentage: number; color: string }[];
}

// Interface for Column options (unchanged)
interface ColumnOption {
  id: string;
  label: string;
  isVisible: boolean;
}

// NEW: Interfaces for Team Data (should ideally be in a shared types file)
interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface TeamData {
  teamName: string;
  members: TeamMember[];
}

const SurveyMainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModalType, setOpenModalType] = useState<
    "filter" | "calendar" | "columns" | "quickView" | "teamMembers" | null // Added "teamMembers"
  >(null);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [columnOptions, setColumnOptions] = useState<ColumnOption[]>([
    { id: "checkbox", label: "", isVisible: true },
    { id: "title", label: "Survey title", isVisible: true },
    { id: "createdBy", label: "Created By", isVisible: true },
    { id: "startDate", label: "Start Date", isVisible: true },
    { id: "endDate", label: "End Date", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "assignTo", label: "Assign to", isVisible: true },
    { id: "action", label: "Action", isVisible: true },
    { id: "name", label: "Name", isVisible: false },
    { id: "employeeId", label: "Employee ID", isVisible: false },
    { id: "email", label: "Email", isVisible: false },
    { id: "groupTeam", label: "Group/ Team", isVisible: false },
    { id: "mobileNumber", label: "Mobile number", isVisible: false },
    { id: "gender", label: "Gender", isVisible: false },
    { id: "userType", label: "User type", isVisible: false },
    { id: "department", label: "Department", isVisible: false },
    { id: "lastLogin", label: "Last login", isVisible: false },
    { id: "roles", label: "Roles", isVisible: false },
    {
      id: "employmentStartDate",
      label: "Employment start date",
      isVisible: false,
    },
  ]);

  const [selectedSurveyForQuickView, setSelectedSurveyForQuickView] =
    useState<Survey | null>(null);

  // NEW: State to hold data for the team whose members are to be displayed
  const [selectedTeamData, setSelectedTeamData] = useState<TeamData | null>(
    null
  );

  // Sample data for surveys
  const surveys: Survey[] = [
    {
      id: "1",
      title: "Employee Satisfaction Survey",
      createdBy: "HR Manager",
      startDate: "05/01/2024",
      endDate: "05/15/2025",
      status: "Active",
      assignTo: "+3",
    },
    {
      id: "2",
      title: "Workplace Safety",
      createdBy: "Safety Lead",
      startDate: "04/20/2025",
      endDate: "04/20/2025",
      status: "Completed",
      assignTo: "Team A", // This will be clickable
    },
    {
      id: "3",
      title: "Remote Work Feedback",
      createdBy: "Team Lead",
      startDate: "04/20/2025",
      endDate: "04/20/2025",
      status: "Active",
      assignTo: "+5",
    },
    {
      id: "4",
      title: "Employee Wellness Check",
      createdBy: "HR Manager",
      startDate: "04/20/2025",
      endDate: "04/20/2025",
      status: "Active",
      assignTo: "Team B", // This will be clickable
    },
    {
      id: "5",
      title: "Diversity & Inclusion Feedback",
      createdBy: "HR Manager",
      startDate: "05/01/2024",
      endDate: "05/01/2024",
      status: "Completed",
      assignTo: "Team C", // This will be clickable
    },
    {
      id: "6",
      title: "Team Collaboration Survey",
      createdBy: "HR Manager",
      startDate: "04/20/2025",
      endDate: "04/20/2025",
      status: "Active",
      assignTo: "+3",
    },
    {
      id: "7",
      title: "New Policy Awareness",
      createdBy: "HR Manager",
      startDate: "04/20/2025",
      endDate: "04/20/2025",
      status: "Completed",
      assignTo: "+3",
    },
    {
      id: "8",
      title: "Employee Engagement Pulse",
      createdBy: "HR Manager",
      startDate: "04/20/2025",
      endDate: "04/20/2025",
      status: "Active",
      assignTo: "+5",
    },
  ];

  // NEW: Sample data for team members
  const teamsData: Record<string, TeamMember[]> = {
    "Team A": [
      { id: "1", name: "Alice Johnson", email: "alice.j@example.com" },
      { id: "2", name: "Bob Smith", email: "bob.s@example.com" },
      { id: "3", name: "Charlie Brown", email: "charlie.b@example.com" },
    ],
    "Team B": [
      { id: "4", name: "David Lee", email: "david.l@example.com" },
      { id: "5", name: "Eve Davis", email: "eve.d@example.com" },
    ],
    "Team C": [
      { id: "6", name: "Frank White", email: "frank.w@example.com" },
      { id: "7", name: "Grace Taylor", email: "grace.t@example.com" },
      { id: "8", name: "Harry Wilson", email: "harry.w@example.com" },
    ],
  };

  // Sample data for survey statistics (unchanged)
  const surveyStats: SurveyStats[] = [
    {
      title: "Employee Satisfaction",
      subtitle: "Survey 2025",
      percentage: 75,
      responseRate: "Response Rate: 75%",
      responseCount: "(150 of 200 responded)",
      color: "text-green-700",
    },
    {
      title: "Employee",
      subtitle: "Engagement Survey",
      percentage: 75,
      responseRate: "Response Rate: 75%",
      responseCount: "(75 of 100 responded)",
      color: "text-blue-700",
    },
    {
      title: "Health & Safety",
      subtitle: "Feedback",
      percentage: 68,
      responseRate: "Response Rate: 68%",
      responseCount: "(136 of 200 responded)",
      color: "text-orange-500",
    },
    {
      title: "Benefits Satisfaction",
      subtitle: "Survey",
      percentage: 62,
      responseRate: "Response Rate: 62%",
      responseCount: "(62 of 100 responded)",
      color: "text-blue-500",
    },
  ];

  // Sample data for polls (unchanged)
  const pollData: PollData[] = [
    {
      title: "How satisfied are you with the current safety protocols on-site?",
      response: "120",
      status: "Live",
      options: [
        { label: "Very satisfied", percentage: 84, color: "bg-primary" },
        { label: "Satisfied", percentage: 14, color: "bg-primary" },
        { label: "Neutral", percentage: 5, color: "bg-primary" },
        { label: "Dissatisfied", percentage: 2, color: "bg-primary" },
        { label: "Very dissatisfied", percentage: 1, color: "bg-primary" },
      ],
    },
    {
      title: "How satisfied are you with your role in the current project?",
      response: "120",
      status: "closed",
      options: [
        { label: "Very satisfied", percentage: 50, color: "bg-primary" },
        { label: "Satisfied", percentage: 14, color: "bg-primary" },
        { label: "Neutral", percentage: 5, color: "bg-primary" },
        { label: "Dissatisfied", percentage: 20, color: "bg-primary" },
        { label: "Very dissatisfied", percentage: 11, color: "bg-primary" },
      ],
    },
    {
      title: "What should we improve most?",
      response: "120",
      status: "Live",
      options: [
        { label: "Communication", percentage: 15, color: "bg-primary" },
        { label: "Equipment", percentage: 13, color: "bg-primary" },
        { label: "Safety", percentage: 2, color: "bg-primary" },
      ],
    },
    {
      title: "How satisfied are you with the current safety protocols on-site?",
      response: "120",
      status: "Live",
      options: [
        { label: "Very satisfied", percentage: 82, color: "bg-primary" },
        { label: "Satisfied", percentage: 14, color: "bg-primary" },
        { label: "Neutral", percentage: 3, color: "bg-primary" },
        { label: "Dissatisfied", percentage: 20, color: "bg-primary" },
        { label: "Very dissatisfied", percentage: 11, color: "bg-primary" },
      ],
    },
  ];

  // Circular progress component for survey stats (unchanged)
  const CircularProgress: React.FC<{
    percentage: number;
    color: string;
    size?: number;
  }> = ({ percentage, color, size = 120 }) => {
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform rotate-80">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            className={color}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
        </div>
      </div>
    );
  };

  // Function to get appropriate Tailwind classes for status badges (unchanged)
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Completed":
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case "Pending":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Handler for filter checkbox changes (unchanged)
  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  // Handler for column visibility toggle (unchanged)
  const handleColumnToggle = (columnId: string) => {
    setColumnOptions((prevOptions) =>
      prevOptions.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
      )
    );
  };

  // NEW: Function to handle clicking on a team name in the "Assign to" column
  const handleTeamAssignClick = (teamName: string) => {
    const members = teamsData[teamName];
    if (members) {
      setSelectedTeamData({ teamName, members });
      setOpenModalType("teamMembers"); // Set the new modal type
    } else {
      console.warn(`No data found for team: ${teamName}`);
      // Optionally, display a toast or alert to the user
    }
  };

  // Available filter options for the Filter Modal (unchanged)
  const filterOptions = ["All", "Active", "Completed"];

  // Filter surveys based on selected filters (unchanged, with searchTerm integration)
  const filteredSurveys = surveys.filter((survey) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearchTerm = Object.values(survey).some((value) =>
      String(value).toLowerCase().includes(lowerCaseSearchTerm)
    );

    if (selectedFilters.length === 0 || selectedFilters.includes("All")) {
      return matchesSearchTerm; // Apply search if no status filter or 'All' is selected
    }
    return selectedFilters.includes(survey.status) && matchesSearchTerm; // Filter by status AND search term
  });

  // Get visible columns for rendering the table header and cells (unchanged)
  const visibleColumns = columnOptions.filter((col) => col.isVisible);

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Universal Modal Overlay - Renders when any modal type is open */}
      {openModalType !== null && (
        <div
          className="fixed inset-0 bg-black/25 z-40 flex items-center justify-center"
          onClick={() => setOpenModalType(null)}
        >
          {/* Prevent clicks inside the modal from closing it */}
          <div onClick={(e) => e.stopPropagation()}>
            {/* Calendar Modal */}
            <UniversalModal
              isOpen={openModalType === "calendar"}
              onClose={() => setOpenModalType(null)}
              modalType="calendar"
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              initialPosition={{ x: 1257, y: 255 }}
            />

            {/* Filter Modal */}
            <UniversalModal
              isOpen={openModalType === "filter"}
              onClose={() => setOpenModalType(null)}
              modalType="filter"
              filterOptions={filterOptions}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              initialPosition={{ x: 1640, y: 340 }}
            />

            {/* Columns Modal */}
            <UniversalModal
              isOpen={openModalType === "columns"}
              onClose={() => setOpenModalType(null)}
              modalType="columns"
              columnOptions={columnOptions}
              onColumnToggle={handleColumnToggle}
              initialPosition={{ x: 1580, y: 400 }}
            />

            {/* Quick View Modal */}
            <UniversalModal
              isOpen={openModalType === "quickView"}
              onClose={() => setOpenModalType(null)}
              modalType="quickView"
              surveyData={selectedSurveyForQuickView}
              initialPosition={{ x: 1450, y: 430 }}
            />

            {/* NEW: Team Members Modal */}
            <UniversalModal
              isOpen={openModalType === "teamMembers"}
              onClose={() => setOpenModalType(null)}
              modalType="teamMembers"
              teamData={selectedTeamData} // Pass the selected team's data
              initialPosition={{ x: 1450, y: 430 }} // Adjust position as needed to match screenshot
            />
          </div>
        </div>
      )}

      {/* Main content container */}
      <div className="mx-auto">
        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-primary">Survey & Poll</h1>
            <Link to={"/survey-poll-page"}>
              <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Plus size={16} />
                Create New
              </button>
            </Link>
          </div>
          <p className="text-[#5B5B5B]">
            View and manage all surveys & polls. Monitor participation and
            status at a glance.
          </p>
        </div>

        {/* Search input and filter/date buttons section */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search entries"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 "
            />
          </div>
          {/* Date button */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 text-[#5B5B5B] border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setOpenModalType("calendar")}
            >
              <Calendar size={16} />
              Date
            </button>
          </div>
        </div>

        <div className="rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="px-3 py-4  flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#484848]">
              Survey Table
            </h2>
            <div className="relative">
              <button
                className="flex items-center text-[#5B5B5B] gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setOpenModalType("filter")}
              >
                <ListFilter size={16}></ListFilter>
                Filter
              </button>
            </div>
          </div>

          {/* Survey Table */}
          <div className="w-full overflow-x-auto ">
            <table className="min-w-[900px] w-full">
              <thead className="bg-gray-50   ">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.id}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300"
                    >
                      {column.id === "checkbox" && (
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                      )}
                      <div className="flex font-semibold items-center">
                        <div className="text-[#484848]">{column.label}</div>
                        {column.id === "action" && (
                          <div className="relative inline-flex items-center ml-2">
                            <button
                              className="flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                              onClick={() => setOpenModalType("columns")}
                            >
                              <Columns3 size={14} />
                              <ChevronDown size={14} className="ml-1" />
                            </button>
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="">
                {filteredSurveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    {visibleColumns.map((column) => (
                      <td
                        key={`${survey.id}-${column.id}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {column.id === "checkbox" && (
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                        )}
                        {column.id === "title" && (
                          <span className=" text-[#484848]">
                            {survey.title}
                          </span>
                        )}
                        {column.id === "createdBy" && survey.createdBy}
                        {column.id === "startDate" && survey.startDate}
                        {column.id === "endDate" && survey.endDate}
                        {column.id === "status" && (
                          <span className={getStatusBadge(survey.status)}>
                            {survey.status}
                          </span>
                        )}
                        {column.id === "assignTo" && (
                          <div className="flex items-center">
                            {/* Conditional rendering for assignTo based on content */}
                            {survey.assignTo.startsWith("+") ? (
                              <span className="bg-gray-100 text-[#484848] px-2 py-1 rounded-full text-xs font-medium">
                                {survey.assignTo}
                              </span>
                            ) : (
                              // If it's a team name, make it clickable and style it
                              <button
                                className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-indigo-200"
                                onClick={() =>
                                  handleTeamAssignClick(survey.assignTo)
                                } // Call the new handler
                              >
                                {survey.assignTo}
                              </button>
                            )}
                          </div>
                        )}
                        {column.id === "action" && (
                          <div className="flex items-center gap-3">
                            <button
                              className="text-gray-600 cursor-pointer"
                              onClick={() => {
                                setSelectedSurveyForQuickView(survey);
                                setOpenModalType("quickView");
                              }}
                            >
                              <Eye size={24} />
                            </button>
                            <button className="text-gray-600 cursor-pointer">
                              <BiSolidEditAlt size={24} />
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Surveys & Polls section */}
        <div className={`mb-8`}>
          <div className="flex items-center justify-between my-6">
            <h2 className="text-xl font-bold text-primary">
              Recent Surveys & Poll
            </h2>
          </div>

          {/* Survey Statistics cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Survey</h3>
              <button className="text-[#484848] text-sm font-medium cursor-pointer">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {surveyStats.map((stat, index) => (
                <div
                  key={index}
                  className=" p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex flex-col items-center">
                    <div className="text-center  mt-4">
                      <h4 className="text-xl text-primary">
                        {stat.title}
                      </h4>
                      <p className="text-xl  my-2 text-primary">
                        {stat.subtitle}
                      </p>
                    </div>
                    <CircularProgress
                      percentage={stat.percentage}
                      color={stat.color}
                    />
                    <div className="text-center mt-4 text-[#949494]">
                      <p className="  mt-2">{stat.responseRate}</p>
                      <p className=" ">{stat.responseCount}</p>

                      <Link to={"survey-response"}> <button className="mt-2 text-primary text-sm font-medium border-b cursor-pointer">
                        View
                      </button></Link>
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Poll section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Poll</h3>
              <button className="text-[#484848] text-sm font-medium cursor-pointer">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pollData.map((poll, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  <h4 className="font-medium text-primary mb-6 text-sm leading-tight">
                    {poll.title}
                  </h4>
                  <div className="flex items-center justify-center gap-20 mb-6">
                    <h3 className="text-[#949494]">Response:{poll.response}</h3>
                    <div className="text-[#949494]">
                      Status:
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${
                          poll.status === "Live"
                            ? "bg-green-500 text-white" // Deeper green for "Live"
                            : "bg-yellow-400 text-white" // Grey for "closed"
                        }`}
                      >
                        {poll.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 text-[#484848]">
                    {poll.options.map(
                      (
                        option: {
                          label: string;
                          percentage: number;
                          color: string;
                        },
                        optionIndex: number
                      ) => (
                        <div key={optionIndex} className=" border-b-2 border-gray-300 pb-2 mb-2 ">
                          <div className="flex items-center justify-between mb-1 ">
                            <span className="text-sm ">
                              {option.label}
                            </span>
                            <span className="text-sm font-medium ">
                              {option.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${option.color}`}
                              style={{ width: `${option.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyMainPage;
