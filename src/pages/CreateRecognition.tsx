//  this is send reaction page
import { useState } from "react";
import user from "@/assets/user1.png";
import CreateRecognitionBagde from "@/components/RecognitionTable/CreateRecognitionBagde";
import SummeryTab from "@/components/RecognitionTable/SummeryTab";
import { useNavigate } from "react-router-dom";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { formatDateToMDY } from "@/utils/formatDateToMDY";
import {
  useAddRecognationMutation,
  useGetAllBadgeQuery,
} from "@/store/api/admin/recognation/recognationApi";
import { IBadge } from "@/types/recognation";
import { toast } from "sonner";
import { IUser } from "@/types/user";

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
  const { data } = useGetAllUserQuery({limit: 20});
  const { data: badgeData } = useGetAllBadgeQuery(null);

  const [createRecognation] = useAddRecognationMutation();
  const [formData, setFormData] = useState({
    badgeId: "", // selected badge id
    message: "",
    visibility: "", // e.g. "All_user_in_the_company"
    shouldNotify: false,
    isAllowedToLike: false,
  });

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState(filterOptions);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map((_, index) => index.toString()));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (
    index: string,
    checked: boolean,
    id: string
  ) => {
    console.log({ checked, index, id });
    if (checked) {
      setSelectedEmployees([...selectedEmployees, id]);
    } else {
      setSelectedEmployees(selectedEmployees.filter((el) => el !== id));
    }
  };

  const handleNextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      const userIds = selectedUsersData?.map((el: IUser) => el.id);
      console.log(userIds);

      try {
        const result = await createRecognation({
          ...formData,
          recognitionUserIds: selectedEmployees,
        }).unwrap();
        console.log({ result });
        if (result?.success) {
          toast.success("Recognation added");
          navigate('/admin/communication/recognition')
        }
      } catch (error: any) {
        console.log({error})
        toast.error(error?.message || "Something went worng");
      }
      // navigate("/admin/communication/recognition");
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

  // Handle change for any form field
  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedBadge = badgeData?.data?.find(
    (el: IBadge) => el.id === formData.badgeId
  );
  const selectedUsersData = data?.data.filter((user: { id: string }) =>
    selectedEmployees.includes(user.id)
  );
  console.log({ selectedBadge, selectedUsersData });

  // console.log({ formData, selectedEmployees });

  const handleRecognation = async () => {
    try {
      const result = await createRecognation(formData).unwrap();
      if (result?.success) {
        toast.success("Recognation added");
      }
    } catch (error: any) {
      toast.error(error?.message || "Somehting went wrong");
    }
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className=" overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#FFFFFF] border-b py-2 border-[#B5B5B5]">
                <tr className="">
                  <th className="w-12 px-4 py-3 cursor-pointer text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedEmployees.length === employees.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-4 py-3 cursor-pointer   text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3  cursor-pointer text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 cursor-pointer text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 cursor-pointer text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 cursor-pointer text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 cursor-pointer text-left text-xs font-bold text-[#484848] uppercase tracking-wider">
                    Last login
                  </th>
                  <th className="w-8 px-4 py-3">
                    <button
                      onClick={() => setIsFilterModalOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 border cursor-pointer border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                {data?.data.map((employee: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 border-0 py-2 cursor-pointer"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedEmployees.includes(
                          employee?.id.toString()
                        )}
                        onChange={(e) =>
                          handleSelectEmployee(
                            index.toString(),
                            e.target.checked,
                            employee?.id
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {employee?.employeeID}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                          <img src={employee?.avatar} alt="" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {employee?.profile?.firstName}{" "}
                          {employee?.profile?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {employee?.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {employee?.phone}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {employee?.profile?.department}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDateToMDY(employee.lastLoginAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 2:
        return (
          <div className=" bg-white rounded-lg  min-h-screen ">
            <CreateRecognitionBagde
              formData={formData}
              handleChange={handleChange}
            />
          </div>
        );
      case 3:
        return (
          <div className=" ">
            <SummeryTab
              selectedBadge={selectedBadge}
              selectedUsersData={selectedUsersData}
              formData={formData}
              handleRecognation={handleRecognation}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full  min-h-screen pb-10">
      {/* header section  */}
      <div className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-between md:items-center  ">
        {/* Left side - Title and subtitle */}
        <div className="flex flex-col">
          <h1 className="text-2xl text-center md:text-left font-semibold text-[#4E53B1] mb-1">
            Recognition
          </h1>
          <p className="text-gray-600 text-sm">
            Celebrate achievements & keep them motivated
          </p>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/badge-library")}
            className="px-4 py-3 cursor-pointer bg-gray-100 text-gray-700 text-sm  rounded-md hover:bg-gray-200 transition-colors"
          >
            Badge library
          </button>
        </div>
      </div>
      <div className="bg-white p-8">
        <div className="bg-white rounded-2xl min-h-screen">
          {/* Progress Steps */}
          <div className="">
            <div className="mb-12 py-6 border-[#C5C5C5] border-b ">
              <div className="flex items-center  justify-center max-w-2xl mx-auto">
                <div className="flex justify-between items-start w-full max-w-2xl mx-auto">
                  {steps.map((step, stepIdx) => (
                    <div
                      key={step.id}
                      className="relative flex flex-col items-center flex-1"
                    >
                      {/* Line to next step */}
                      {stepIdx < steps.length - 1 && (
                        <div className="absolute top-2 left-1/2 w-full h-0.5 bg-gray-300 z-0" />
                      )}

                      {/* Circle */}
                      <div className="relative z-10">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            currentStep === step.id
                              ? "bg-[#4E53B1]"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>

                      {/* Step name */}
                      <span
                        className={`mt-2 text-sm font-normal md:font-medium text-center ${
                          currentStep === step.id
                            ? "text-[#4E53B1]"
                            : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6 mb-8 mr-3">
            <button
              onClick={handleNextStep}
              disabled={currentStep > 3}
              className={`px-6 py-3 text-sm cursor-pointer font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                currentStep === 3
                  ? "bg-[#4E53B1] hover:bg-blue-700"
                  : currentStep > 3
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4E53B1] hover:bg-blue-700"
              }`}
            >
              {currentStep === 3 ? "Send recognition" : "Next step"}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>

          {/* Filter Modal */}
          {isFilterModalOpen && (
            <div className="fixed inset-0  bg-black/50 bg-opacity-50 flex items-center justify-end z-50">
              <div className="bg-white rounded-tl-2xl  shadow-xl w-80 max-h-auto overflow-hidden">
                <div className="p-4 ">
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
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
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
                      className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsFilterModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
    </div>
  );
}
