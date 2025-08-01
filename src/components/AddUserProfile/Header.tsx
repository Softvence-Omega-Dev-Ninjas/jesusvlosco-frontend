import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { TRole } from "./types";

interface HeaderProps {
  selectedRole: TRole;
  setSelectedRole: (role: TRole) => void;
}
const roleOptions = ["ADMIN", "USER", "EMPLOYEE", "MANAGER"];

const Header = ({ selectedRole, setSelectedRole }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex justify-between items-start mb-8 mt-4 gap-2">
      <div>
        <h1 className="text-2xl font-bold text-[#4E53B1] mb-2">Add user</h1>
        <p className="text-gray-600">
          Fill in the details below to add a new employee to the system.
        </p>
      </div>

      <div className="flex flex-col items-end relative ">
        <label className="text-sm font-medium flex self-start text-gray-600 mb-2">
          Select role
        </label>

        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="min-w-[150px] flex justify-between w-82 items-center px-4 py-2  border border-gray-300 rounded-lg cursor-pointer"
        >
          <span>{selectedRole}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>

        {dropdownOpen && (
          <div className="absolute top-full mt-1 right-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {roleOptions.map((role) => (
              <div
                key={role}
                onClick={() => {
                  setSelectedRole(role as TRole);
                  setDropdownOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                  selectedRole === role
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {role}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
