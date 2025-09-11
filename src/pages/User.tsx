/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoaderIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { PiUserCircleLight } from "react-icons/pi";
import { formatDateToMDY } from "@/utils/formatDateToMDY";
import TableLoadingSpinner from "@/utils/TableLoadingSpinner";
import Pagination from "@/utils/Pagination";
import UserActionDropdown from "@/Layout/User/UserActionDropdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { convertUTCToLocal } from "@/utils/dateUtils";

// Define the type for a User
interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  lastLogin: string;
}

const User: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, isLoading, isFetching } = useGetAllUserQuery({
    role: "EMPLOYEE",
    page: currentPage,
    limit,
    searchTerm,
  });
  const allUsers = data?.data || [];
  console.log({ data, isLoading });

  const mainContainerRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetch new data here from API using `page`
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  console.log({ team: searchTerm });

  // Export table as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Department",
      "Last Login",
    ];
    const tableRows: any[] = [];

    if (allUsers && allUsers.length > 0) {
      allUsers.forEach((user: any) => {
        tableRows.push([
          user?.employeeID || "",
          `${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`,
          user?.email || "",
          user?.phone || "",
          user?.profile?.department || "",
          formatDateToMDY(user?.lastLoginAt) || "",
        ]);
      });
    }

    doc.text("Employee List", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
    });
    doc.save("employee-list.pdf"); // This will download the PDF to your local machine
  };

  return (
    <div
      ref={mainContainerRef}
      className="min-h-screen   px-2 font-sans antialiased relative"
    >
      {/* Header Section */}
      <header className="flex items-center justify-between p-4  mb-3">
        <div>
          <h1 className="text-[24px] font-bold text-[#4E53B1]">
            Employee list
          </h1>
          <p className="text-xl text-gray-400">
            All Employee Information In One Place
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            to={"/admin/create-team"}
            className="flex items-center px-4 py-2 bg-[#4E53B1] text-white rounded-lg shadow  focus:outline-none  focus:ring-offset-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Create Team
          </Link>
          <Link
            to={"/admin/add-user?role=EMPLOYEE"}
            className="flex items-center px-4 py-2 bg-[#4E53B1] text-white rounded-lg shadow  focus:outline-none  focus:ring-offset-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add User
          </Link>
          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow focus:outline-none focus:ring-offset-2 cursor-pointer"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Export PDF
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row  sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search names, roles, department..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        className={`rounded-lg shadow overflow-hidden transition-opacity duration-300`}
      >
        {isLoading ? (
          <div className="bg-transparent min-h-[300px] w-full flex justify-center items-center">
            <LoaderIcon
              size={52}
              className="animate-spin text-blue-600 duration-1000"
            />
          </div>
        ) : (
          <>
            {allUsers && allUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25m0 0L12 2.25 8.25 5.25m7.5 0h-7.5m7.5 0V9m-7.5 0V5.25M3 9.75h18M3 19.5h18"
                  />
                </svg>

                {/* Message */}
                <p className="text-lg font-medium">
                  No records match your search.
                </p>
                <span className="text-sm text-gray-400">
                  Try adjusting your filters or adding new data.
                </span>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Login
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative rounded-tr-lg"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 relative">
                  {allUsers?.map((user: any) => (
                    <tr key={user.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user?.employeeID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user?.profile?.profileUrl ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user?.profile?.profileUrl}
                                alt={`Avatar of ${user?.profile?.firstName}`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).onerror = null;
                                  (
                                    e.target as HTMLImageElement
                                  ).src = `https://placehold.co/40x40/cccccc/000000?text=${user.name
                                    .charAt(0)
                                    .toUpperCase()}`;
                                }}
                              />
                            ) : (
                              <PiUserCircleLight size={36} />
                            )}
                          </div>
                          <div className="ml-3 ">
                            <div className="text-sm flex items-center gap-2 font-medium text-gray-900">
                              <p>{user?.profile?.firstName}</p>
                              <p> {user?.profile?.lastName}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.profile?.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user?.lastLoginAt
                          ? convertUTCToLocal(user?.lastLoginAt).date
                          : "No Login Yet"}
                      </td>
                      <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-500">
                        <UserActionDropdown
                          id={user?.id}
                          firstName={user?.profile?.firstName}
                          lastName={user?.profile?.lastName}
                          email={user?.email}
                          role={user?.role}
                        />
                      </td>
                    </tr>
                  ))}
                  {!isLoading && isFetching && <TableLoadingSpinner />}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
      {!isLoading && allUsers?.length !== 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data?.metadata?.totalPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default User;
