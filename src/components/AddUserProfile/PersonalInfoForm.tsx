import { Calendar, ChevronDown, Edit } from "lucide-react";
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailId: string;
  gender: string;
  employeeId: string;
  jobTitle: string;
  department: string;
  address: string;
  city: string;
  state: string;
  dateOfBirth: string;
}

interface PersonalInfoFormProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  genderOptions: string[];
  jobTitleOptions: string[];
  departmentOptions: string[];
  cityOptions: string[];
  stateOptions: string[];
  setActiveTab: (tabId: string) => void;
  handleSave: (data: FormData, tabId: string) => void;
  handleCancel: (tabId: string) => void;
}

const PersonalInfoForm = ({
  formData,
  handleInputChange,
  genderOptions,
  jobTitleOptions,
  departmentOptions,
  cityOptions,
  stateOptions,

  handleSave,
  handleCancel,
}: PersonalInfoFormProps) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [jobTitleOpen, setJobTitleOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Personal Information
        </h2>
        <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#4E53B1] text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Edit className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First name
          </label>
          <input
            type="text"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last name
          </label>
          <input
            type="text"
            placeholder="Enter last name here"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone number
          </label>
          <input
            type="tel"
            placeholder="Enter phone number here"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Email ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email ID
          </label>
          <input
            type="email"
            placeholder="Enter Email ID here"
            value={formData.emailId}
            onChange={(e) => handleInputChange("emailId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="relative">
            <div
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer text-gray-500"
              onClick={() => setGenderOpen(!genderOpen)}
            >
              <span>{formData.gender || "Select gender"}</span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {genderOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {genderOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      handleInputChange("gender", option);
                      setGenderOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      option === formData.gender
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID
          </label>
          <input
            type="text"
            placeholder="Enter employee ID here"
            value={formData.employeeId}
            onChange={(e) => handleInputChange("employeeId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <div className="relative">
            <div
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer text-gray-500"
              onClick={() => setJobTitleOpen(!jobTitleOpen)}
            >
              <span>{formData.jobTitle || "Select job title here"}</span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {jobTitleOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {jobTitleOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      handleInputChange("jobTitle", option);
                      setJobTitleOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      option === formData.jobTitle
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <div className="relative">
            <div
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer text-gray-500"
              onClick={() => setDepartmentOpen(!departmentOpen)}
            >
              <span>{formData.department || "Select Department"}</span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {departmentOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {departmentOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      handleInputChange("department", option);
                      setDepartmentOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      option === formData.department
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            placeholder="Enter your address here"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <div className="relative">
            <div
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer text-gray-500"
              onClick={() => setCityOpen(!cityOpen)}
            >
              <span>{formData.city || "Select city"}</span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {cityOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {cityOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      handleInputChange("city", option);
                      setCityOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      option === formData.city
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <div className="relative">
            <div
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer text-gray-500"
              onClick={() => setStateOpen(!stateOpen)}
            >
              <span>{formData.state || "Select state"}</span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {stateOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {stateOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      handleInputChange("state", option);
                      setStateOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      option === formData.state
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of birth
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500"
              placeholder="Select date"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => handleCancel("personal")}
          className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave(formData, "personal")}
          className="cursor-pointer px-6 py-2 bg-[#4E53B1] text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
