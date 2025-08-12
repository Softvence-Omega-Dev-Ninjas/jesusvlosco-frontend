import { useState, ChangeEvent } from "react";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";

type UserProfile = {
  address: string;
  city: string;
  country: string | null;
  createdAt: string;
  department: string;
  dob: string;
  firstName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  id: string;
  jobTitle: string;
  lastName: string;
  nationality: string | null;
  profileUrl: string | null;
  state: string;
  updatedAt: string;
  userId: string;
};

type TUserData = {
  createdAt: string;
  educations: any[];
  email: string;
  employeeID: number;
  experience: any[];
  id: string;
  isLogin: boolean;
  isVerified: boolean;
  lastLoginAt: string;
  payroll: any | null;
  phone: string;
  profile: UserProfile;
  role: string;
  updatedAt: string;
};

export function formatDateToDDMMYYYY(isoDate?: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

  const PollRecipients = () => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usersData } = useGetAllUserQuery({ searchTerm });

  const handleCheckboxChange = (id?: string): void => {
    if (!id) return;
    setSelectedUserIds((prev) => (prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]));
  };

  const handleSelectAllChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const checked = e.target?.checked;
    if (checked) {
      const allIds = usersData?.data?.map((user: TUserData) => user?.id) || [];
      setSelectedUserIds(allIds.filter(Boolean) as string[]);
    } else {
      setSelectedUserIds([]);
    }
  };

  const isAllSelected = usersData?.data && selectedUserIds.length === usersData?.data?.length && usersData?.data?.length > 0;

  console.log("==========>", selectedUserIds);

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-8 font-sans bg-[#FAFBFF]">
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Select user from the list</h2>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div className="relative flex-grow max-w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search names, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                      checked={isAllSelected || false}
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Last login</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.data?.map((user: TUserData) => (
                  <tr key={user?.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                        checked={selectedUserIds.includes(user?.id || "")}
                        onChange={() => handleCheckboxChange(user?.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{user?.employeeID}</td>
                    <td className="px-4 py-3">{`${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`}</td>
                    <td className="px-4 py-3">{user?.email}</td>
                    <td className="px-4 py-3">{user?.phone}</td>
                    <td className="px-4 py-3">{user?.profile?.department}</td>
                    <td className="px-4 py-3">{formatDateToDDMMYYYY(user?.lastLoginAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tablet Table */}
        <div className="hidden md:block lg:hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                      checked={isAllSelected || false}
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Department</th>
                  <th className="px-3 py-2">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.data?.map((user: TUserData) => (
                  <tr key={user?.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                        checked={selectedUserIds.includes(user?.id || "")}
                        onChange={() => handleCheckboxChange(user?.id)}
                      />
                    </td>
                    <td className="px-3 py-2">{`${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`}</td>
                    <td className="px-3 py-2">{user?.email}</td>
                    <td className="px-3 py-2">{user?.profile?.department}</td>
                    <td className="px-3 py-2">{formatDateToDDMMYYYY(user?.lastLoginAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden">
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 rounded mr-2"
                checked={isAllSelected || false}
                onChange={handleSelectAllChange}
              />
              Select All
            </label>
            <span className="text-sm text-gray-500">{selectedUserIds.length} selected</span>
          </div>

          <div className="space-y-3">
            {usersData?.data?.map((user: TUserData) => (
              <div
                key={user?.id}
                className={`bg-white border rounded-lg p-4 ${
                  selectedUserIds.includes(user?.id || "") ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded mr-3 mt-1"
                      checked={selectedUserIds.includes(user?.id || "")}
                      onChange={() => handleCheckboxChange(user?.id)}
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {`${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`}
                      </div>
                      <div className="text-xs text-gray-500">{user?.employeeID}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="truncate ml-2">{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{user?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Department:</span>
                    <span>{user?.profile?.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Login:</span>
                    <span>{formatDateToDDMMYYYY(user?.lastLoginAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Summary */}
        {selectedUserIds.length > 0 && (
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-800">{selectedUserIds.length} user(s) selected</span>
              <button onClick={() => setSelectedUserIds([])} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollRecipients;
