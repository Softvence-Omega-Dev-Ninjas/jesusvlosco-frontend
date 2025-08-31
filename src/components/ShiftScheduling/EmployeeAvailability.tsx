import { useState } from "react";
import { BsStopwatch } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import ShiftTemplateDropdown from "./ShiftTemplateDropdown";
import EmployeeCardPopup from "./EmployeeCardPopup";
import { TProject, TProjectUser } from "@/types/projectType";



const EmployeeAvailability = ({
  projectInformation,
}: {
  projectInformation: TProject;
}) => {
  const projectUsers = projectInformation?.projectUsers || [];
  const userList =
    projectUsers?.filter((user: TProjectUser) => user.user?.role != "ADMIN") ||
    [];
  console.log(projectUsers);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUserList = userList.filter((user) => {
    if (!searchTerm) return true; // If no search term, show all users
    const firstName = user.user.profile?.firstName?.toLowerCase() || "";
    const jobTitle = user.user.profile?.jobTitle?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    return firstName.includes(searchLower) || jobTitle.includes(searchLower);
  });

  console.log("Filtered UserList length:", filteredUserList.length);

  return (
    <aside className="w-full  rounded-2xl lg:w-1/3 xl:w-1/4 bg-white border-r border-gray-200 p-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[rgba(78,83,177,1)] text-lg font-bold">
          Employee Availability
        </h2>
        <span className="text-xs text-green-600 bg-green-100 rounded-full px-2 py-0.5">
          {filteredUserList.length} active
        </span>
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by name or job title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-0"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      </div>
      <ul className="space-y-3 mt-10 h-full">
        {projectUsers.length === 0 && searchTerm ? (
          <li className="text-center py-8 text-gray-500">
            <p>No employees found matching "{searchTerm}"</p>
            <p className="text-sm mt-1">
              Try searching by first name or job title
            </p>
          </li>
        ) : (
          filteredUserList?.map((emp, idx) => (
            <li
              key={emp.id || idx}
              className="relative flex items-center mt-3 gap-3 border border-gray-300 rounded-lg min-h-[100px] px-3 py-3.5 hover:shadow-sm "
            >
              <img
                src={
                  emp.user?.profile?.profileUrl ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                      emp.user?.profile?.firstName +
                        " " +
                        emp.user?.profile?.lastName
                    )
                }
                alt={emp.user?.profile?.firstName || "User"}
                className="w-10 h-10  rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold mb-1 text-sm text-gray-700 truncate">
                    {emp.user.profile?.firstName} {emp.user.profile?.lastName}
                  </span>
                  <EmployeeCardPopup
                    name={emp.user.profile?.firstName || "Unknown"}
                    title={emp.user.profile?.jobTitle || "No title"}
                    department={emp.user.profile?.department || "No department"}
                    email={emp.user.email || "No email"}
                    phone={emp.user.phone || "No phone"}
                    avatar={
                      emp.user.profile?.profileUrl ||
                      `https://i.pravatar.cc/100?img=1`
                    }
                    role={emp.user.role || "Employee"}
                  />
                </div>

                <p
                  className={`text-xs mb-1 ${
                    emp.user.shift?.length === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {emp.user?.shift?.length === 0 ? "Available" : "Busy"}
                </p>

                <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 mt-1">
                  <button
                    className="text-lg"
                  >
                    <BsStopwatch />
                  </button>
                  {/* <TiEqualsOutline className="text-lg" /> */}
                  <ShiftTemplateDropdown
                    shiftTemplates={emp.user?.shift ?? []}
                  />
                  <span className="text-lg font-medium">
                    {emp.user?.shift?.length ?? 0}
                  </span>
                </div>
                <p className="text-sm text-[rgba(78,83,177,1)]">
                  Off Day:{" "}
                  {(emp.user.payroll?.offDay ?? []).join(", ") || "Update Info"}
                </p>
              </div>

              
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default EmployeeAvailability;
