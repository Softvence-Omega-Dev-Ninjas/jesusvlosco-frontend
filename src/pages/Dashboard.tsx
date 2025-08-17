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
import { Chat } from "../components/Dashboard/Chat";
import { Achievement } from "../components/Dashboard/dashboard";
import { EmployeeTable } from "../components/Dashboard/EmployeeTable";
import MapLocation from "../components/Dashboard/MapLocation";
import { QuickActions } from "../components/Dashboard/QuickActions";
import { RecognitionEngagement } from "../components/Dashboard/RecognitionEngagement";
import { RecognitionTable } from "../components/Dashboard/RecognitionTable";
import { ShiftNotifications } from "../components/Dashboard/ShiftNotifications";
import { SurveyPoll } from "../components/Dashboard/SurveyPoll";
import TimeOffRequests from "../components/Dashboard/TimeOffRequests";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [approveTimeOffRequest] = useApproveTimeOffRequestMutation();

  const [declineTimeOffRequest] = useDeclineTimeOffRequestMutation();

  //assigned employee data call
  const { data: assignedUsersdata } = useGetAllAssignedUsersQuery({
    page: 1,
    limit: 10,
    status: "DRAFT",
    orderBy: "asc",
  });

  const employees = React.useMemo(() => {
    if (!assignedUsersdata) return [];

    return assignedUsersdata.data.map((user: any) => {
      const name =
        `${user.profile?.firstName || ""} ${
          user.profile?.lastName || ""
        }`.trim() || "Unknown";
      const role =
        user.profile?.jobTitle?.replace(/_/g, " ") || user.role || "Unknown";
      const avatar =
        user.profile?.profileUrl;
      const project =
        user.projects && user.projects.length > 0
          ? user.projects[0].title
          : "No Project";
      const shift =
        user.shift && user.shift.length > 0
          ? user.shift[0]?.shiftTitle
          : "Morning";

      const rawDate = user.createdAt || new Date().toISOString();
      const dateObj = new Date(rawDate);
      const date = `${String(dateObj.getDate()).padStart(2, "0")}/${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}/${dateObj.getFullYear()}`;

      const start =
        user.shift && user.shift.length > 0 && user.shift[0].startTime;
      const end = user.shift && user.shift.length > 0 && user.shift[0].endTime;

      const startFormatted = new Date(start)
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();
      const endFormatted = new Date(end)
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();

      const time = `${startFormatted}-${endFormatted}`;
      return {
        id: user.id,
        name,
        role,
        avatar,
        project,
        shift,
        date,
        time,
      };
    });
  }, [assignedUsersdata]);

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
      avatar:
        req.user?.profile?.profileUrl,
      type: req.reason,
      date: new Date(req.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
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

  const achievements: Achievement[] = [
    { id: "1", title: "Team Player", date: "June 17, 2025", recipient: "You" },
    {
      id: "2",
      title: "Outstanding Contribution to Project X",
      date: "June 17, 2025",
      recipient: "You",
    },
    {
      id: "3",
      title: "Outstanding Contribution to Project X",
      date: "June 17, 2025",
      recipient: "You",
    },
    {
      id: "4",
      title: "Outstanding Contribution to Project X",
      date: "June 17, 2025",
      recipient: "You",
    },
    {
      id: "5",
      title: "Outstanding Contribution to Project X",
      date: "June 17, 2025",
      recipient: "You",
    },
  ];

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
            <SurveyPoll />
            <EmployeeTable employees={employees} />
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
            <ShiftNotifications />
            <RecognitionEngagement achievements={achievements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
