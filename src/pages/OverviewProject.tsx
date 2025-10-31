/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserPlus, LoaderCircle } from "lucide-react";
import { formatTimeFromISO, formatDateFull } from "@/utils/formatDateToMDY";
import { Link, useParams } from "react-router-dom";
import { useGetUsersQuery } from "@/store/api/admin/shift-sheduling/getAllUser";
import TimeOffRequests from "@/components/Dashboard/TimeOffRequests";
import {
  useApproveTimeOffRequestMutation,
  useDeclineTimeOffRequestMutation,
  useGetAllTimeOffRequestsQuery,
} from "@/store/api/admin/dashboard/TimeOffRequestsApi";
import { useGetSingleProjectQuery } from "@/store/api/admin/shift-sheduling/CreateProjectapi";

const OverviewProject = () => {
  const projectId = useParams().id;
  console.log(projectId, "Project ID from URL");
  const projectInformation = useGetSingleProjectQuery(
    projectId as string
  ) as any;
  const projectUsers = projectInformation?.data?.data?.projectUsers || [];
  console.log(projectInformation, "Project Information");
  const [approveTimeOffRequest] = useApproveTimeOffRequestMutation();

  const [declineTimeOffRequest] = useDeclineTimeOffRequestMutation();

  const { data: timeOff, refetch } = useGetAllTimeOffRequestsQuery({
    page: 1,
    limit: 10,
    status: "DRAFT",
    orderBy: "asc",
  });

  // Map backend data to UI-friendly shape
  const timeOffRequests =
    timeOff?.data?.map((req: any) => ({
      id: req.id,
      name: req.user?.profile?.firstName || "Unknown User", // or backend name field
      avatar:
        req.user?.profile?.profileUrl ||
        `https://i.pravatar.cc/40?img=${Math.random()}`,
      type: req.reason,
      date: formatDateFull(req.startDate),
      status: req.status?.toLowerCase(),
    })) || [];

  const handleApprove = (id: string, adminNote: string) => {
    approveTimeOffRequest({ id, adminNote })
      .unwrap()
      .then(() => {
        console.log("Time off request approved:", id, adminNote);
        refetch();
      })
      .catch((err) => {
        console.error("Failed to approve time off request:", err);
      });
  };

  const handleDecline = async (
    id: string,
    adminNote: string,
    status: string
  ) => {
    try {
      const result = await declineTimeOffRequest({
        id,
        adminNote,
        status,
      }).then(() => {
        console.log("Time off request declined:", id, adminNote, status);
        refetch();
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // API call
  const { data, isLoading, error } = useGetUsersQuery({});
  console.log(data);


  const getLatestShift = (shifts: any[]) => {
    const latestShift = shifts
      .filter((shift: any) => shift.projectId === projectId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      console.log(latestShift, "Latest Shift");

    return latestShift || { date: "No Shift", time: "No Shift" };
  };

  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin mr-2" size={24} />
        <span>Loading employees...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading employees</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="w-full lg:p-6 col-span-9">
          {/* Header (will not dim) */}
          <div className="flex items-center justify-between mb-6 px-6 lg:px-0">
            <h1 className="text-xl font-semibold text-primary">
              Overview of Project {projectInformation?.data?.data?.title}
            </h1>
          </div>

          {/* Assigned Employee Card - This is the only part that should dim */}
          <div
            className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-opacity duration-300`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between p-5">
              <h2 className="text-xl font-semibold text-primary">
                Assigned Employee
              </h2>
              <div className="flex items-center gap-2">
                <Link to={`/admin/schedule/shift-scheduling/${projectId}`}>
                  <button className="flex items-center gap-2 lg:px-5 lg:py-3 px-3 py-2 bg-primary text-white font-medium rounded-lg transition-colors cursor-pointer">
                    <UserPlus />
                    Assign
                  </button>
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-5 py-3 border border-primary rounded-xl lg:mx-5">
                <div
                  className="grid items-center"
                  style={{ gridTemplateColumns: "3fr 3fr 4fr 2fr" }}
                >
                  <div className="text-sm font-medium text-primary">
                    Employee
                  </div>
                  <div className="text-sm font-medium text-primary">
                    Project Name
                  </div>
                  <div className="text-sm font-medium text-primary">Latest Shift</div>
                  <div className="text-sm font-medium text-primary">Latest Shift Date</div>
                </div>
              </div>

              {/* Table Body */}
              <div>
                {projectUsers && projectUsers.length > 0 ? (
                  projectUsers.map((employee: any, index: number) => (
                    <div
                      key={employee.user.id}
                      className={`px-5 py-4 border-b-2 border-gray-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <div
                        className="grid items-center"
                        style={{ gridTemplateColumns: "3fr 3fr 4fr 2fr" }}
                      >
                        {/* Employee */}
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  employee.user.profile.profileUrl ||
                                  "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(
                                      employee.user.profile.firstName +
                                        " " +
                                        employee.user.profile.lastName
                                    )
                                }
                                alt={employee.user.profile.firstName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-primary">
                                {employee.user.profile.firstName}{" "}
                                {employee.user.profile.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {employee?.user?.profile?.jobTitle ||
                                  "No Job Title"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Project Name */}
                        <div>
                          <div className="text-sm text-gray-700">
                            {projectInformation.data?.data.title ||
                              "No Project"}
                          </div>
                        </div>

                        {/* Shift */}
                        <div className="min-w-max">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-500 space-y-2">

                                      <div
                                        className="space-y-1 flex flex-col justify-start items-start "
                                      >
                                        <div className="text-xs text-gray-500">
                                          {getLatestShift(employee.user.shift)?.shiftTitle || "No Shift"}
                                        </div>
                                        <div>
                                          ({formatTimeFromISO(getLatestShift(employee.user.shift)?.startTime)}{" "}
                                          - {formatTimeFromISO(getLatestShift(employee.user.shift)?.endTime)})
                                        </div>
                                      </div>
                            </div>
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <div className="text-sm text-gray-700 space-y-3">
                            {formatDateFull(getLatestShift(employee.user.shift)?.date) || "No Shift"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center text-gray-500">
                    No employees found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (will not dim) */}
        <div className="border-t border-gray-200 w-full lg:border-t-0 col-span-3 mt-4">
          {/* Time-off Requests */}

          <TimeOffRequests
            requests={timeOffRequests}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewProject;
