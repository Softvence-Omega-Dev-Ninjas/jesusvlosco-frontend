import { useState } from "react";
import messageIcon from "@/assets/message-icon.svg";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { TUser } from "@/types/usertype";

interface EmployeeDirectoryProps {
  onChatWithUser?: (userId: string) => void;
}

export default function EmployeeDirectory({ onChatWithUser }: EmployeeDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
   const users = useGetAllUserQuery({limit: 50});
   console.log(users, "Users Data in Employee Directory");
      const employees = users?.data?.data.filter((user: TUser) => user.role != "ADMIN") || [];
      console.log(employees);

  const lcSearch = searchTerm.toLowerCase();
  const filteredEmployees = employees.filter((employee: TUser) => {
    const first = (employee.profile?.firstName ?? "").toLowerCase();
    const last = (employee.profile?.lastName ?? "").toLowerCase();
    const dept = (employee.profile?.department ?? "").toLowerCase();

    return (
      first.includes(lcSearch) || last.includes(lcSearch) || dept.includes(lcSearch)
    );
  });

  const handleChat = (employee: TUser) => {
    console.log(`Starting chat with ${employee.profile?.firstName || "Employee"}`);
    console.log("Selected User:", employee.id);
    
    // Call the parent's chat handler if provided
    if (onChatWithUser) {
      onChatWithUser(employee.id);
    }
  };

  const handleCall = (employee: TUser) => {
    window.open(`tel:${employee.phone}`);
  };

  const handleEmail = (employee: TUser) => {
    window.open(`mailto:${employee.email}`);
  };
    
  return (
    <div className="max-w-4xl min-w-sm w-full mx-auto bg-gray-50 overflow-y-auto max-h-[700px] p-2 rounded-md">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Employee Directory
      </h1>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
            placeholder="Search conversation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredEmployees.map((employee: TUser) => (
          <div
            key={employee.id}
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            {/* Employee Info */}
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={employee.profile.profileUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(employee.profile.firstName + " " + employee.profile.lastName)}
                alt={employee.profile?.firstName || "Employee Avatar"}
                className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {employee.profile?.firstName + " " + employee.profile?.lastName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{employee.profile?.jobTitle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {employee.profile?.department}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-around items-center gap-2">
              <button
                onClick={() => handleChat(employee)}
                className="bg-primary hover:bg-primary/90 p-3 text-white cursor-pointer rounded-xl transition-colors duration-200 flex items-center justify-center"
                title="Start chat"
              >
                <img src={messageIcon} alt="message-icon" />
              </button>

              <button
                onClick={() => handleCall(employee)}
                className="p-3  text-gray-700 rounded-xl cursor-pointer transition-colors duration-200"
                title="Call"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </button>

              <button
                onClick={() => handleEmail(employee)}
                className="p-3 text-gray-700 rounded-xl transition-colors duration-200 cursor-pointer"
                title="Send email"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No employees found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms.
          </p>
        </div>
      )}
    </div>
  );
}
