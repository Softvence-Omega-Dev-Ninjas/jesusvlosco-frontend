import { useEffect, useState } from "react";

import { useGetEmployeeManagementQuery } from "@/store/api/admin/settings/employeeManagementApi";
import { useDeleteUserMutation } from "@/store/api/admin/settings/getUser";

interface EmployeeProfile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  profileUrl: string | null;
}

interface Employee {
  id: string;
  employeeID: number;
  email: string;
  phone: string;
  lastLoginAt: string;
  profile?: EmployeeProfile;
}

// Main App component
const EmployeeManagement = () => {
  // State for form inputs (optional for this design, but good practice)
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  // Pagination and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch data with pagination and search
  const { data, isLoading } = useGetEmployeeManagementQuery({
    searchTerm,
    page,
    limit,
  });
  const [deleteUser] = useDeleteUserMutation();

  // Local state to manage employees list for instant UI update after delete
  const [localEmployees, setLocalEmployees] = useState<Employee[]>([]);

  // On data change, update localEmployees state
  useEffect(() => {
    if (data?.data) {
      setLocalEmployees(data.data);
    }
  }, [data]);

  // Remove frontend filtering, use API data directly
  const employees = localEmployees;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allEmployeeIds = employees.map((emp: Employee) => emp.id);
  const isAllSelected =
    selectedIds.length === allEmployeeIds.length && allEmployeeIds.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]); // deselect all
    } else {
      setSelectedIds(allEmployeeIds); // select all
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      alert("User deleted successfully");

      // Remove deleted user from localEmployees state
      setLocalEmployees((prev) => prev.filter((emp) => emp.id !== id));

      // Also update selectedIds if needed
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Delete failed");
    }
  };

  // Pagination metadata
  const total = data?.metadata?.total || 0;
  const totalPage = data?.metadata?.totalPage || 1;

  // Handlers for pagination
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPage, p + 1));
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // Search handler (debounced for better UX)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setLimit(10);
      setSearchTerm(employeeName);
    }, 400);
    return () => clearTimeout(timeout);
    // Only trigger on employeeName change
    // eslint-disable-next-line
  }, [employeeName]);

  return (
    <div className="min-h-screen font-inter">
      {/* Header */}
      <header className="flex justify-center py-6">
        <h1 className="text-2xl font-semibold text-primary">
          Employee Management
        </h1>
      </header>

      <main className="  ">
        {/* Employee Information Section */}
        <section className="max-w-3xl mx-auto mb-8">
          <div className="gap-6 mb-6">
            {/* Name Input (search input, not dropdown) */}
            <div className="mb-3">
              <label
                htmlFor="employeeName"
                className="block text-sm font-medium text-primary mb-3"
              >
                Name
              </label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                className="mt-1 mb-6 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>

            {/* Employee ID Input */}
            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-primary mb-3"
              >
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type Here"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-primary mb-6">
            Employee Login Information
          </h3>
          <div className="mb-10">
            {/* Contact Number Input */}
            <div className="mb-3">
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-primary mb-3"
              >
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                className="mt-1 mb-6 block w-full border border-gray-300 text-[#484848] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="000-xxx-xxxx"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            {/* E-mail Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-3"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  focus:border-indigo-500 sm:text-sm"
                placeholder="Type Here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Employee Table Section */}
        <section className="mt-8 overflow-x-auto rounded-md bg-white">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Login
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee: Employee, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(employee.id)}
                          onChange={() => toggleSelectOne(employee.id)}
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.employeeID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              src={
                                employee.profile?.profileUrl ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  employee.profile?.firstName +
                                    " " +
                                    employee.profile?.lastName
                                )}&background=random&size=128`
                              }
                              alt={`${employee.profile?.firstName || ""} ${
                                employee.profile?.lastName || ""
                              }`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.profile?.firstName}{" "}
                              {employee.profile?.lastName}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(employee.lastLoginAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="px-6 py-2 rounded-2xl bg-[#FFE6E7] text-[#DC1E28] cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Improved Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-3 border-t border-gray-100 bg-gray-50 rounded-b-md">
            <div>
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPage}</span>
                {" | "}
                Total: <span className="font-semibold">{total}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium transition
                ${
                  page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                }
              `}
                aria-label="Previous Page"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPage }, (_, i) => i + 1)
                  .filter(
                    (n) =>
                      n === 1 ||
                      n === totalPage ||
                      (n >= page - 1 && n <= page + 1)
                  )
                  .map((n, idx, arr) => {
                    // Add ellipsis if needed
                    if (idx > 0 && n !== arr[idx - 1] + 1) {
                      return (
                        <span
                          key={`ellipsis-${n}`}
                          className="px-1 text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-8 h-8 rounded-full text-sm font-semibold transition
                        ${
                          n === page
                            ? "bg-primary text-white"
                            : "bg-white text-primary border border-primary hover:bg-primary hover:text-white"
                        }
                      `}
                        disabled={n === page}
                      >
                        {n}
                      </button>
                    );
                  })}
              </div>
              <button
                onClick={handleNextPage}
                disabled={page === totalPage}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium transition
                ${
                  page === totalPage
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                }
              `}
                aria-label="Next Page"
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="ml-2 px-2 py-1 rounded-lg text-sm font-semibold transition
                bg-white text-primary border border-primary hover:bg-primary hover:text-white"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeManagement;
