/* eslint-disable @typescript-eslint/no-explicit-any */
import EmployeeDetailModal from "@/components/TimeOffRequest/EmployeeDetailModal";
import { useGetAllTimeOffRequestsAnalysisQuery } from "@/store/api/admin/dashboard/TimeOffRequestsApi"; // adjust import
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const TimeOffRequest: React.FC = () => {
  const [pagination, setPagination] = useState<{ page: number; limit: number }>({
    page: 1,
    limit: 6,
  });

  const {
    data: timeOffRequestsAnalysis,
    isLoading: apiLoading,
    isError,
  } = useGetAllTimeOffRequestsAnalysisQuery({
    page: pagination.page,
    limit: pagination.limit,
    status: "DRAFT",
    orderBy: "asc",
  });

  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // console.log(timeOffRequestsAnalysis);

  useEffect(() => {
    if (timeOffRequestsAnalysis?.data) {
      const formattedData = timeOffRequestsAnalysis.data.map((user: any) => ({
        id: user.userId,
        employeeName: `${user.profile.firstName} ${user.profile.lastName}`,
        jobTitle: user.profile.jobTitle,
        avatar: user.profile.profileUrl || "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(`${user.profile.firstName} ${user.profile.lastName}`),
        timeOff: {
          total: 30,
          remaining: user.requests.timeOff.remaining,
        },
        sickLeave: {
          total:
            user.requests.sickLeave.remaining +
            user.requests.sickLeave.approved.length,
          remaining: user.requests.sickLeave.remaining,
        },
        casualLeave: {
          total:
            user.requests.casualLeave.remaining +
            user.requests.casualLeave.approved.length,
          remaining: user.requests.casualLeave.remaining,
        },
        unpaidLeave: {
          total:
            user.requests.unpaidLeave.remaining +
            user.requests.unpaidLeave.approved.length,
          remaining: user.requests.unpaidLeave.remaining,
        },
        lastStatus: user.lastRequest?.status || "N/A",
        leaveRequests: user.lastRequest ? [user.lastRequest] : [],
      }));
      setEmployeeData(formattedData);
    }
  }, [timeOffRequestsAnalysis]);

  const openModal = (employee: any) => {
    setSelectedEmployee(employee.id);
    setIsModalOpen(true);
    console.log(employee);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  if (apiLoading) {
    return (
      <div className="flex justify-center items-center p-10 bg-gray-5 min-h-screen">
        <LoaderCircle size={40} className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md text-center text-red-600 font-medium">
        Error fetching data.
      </div>
    );
  }

  return (
    <>
      <div
        className={`p-6 mt-6 w-full mx-auto bg-white rounded-lg shadow-md text-gray-800 transition-opacity duration-300 ${
          isModalOpen ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => window.location.reload()} // simple refresh
            className="flex items-center cursor-pointer gap-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time-off
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sick leave
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Casual leave
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unpaid leave
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeData.map((employee, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md -ml-2"
                      onClick={() => openModal(employee.id)}
                    >
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          src={employee.avatar}
                          alt={employee.employeeName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.employeeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.jobTitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="text-gray-600 font-medium">
                      {employee.timeOff.total} Days
                    </div>
                    <div className="text-xs text-green-600 mt-0.5">
                      Remaining: {employee.timeOff.remaining} days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="text-gray-600 font-medium">
                      {employee.sickLeave.total} Days
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        employee.sickLeave.remaining === 0
                          ? "text-red-600 font-semibold"
                          : "text-green-600"
                      }`}
                    >
                      Remaining: {employee.sickLeave.remaining} days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="text-gray-600 font-medium">
                      {employee.casualLeave.total} Days
                    </div>
                    <div className="text-xs text-green-600 mt-0.5">
                      Remaining: {employee.casualLeave.remaining} days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="text-gray-600 font-medium">
                      {employee.unpaidLeave.total} Days
                    </div>
                    <div className="text-xs text-green-600 mt-0.5">
                      Remaining: {employee.unpaidLeave.remaining} days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.lastStatus === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.lastStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls - Always show if we have data */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={employeeData.length === 0 || employeeData.length < pagination.limit}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{pagination.page}</span>
                {employeeData.length > 0 && (
                  <>
                    {' '}• Showing{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + employeeData.length}
                    </span>{' '}
                    entries
                  </>
                )}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Current Page */}
                <button
                  className="relative inline-flex items-center px-4 py-2 border text-sm font-medium z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                >
                  {pagination.page}
                </button>

                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={employeeData.length === 0 || employeeData.length < pagination.limit}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EmployeeDetailModal employee={selectedEmployee} onClose={closeModal} />
      )}
    </>
  );
};

export default TimeOffRequest;
