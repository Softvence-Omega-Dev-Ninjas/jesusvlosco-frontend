import { ChevronDown, Edit } from "lucide-react";
import { useState } from "react";
import { Experience } from "./types";

interface ExperienceFormProps {
  experienceList: Experience[];
  handleExperienceChange: (
    id: number,
    field: string,
    value: string | boolean
  ) => void;
  addExperience: () => void;
  jobTypeOptions: string[];
  setActiveTab: (tabId: string) => void;
  handleSave: (data: Experience[], tabId: string) => void;
  handleExperience: (data: Experience[]) => void;
  handleCancel: (tabId: string) => void;
  isLoading: boolean;
}

const employmentTypes = [
  { label: "Full-time", value: "FULL_TIME" },
  { label: "Part-time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Temporary", value: "TEMPORARY" },
  { label: "Freelance", value: "FREELANCE" },
];

const ExperienceForm = ({
  experienceList,
  handleExperienceChange,
  addExperience,

  handleCancel,
  isLoading,
  handleExperience,
}: ExperienceFormProps) => {
  const [dropdownStates, setDropdownStates] = useState<
    Record<number, { jobTypeOpen: boolean }>
  >(
    experienceList.reduce(
      (acc, exp) => ({
        ...acc,
        [exp.id]: { jobTypeOpen: false },
      }),
      {}
    )
  );

  const toggleDropdown = (id: number, field: string) => {
    setDropdownStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id][field as keyof (typeof prev)[number]],
      },
    }));
  };

  const handleAddExperience = () => {
    const newId = Math.max(...experienceList.map((exp) => exp.id)) + 1;
    setDropdownStates((prev) => ({
      ...prev,
      [newId]: { jobTypeOpen: false },
    }));
    addExperience();
  };

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Experience</h2>
        <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#4E53B1] text-white rounded-lg  transition-colors">
          <Edit className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="space-y-8">
        {experienceList.map((experience, index) => (
          <div key={experience.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Position/Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position/ Designation
                </label>
                <input
                  type="text"
                  placeholder="Enter designation"
                  value={experience.designation}
                  onChange={(e) =>
                    handleExperienceChange(
                      experience.id,
                      "designation",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company name
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={experience.companyName}
                  onChange={(e) =>
                    handleExperienceChange(
                      experience.id,
                      "companyName",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Job Type */}
            <div className="grid grid-cols-1 border-red-600 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job type
                </label>
                <div className="relative">
                  <div
                    className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-500"
                    onClick={() => toggleDropdown(experience.id, "jobTypeOpen")}
                  >
                    <span>{experience.jobType || "Select job type here"}</span>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  {dropdownStates[experience.id]?.jobTypeOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                      {employmentTypes.map((option) => (
                        <div
                          key={option.label}
                          onClick={() => {
                            handleExperienceChange(
                              experience.id,
                              "jobType",
                              option.value
                            );
                            toggleDropdown(experience.id, "jobTypeOpen");
                          }}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                            option.value === experience.jobType
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
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-26">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={experience.startDate}
                    onChange={(e) =>
                      handleExperienceChange(
                        experience.id,
                        "startDate",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500"
                    placeholder="Select date here"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={experience.endDate}
                    onChange={(e) =>
                      handleExperienceChange(
                        experience.id,
                        "endDate",
                        e.target.value
                      )
                    }
                    disabled={experience.isCurrentlyWorking}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-500 ${
                      experience.isCurrentlyWorking
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="Select date here"
                  />
                </div>
              </div>
              {/* Currently Working Checkbox */}
              <div className="flex">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={experience.isCurrentlyWorking}
                    onChange={(e) => {
                      handleExperienceChange(
                        experience.id,
                        "isCurrentlyWorking",
                        e.target.checked
                      );
                      if (e.target.checked) {
                    // console.log({})
                        handleExperienceChange(experience.id, "endDate", "");
                      }
                    }}
                    className="w-4 h-4 text-[#4E53B1] bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  I am currently working there
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Description"
                value={experience.description}
                onChange={(e) =>
                  handleExperienceChange(
                    experience.id,
                    "description",
                    e.target.value
                  )
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Separator line for multiple experiences */}
            {index < experienceList.length - 1 && (
              <hr className="border-gray-200" />
            )}
          </div>
        ))}

        {/* Add Experience Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddExperience}
            className="flex items-center gap-2 px-8 py-2 bg-[#4E53B1] text-white rounded-lg  transition-colors"
          >
            <span className="text-lg font-medium">+</span>
            Add Experience
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => {
            handleExperience(experienceList);
            // handleSave(experienceList, "experience")
          }}
          disabled={isLoading}
          className="cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed px-6 py-2 bg-[#4E53B1] text-white rounded-lg  transition-colors"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => handleCancel("experience")}
          className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
