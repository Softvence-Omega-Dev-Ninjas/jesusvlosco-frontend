import { ChevronDown } from "lucide-react";

interface HeaderProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

const Header = ({ selectedRole, setSelectedRole }: HeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#4E53B1] mb-2">Add user</h1>
        <p className="text-gray-600">
          Fill in the details below to add a new employee to the system.
        </p>
      </div>
      <div className="flex flex-col items-end">
        <label className="text-sm font-medium text-gray-600 mb-2">
          Select role
        </label>
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default Header;
