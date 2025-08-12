import { ChevronDown, Edit } from "lucide-react";
import { useState } from "react";
import { FormData } from "./types";

interface PersonalInfoFormProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  genderOptions: {
    label: string;
    value: string;
  }[];
  jobTitleOptions: { label: string; value: string }[];
  departmentOptions: {
    label: string;
    value: string;
  }[];
  cityOptions: string[];
  isLoading: boolean;
  stateOptions: string[];
  setActiveTab: (tabId: string) => void;
  handleCancel: (tabId: string) => void;
  handlePersonalInfo: (formData: FormData) => Promise<void>;
}

const PersonalInfoForm = ({
  formData,
  handleInputChange,
  genderOptions,
  jobTitleOptions,
  departmentOptions,
  cityOptions,
  stateOptions,
  handlePersonalInfo,
  isLoading,
  handleCancel,
}: PersonalInfoFormProps) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [jobTitleOpen, setJobTitleOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);


  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Personal Information
        </h2>
        <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#4E53B1] text-white rounded-lg transition-colors">
          <Edit className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
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
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
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
              className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-500"
              onClick={() => setGenderOpen(!genderOpen)}
            >
              <span>{formData.gender || "Select gender"}</span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {genderOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {genderOptions.map((option) => (
                  <div
                    key={option.label}
                    onClick={() => {
                      handleInputChange("gender", option.value);
                      setGenderOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      option.label === formData.gender
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option.label}
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
            value={formData.employeeID}
            onChange={(e) => handleInputChange("employeeID", e.target.value)}
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
              className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-500"
              onClick={() => setJobTitleOpen(!jobTitleOpen)}
            >
              <span>{formData.jobTitle || "Select job title here"}</span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {jobTitleOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {jobTitleOptions.map((option) => (
                  <div
                    key={option.label}
                    onClick={() => {
                      handleInputChange("jobTitle", option.value);
                      setJobTitleOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      option.value === formData.jobTitle
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option.label}
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
              className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-500"
              onClick={() => setDepartmentOpen(!departmentOpen)}
            >
              <span>{formData.department || "Select Department"}</span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {departmentOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                {departmentOptions.map((option) => (
                  <div
                    key={option.label}
                    onClick={() => {
                      handleInputChange("department", option.value);
                      setDepartmentOpen(false);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      option.label === formData.department
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {option.label}
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
              className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-500"
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
              className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-500"
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
              value={
                formData.dob
                  ? new Date(formData.dob).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                // Store as ISO string if needed
                const dob = e.target.value ? new Date(e.target.value) : null;
                handleInputChange("dob", dob ? dob.toISOString() : "");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500"
              placeholder="Select date"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => handlePersonalInfo(formData)}
          disabled={isLoading}
          className="cursor-pointer disabled:opacity-70 px-6 py-2 bg-[#4E53B1] text-white rounded-lg transition-colors"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => handleCancel("personal")}
          className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
