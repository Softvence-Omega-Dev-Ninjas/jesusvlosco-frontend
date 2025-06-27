import React, { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
 
  Eye,
  Edit2,
  Columns3,
  ChevronDown,
  ListFilter,
} from "lucide-react";
import UniversalModal from "@/components/Admin/UniversalModal";


// Interface for Survey data structure
interface Survey {
  id: string;
  title: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending";
  assignTo: string;
}

// Interface for Survey statistics data structure
interface SurveyStats {
  title: string;
  subtitle: string;
  percentage: number;
  responseRate: string;
  responseCount: string;
  color: string;
}

// Interface for Poll data structure
interface PollData {
  title: string;
  response: string;
  status: string;
  options: { label: string; percentage: number; color: string }[];
}

// Interface for Column options
interface ColumnOption {
  id: string;
  label: string;
  isVisible: boolean;
}




const SurveyMainPage: React.FC = () => {
  // State for search term input
  const [searchTerm, setSearchTerm] = useState("");
  // State to control which modal is open
  const [openModalType, setOpenModalType] = useState<
    "filter" | "calendar" | "columns" | "quickView" | null
  >(null);

  // State to store selected filter options (e.g., "Active", "Completed")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  // State to store the selected date from the calendar (placeholder)
  const [selectedDate, setSelectedDate] = useState<string>("");
  // State to manage column visibility
  const [columnOptions, setColumnOptions] = useState<ColumnOption[]>([
    { id: "checkbox", label: "", isVisible: true }, // For the initial checkbox column
    { id: "title", label: "Survey title", isVisible: true },
    { id: "createdBy", label: "Created By", isVisible: true },
    { id: "startDate", label: "Start Date", isVisible: true },
    { id: "endDate", label: "End Date", isVisible: true },
    { id: "status", label: "Status", isVisible: true },
    { id: "assignTo", label: "Assign to", isVisible: true },
    { id: "action", label: "Action", isVisible: true }, // This is the action column header
    // Additional columns for selection in the modal, initially hidden
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

  // State to store the survey data for the quick view modal
  const [selectedSurveyForQuickView, setSelectedSurveyForQuickView] = useState<Survey | null>(null);


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
      assignTo: "Team A",
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
      assignTo: "+3",
    },
    {
      id: "5",
      title: "Diversity & Inclusion Feedback",
      createdBy: "HR Manager",
      startDate: "05/01/2024",
      endDate: "05/01/2024",
      status: "Completed",
      assignTo: "Team B",
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

  // Sample data for survey statistics
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

  // Sample data for polls
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

  // Circular progress component for survey stats
  const CircularProgress: React.FC<{
    percentage: number;
    color: string;
    size?: number;
  }> = ({ percentage, color, size = 120 }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{percentage}%</span>
        </div>
      </div>
    );
  };

  // Function to get appropriate Tailwind classes for status badges
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

  // Handler for filter checkbox changes
  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  // Handler for column visibility toggle
  const handleColumnToggle = (columnId: string) => {
    setColumnOptions((prevOptions) =>
      prevOptions.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
      )
    );
  };

  // Available filter options for the Filter Modal
  const filterOptions = ["All", "Active", "Completed"]; // Hardcoded for now based on the image

  // Filter surveys based on selected filters
  const filteredSurveys = surveys.filter((survey) => {
    if (selectedFilters.length === 0 || selectedFilters.includes("All")) {
      return true; // Show all surveys if no filters or 'All' is selected
    }
    return selectedFilters.includes(survey.status); // Filter by selected status
  });

  // Get visible columns for rendering the table header and cells
  const visibleColumns = columnOptions.filter((col) => col.isVisible);

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Overlay for opacity behind the modals, covers the whole screen */}
      {/* This overlay appears when any of the modals is open */}
      {openModalType && (
        <div
          className="fixed inset-0  z-40" // Semi-transparent black background
          onClick={() => setOpenModalType(null)} // Close all modals when clicking the overlay
        ></div>
      )}

      {/* Main content container */}
      <div className="mx-auto">
        {/* Header section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-primary">Survey & Poll</h1>
            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
              <Plus size={16} />
              Create New
            </button>
          </div>
          <p className="text-gray-600">
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
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setOpenModalType("calendar")} // Open calendar modal on click
            >
              <Calendar size={16} />
              Date
            </button>
          </div>
        </div>

        <div className="rounded-lg shadow-sm border border-gray-200">
          <div className="px-3 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Survey Table
            </h2>
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setOpenModalType("filter")}
              >
                <ListFilter size={16}></ListFilter>
                Filter
              </button>
            </div>
              {/* UniversalModal for calendar */}
        <UniversalModal
          isOpen={openModalType === "calendar"}
          onClose={() => setOpenModalType(null)}
          modalType="calendar"
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* UniversalModal for filter */}
        <UniversalModal
          isOpen={openModalType === "filter"}
          onClose={() => setOpenModalType(null)}
          modalType="filter"
          filterOptions={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />

        {/* UniversalModal for columns */}
        <UniversalModal
          isOpen={openModalType === "columns"}
          onClose={() => setOpenModalType(null)}
          modalType="columns"
          columnOptions={columnOptions}
          onColumnToggle={handleColumnToggle}
        />

        {/* UniversalModal for quickView */}
        <UniversalModal
          isOpen={openModalType === "quickView"}
          onClose={() => setOpenModalType(null)}
          modalType="quickView"
          surveyData={selectedSurveyForQuickView}
        />
          </div>

          {/* Survey Table - Opacity lowered and interactions disabled when any modal is open */}
        <div className="w-full overflow-x-auto ">
  <table className="min-w-[900px] w-full">
    <thead className="bg-gray-50">
      <tr>
        {visibleColumns.map((column) => (
          <th
            key={column.id}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {column.label}
            {column.id === "action" && (
              <div className="relative inline-flex items-center ml-2">
                <button
                  className="flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setOpenModalType("columns")}
                >
                  <Columns3 size={16} />
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
            )}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {filteredSurveys.map((survey) => (
        <tr key={survey.id} className="hover:bg-gray-50">
          {visibleColumns.map((column) => (
            <td
              key={`${survey.id}-${column.id}`}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            >
              {column.id === "checkbox" && (
                <input type="checkbox" className="rounded border-gray-300" />
              )}
              {column.id === "title" && (
                <span className="font-medium text-gray-900">{survey.title}</span>
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
                  {survey.assignTo.startsWith("+") ? (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {survey.assignTo}
                    </span>
                  ) : (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                      {survey.assignTo}
                    </span>
                  )}
                </div>
              )}
              {column.id === "action" && (
                <div className="flex items-center gap-3">
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSelectedSurveyForQuickView(survey);
                      setOpenModalType("quickView");
                    }}
                  >
                    <Eye size={24} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit2 size={24} />
                  </button>
                </div>
              )}
              {/* other optional columns */}
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              Recent Surveys & Poll
            </h2>
          </div>

          {/* Survey Statistics cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Survey</h3>
              <button className="text-primary text-sm font-medium">
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
                    <div className="text-center mt-4">
                      <h4 className="font-semibold text-xl text-gray-900 ">
                        {stat.title}
                      </h4>
                      <p className="text-xl text-gray-600 my-2">
                        {stat.subtitle}
                      </p>
                    </div>
                    <CircularProgress
                      percentage={stat.percentage}
                      color={stat.color}
                    />
                    <div className="text-center mt-4">
                      <p className=" text-gray-500 mt-2">{stat.responseRate}</p>
                      <p className=" text-gray-500">{stat.responseCount}</p>
                      <button className="mt-2 text-primary text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Poll section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Poll</h3>
              <button className="text-primary text-sm font-medium">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pollData.map((poll, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  <h4 className="font-medium text-gray-900 mb-6 text-sm leading-tight">
                    {poll.title}
                  </h4>
                  <div className="flex items-center justify-center gap-20 mb-6">
                    <h3>Response:{poll.response}</h3>
                    <button className="">
                      Status:{" "}
                      <span className="w-full py-1 px-3 bg-green-400 rounded-md">
                        {poll.status}
                      </span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {poll.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">
                            {option.label}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
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
                    ))}
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
