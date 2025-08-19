/* eslint-disable @typescript-eslint/no-explicit-any */
import EmployeeDetailModal from "@/components/TimeOffRequest/EmployeeDetailModal";
import { useGetAllTimeOffRequestsAnalysisQuery } from "@/store/api/admin/dashboard/TimeOffRequestsApi"; // adjust import
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const TimeOffRequest: React.FC = () => {
  const {
    data: timeOffRequestsAnalysis,
    isLoading: apiLoading,
    isError,
  } = useGetAllTimeOffRequestsAnalysisQuery({
    page: 1,
    limit: 30,
    status: "DRAFT",
    orderBy: "asc",
  });

  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  console.log(timeOffRequestsAnalysis);

  useEffect(() => {
    if (timeOffRequestsAnalysis?.data) {
      const formattedData = timeOffRequestsAnalysis.data.map((user: any) => ({
        id: user.userId,
        employeeName: `${user.profile.firstName} ${user.profile.lastName}`,
        jobTitle: user.profile.jobTitle,
        avatar: user.profile.profileUrl || "https://via.placeholder.com/40",
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
          <h2 className="text-xl font-semibold text-[#4E53B1]">
            Overview Project 1
          </h2>
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
      </div>

      {isModalOpen && (
        <EmployeeDetailModal employee={selectedEmployee} onClose={closeModal} />
      )}
    </>
  );
};

export default TimeOffRequest;
