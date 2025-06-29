//  this is send reaction page
import { useState } from "react";
import user from "@/assets/user1.png";

const steps = [
  { id: 1, name: "Recipients", current: true },
  { id: 2, name: "Create recognition", current: false },
  { id: 3, name: "Summary", current: false },
];

const employees = [
  {
    id: "21389",
    name: "Cody Fisher",
    email: "nevaeh.simmons@example.com",
    phone: "(303) 555-0105",
    department: "Design",
    lastLogin: "5/7/16",
    avatar: user,
    initials: "CF",
  },
  {
    id: "21389",
    name: "Jenny Wilson",
    email: "felicia.reid@example.com",
    phone: "(307) 555-0133",
    department: "Design",
    lastLogin: "9/4/12",
    avatar: user,
    initials: "JW",
  },
  {
    id: "21389",
    name: "Theresa Webb",
    email: "nathan.roberts@example.com",
    phone: "(907) 555-0101",
    department: "Design",
    lastLogin: "4/21/12",
    avatar: user,
    initials: "TW",
  },
  {
    id: "21389",
    name: "Courtney Henry",
    email: "michelle.rivera@example.com",
    phone: "(671) 555-0110",
    department: "Design",
    lastLogin: "1/31/14",
    avatar: user,
    initials: "CH",
  },
  {
    id: "21389",
    name: "Eleanor Pena",
    email: "kenzi.lawson@example.com",
    phone: "(302) 555-0107",
    department: "Design",
    lastLogin: "10/6/13",
    avatar: user,
    initials: "EP",
  },
  {
    id: "21389",
    name: "Kathryn Murphy",
    email: "georgia.young@example.com",
    phone: "(629) 555-0129",
    department: "Design",
    lastLogin: "7/27/13",
    avatar: user,
    initials: "KM",
  },
  {
    id: "21389",
    name: "Arlene McCoy",
    email: "jessica.hanson@example.com",
    phone: "(505) 555-0125",
    department: "Design",
    lastLogin: "9/23/16",
    avatar: user,
    initials: "AM",
  },
  {
    id: "21389",
    name: "Cody Fisher",
    email: "sara.cruz@example.com",
    phone: "(704) 555-0127",
    department: "Design",
    lastLogin: "1/15/12",
    avatar: user,
    initials: "CF",
  },
  {
    id: "21389",
    name: "Jacob Jones",
    email: "dolores.chambers@example.com",
    phone: "(225) 555-0118",
    department: "Design",
    lastLogin: "8/2/19",
    avatar: user,
    initials: "JJ",
  },
  {
    id: "21389",
    name: "Albert Flores",
    email: "curtis.weaver@example.com",
    phone: "(229) 555-0109",
    department: "Design",
    lastLogin: "6/21/19",
    avatar: user,
    initials: "AF",
  },
  {
    id: "21389",
    name: "Savannah Nguyen",
    email: "tanya.hill@example.com",
    phone: "(217) 555-0113",
    department: "Design",
    lastLogin: "8/21/15",
    avatar: user,
    initials: "SN",
  },
  {
    id: "21389",
    name: "Esther Howard",
    email: "bill.sanders@example.com",
    phone: "(808) 555-0111",
    department: "Design",
    lastLogin: "1/28/17",
    avatar: user,
    initials: "EH",
  },
  {
    id: "21389",
    name: "Ralph Edwards",
    email: "alma.lawson@example.com",
    phone: "(316) 555-0116",
    department: "Design",
    lastLogin: "12/4/17",
    avatar: user,
    initials: "RE",
  },
  {
    id: "21389",
    name: "Leslie Alexander",
    email: "michael.mitc@example.com",
    phone: "(303) 555-0105",
    department: "Design",
    lastLogin: "7/18/17",
    avatar: user,
    initials: "LA",
  },
  {
    id: "21389",
    name: "Floyd Miles",
    email: "tim.jennings@example.com",
    phone: "(308) 555-0121",
    department: "Design",
    lastLogin: "11/7/16",
    avatar: user,
    initials: "FM",
  },
];

