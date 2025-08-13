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

  const { data } = useGetEmployeeManagementQuery(undefined);
  const [deleteUser] = useDeleteUserMutation();

  // Local state to manage employees list for instant UI update after delete
  const [localEmployees, setLocalEmployees] = useState<Employee[]>([]);

  // On data change, update localEmployees state
  useEffect(() => {
    if (data?.data) {
      setLocalEmployees(data.data);
    }
  }, [data]);

  // Filter employees based on inputs and localEmployees state
  const filteredEmployees =
    localEmployees.filter((employee: Employee) => {
      // Check employee name (first + last)
      const fullName = `${employee.profile?.firstName || ""} ${
        employee.profile?.lastName || ""
      }`.toLowerCase();
      const filterName = employeeName.toLowerCase();

      // Check employeeId (as string)
      const filterEmployeeId = employeeId.toLowerCase();

      // Check contact number
      const filterContact = contactNumber.toLowerCase();

      // Check email
      const filterEmail = email.toLowerCase();

      return (
        (!filterName || fullName.includes(filterName)) &&
        (!filterEmployeeId ||
          employee.employeeID.toString().includes(filterEmployeeId)) &&
        (!filterContact ||
          employee.phone.toLowerCase().includes(filterContact)) &&
        (!filterEmail || employee.email.toLowerCase().includes(filterEmail))
      );
    }) || [];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allEmployeeIds = filteredEmployees.map((emp: Employee) => emp.id);
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

  

  return (
    <div className="min-h-screen   font-inter">
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
                className="block text-sm font-medium text-primary mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search by name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>

            {/* Employee ID Input */}
            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-primary mb-1"
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

          <h3 className="text-lg font-semibold text-primary mb-2">
            Employee Login Information
          </h3>
          <div className="mb-10">
            {/* Contact Number Input */}
            <div className="mb-3">
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-primary mb-1"
              >
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                className="mt-1 block w-full border border-gray-300 text-[#484848] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="000-xxx-xxxx"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            {/* E-mail Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-1"
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
            <table className="min-w-full divide-y  divide-gray-200">
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
                {filteredEmployees.map((employee: Employee, index: number) => (
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
                              "/default-avatar.png"
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
                      className="px-4 py-2 rounded-lg bg-pink-100 text-red-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-150 ease-in-out">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeManagement;
