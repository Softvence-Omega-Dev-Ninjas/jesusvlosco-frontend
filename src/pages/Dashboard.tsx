/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllAssignedUsersQuery } from "@/store/api/admin/dashboard/getAllAssignedUsers";
import {
  useApproveTimeOffRequestMutation,
  useDeclineTimeOffRequestMutation,
  useGetAllTimeOffRequestsQuery,
} from "@/store/api/admin/dashboard/TimeOffRequestsApi";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDateFull } from "@/utils/formatDateToMDY";
import { Chat } from "../components/Dashboard/Chat";
import EmployeeTable from "../components/Dashboard/EmployeeTable";
import MapLocation from "../components/Dashboard/MapLocation";
import { QuickActions } from "../components/Dashboard/QuickActions";
import { RecognitionEngagement } from "../components/Dashboard/RecognitionEngagement";
import { RecognitionTable } from "../components/Dashboard/RecognitionTable";
import { ShiftNotifications } from "../components/Dashboard/ShiftNotifications";
import { SurveyPoll } from "../components/Dashboard/SurveyPoll";
import TimeOffRequests from "../components/Dashboard/TimeOffRequests";
import {
  useGetAdminDashStatsQuery,
  useGetLatestSurveyandPollQuery,
} from "@/store/api/admin/dashboard/adminDashboardStatApi";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [approveTimeOffRequest] = useApproveTimeOffRequestMutation();
  const { data: adminDashStats } = useGetAdminDashStatsQuery({});
  const { data: latestSurPoll } = useGetLatestSurveyandPollQuery({});
  const [declineTimeOffRequest] = useDeclineTimeOffRequestMutation();
  console.log("Survey and Poll:", latestSurPoll);

  //assigned employee data call
  const { data: assignedUsersdata } = useGetAllAssignedUsersQuery({
    orderBy: "asc",
  });

  //time off data call
  const { data: timeOffRequestsData, refetch } = useGetAllTimeOffRequestsQuery({
    page: 1,
    limit: 10,
    status: "DRAFT",
    orderBy: "asc",
  });

  //time off data map backend data to UI-friendly shape
  const timeOffRequests =
    timeOffRequestsData?.data?.map((req: any) => ({
      id: req.id,
      name: req.user?.profile?.firstName || "Unknown User", // or backend name field
      avatar: req.user?.profile?.profileUrl,
      type: req.reason,
      date: formatDateFull(req.startDate),
      status: req.status?.toLowerCase(),
      userId: req.userId,
    })) || [];

  const handleChatSelect = () => {
    // console.log("Dashboard - Chat selected:", chatId);
    navigate(`/admin/communication/chat`);
  };

  const handleApprove = (id: string, adminNote: string) => {
    approveTimeOffRequest({ id, adminNote })
      .unwrap()
      .then(() => {
        // console.log("Time off request approved:", id, adminNote);
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
        // console.log("Time off request declined:", id, adminNote, status);
        refetch();
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  if (!timeOffRequestsData || !assignedUsersdata) {
    return (
      <div className="flex justify-center items-center p-10 bg-gray-5 min-h-screen">
        <LoaderCircle size={40} className="animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 w-full mx-auto">
      <div className="w-full mx-auto">
        <div className="w-full grid grid-cols-1 2xl:grid-cols-4 gap-0 2xl:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <QuickActions />
            <SurveyPoll data={latestSurPoll} />
            <EmployeeTable />
            {/* <RecognitionTable recognitions={recognitions} /> */}
            <RecognitionTable />
            <MapLocation />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 w-full mx-auto">
            <Chat handleChatSelect={handleChatSelect} />
            <TimeOffRequests
              requests={timeOffRequests}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
            <ShiftNotifications
              shiftNotifications={adminDashStats?.data?.shiftNotifications}
            />
            <RecognitionEngagement
              achievements={adminDashStats?.data?.recognitionNotifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