const filterOptions = [
  { id: "name", label: "Name", checked: true },
  { id: "employeeId", label: "Employee ID", checked: false },
  { id: "email", label: "Email", checked: true },
  { id: "groupTeam", label: "Group/ Team", checked: false },
  { id: "mobileNumber", label: "Mobile number", checked: true },
  { id: "gender", label: "Gender", checked: false },
  { id: "userType", label: "User type", checked: false },
  { id: "department", label: "Department", checked: true },
  { id: "lastLogin", label: "Last login", checked: false },
  { id: "downloads", label: "Downloads", checked: false },
];

export default function CreateRecognition() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState(filterOptions);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map((_, index) => index.toString()));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (index: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, index]);
    } else {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== index));
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCancel = () => {
    setCurrentStep(1);
    setSelectedEmployees([]);
  };

  const handleFilterToggle = (filterId: string) => {
    setFilters(
      filters.map((filter) =>
        filter.id === filterId
          ? { ...filter, checked: !filter.checked }
          : filter
      )
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className=" overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#FFFFFF] border-b py-2 border-[#B5B5B5]">
                <tr className="">
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedEmployees.length === employees.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-4 py-3  text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Last login
                  </th>
                  <th className="w-8 px-4 py-3">
                    <button
                      onClick={() => setIsFilterModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      Filter
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <tr key={index} className="hover:bg-gray-50 border-0 py-2">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedEmployees.includes(index.toString())}
                        onChange={(e) =>
                          handleSelectEmployee(
                            index.toString(),
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {employee.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                          <img src={employee.avatar} alt="" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {employee.phone}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {employee.lastLogin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 2:
        return (
          <div className="border border-gray-200 rounded-lg p-8">
            this is case too
          </div>
        );
      case 3:
        return (
          <div className="border border-gray-200 rounded-lg p-8">
            this is case three
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full   min-h-screen">
            {/* header section  */}
      <div className="flex items-center justify-between p-6  ">
        {/* Left side - Title and subtitle */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-[#4E53B1] mb-1">
            Recognition
          </h1>
          <p className="text-gray-600 text-sm">
            Celebrate achievements & keep them motivated
          </p>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3">
          
          <button className="px-4 py-3 cursor-pointer bg-gray-100 text-gray-700 text-sm  rounded-md hover:bg-gray-200 transition-colors">
            Badge library
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl min-h-screen">
        {/* Progress Steps */}
        <div className="">
          <div className="mb-12 py-6 border-[#C5C5C5] border-b ">
            <div className="flex items-center  justify-center max-w-2xl mx-auto">
              {steps.map((step, stepIdx) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center  flex-1">
                    <div className="relative ">
                      <div
                        className={`w-4 h-4 rounded-full  ${
                          currentStep === step.id
                            ? "bg-blue-600"
                            : "bg-gray-400"
                        }`}
                      />
                      {stepIdx < steps.length - 1 && (
                        <div
                          className="absolute top-2 left-4 w-full h-px bg-gray-400"
                          style={{ width: "220px" }}
                        />
                      )}
                    </div>
                    <span
                      className={`mt-4 text-base font-medium ${
                        currentStep === step.id
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6 mb-8">
             <button
            onClick={handleNextStep}
            disabled={currentStep === 3}
            className={`px-6 py-3 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              currentStep === 3
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4E53B1] hover:bg-blue-700"
            }`}
          >
            {currentStep === 3 ? "Complete" : "Next step"}
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
         
        </div>

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0  bg-black/50 bg-opacity-50 flex items-center justify-end z-50">
            <div className="bg-white rounded-tl-2xl  shadow-xl w-80 max-h-auto overflow-hidden">
              <div className="p-4">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search members"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filter Options */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filters.map((filter) => (
                    <label
                      key={filter.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filter.checked}
                        onChange={() => handleFilterToggle(filter.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`ml-3 text-sm ${
                          filter.checked
                            ? "text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {filter.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
