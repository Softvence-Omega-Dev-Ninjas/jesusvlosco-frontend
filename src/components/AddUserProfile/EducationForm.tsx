import { ChevronDown, Edit } from "lucide-react";
import { useState } from "react";
import { Education } from "./types";

// interface Education {
//   id: number;
//   program: string;
//   institution: string;
//   year: string;
// }

interface EducationFormProps {
  educationList: Education[];
  handleEducationChange: (id: number, field: string, value: string) => void;
  addEducation: () => void;
  programOptions: string[];
  institutionOptions: string[];
  yearOptions: string[];
  setActiveTab: (tabId: string) => void;
  handleSave: (data: Education[], tabId: string) => void;
  hanldeEducationInfo: (data: Education[]) => void;
  handleCancel: (tabId: string) => void;
  isLoading: boolean
}

const EducationForm = ({
  educationList,
  handleEducationChange,
  addEducation,
  programOptions,
  institutionOptions,
  yearOptions,
 
  hanldeEducationInfo,
  handleCancel,
  isLoading
}: EducationFormProps) => {
  const [dropdownStates, setDropdownStates] = useState<
    Record<
      number,
      { programOpen: boolean; institutionOpen: boolean; yearOpen: boolean }
    >
  >(
    educationList.reduce(
      (acc, edu) => ({
        ...acc,
        [edu.id]: {
          programOpen: false,
          institutionOpen: false,
          yearOpen: false,
        },
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

  const handleAddEducation = () => {
    const newId = Math.max(...educationList.map((edu) => edu.id)) + 1;
    setDropdownStates((prev) => ({
      ...prev,
      [newId]: { programOpen: false, institutionOpen: false, yearOpen: false },
    }));
    addEducation();
  };

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Education</h2>
        <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#4E53B1] text-white rounded-lg transition-colors">
          <Edit className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="space-y-6">
        {educationList.map((education) => (
          <div
            key={education.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Program */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program
              </label>
              <div className="relative">
                <div
                  className="flex items-center justify-between px-3 py-2  border border-gray-300 rounded-lg cursor-pointer text-gray-500"
                  onClick={() => toggleDropdown(education.id, "programOpen")}
                >
                  <span>{education.program || "Enter name here"}</span>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {dropdownStates[education.id]?.programOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                    {programOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          handleEducationChange(
                            education.id,
                            "program",
                            option
                          );
                          toggleDropdown(education.id, "programOpen");
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                          option === education.program
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

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution
              </label>
              <div className="relative">
                <div
                  className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-500"
                  onClick={() =>
                    toggleDropdown(education.id, "institutionOpen")
                  }
                >
                  <span>{education.institution || "Enter name here"}</span>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {dropdownStates[education.id]?.institutionOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                    {institutionOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          handleEducationChange(
                            education.id,
                            "institution",
                            option
                          );
                          toggleDropdown(education.id, "institutionOpen");
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                          option === education.institution
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

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <div className="relative">
                <div
                  className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-500"
                  onClick={() => toggleDropdown(education.id, "yearOpen")}
                >
                  <span>{education.year || "Enter year here"}</span>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {dropdownStates[education.id]?.yearOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                    {yearOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          handleEducationChange(education.id, "year", option);
                          toggleDropdown(education.id, "yearOpen");
                        }}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                          Number(option) === education.year
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
          </div>
        ))}

        {/* Add Education Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddEducation}
            className="flex items-center gap-2 px-8 py-2 bg-[#4E53B1] text-white rounded-lg transition-colors"
          >
            <span className="text-lg font-medium">+</span>
            Add Education
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <button
        disabled={isLoading}
          onClick={() => hanldeEducationInfo(educationList)}
          className="cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed px-6 py-2 bg-[#4E53B1] text-white rounded-lg transition-colors"
        >
         {isLoading ? 'Saving...' : "Save"}
        </button>
        <button
          onClick={() => handleCancel("education")}
          className="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
