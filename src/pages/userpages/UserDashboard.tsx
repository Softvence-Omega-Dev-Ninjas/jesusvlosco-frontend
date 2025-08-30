/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertBanner from "@/components/UserDashoboard/AlertBanner";
import CompanyUpdateItem from "@/components/UserDashoboard/CompanyUpdateItem";
import CurrentShiftCard from "@/components/UserDashoboard/CurrentShiftCard";
import {
  FileIcon,
  TaskIcon,
  UpdateIcon,
} from "@/components/UserDashoboard/icons";
import NextShiftCard from "@/components/UserDashoboard/NextShiftCard";
import Section from "@/components/UserDashoboard/Section";
import TaskList from "@/components/UserDashoboard/TaskList";
import { CompanyUpdate, Shift, Task } from "@/components/UserDashoboard/types";

import { RecognitionUser } from "@/components/UserDashoboard/RecognitionUser";
// import { useGetUserInformationQuery } from "@/store/api/user/userinformation/userInfoApi";
// import { toLocalTimeString } from "@/utils/timeUtils";
import { useGetClockInOutQuery } from "@/store/api/clockInOut/clockinoutapi";
import { formatDateFromISO, formatTimeFromISO } from "@/utils/formatDateToMDY";

// API Shift Data Interface based on your actual response
interface ApiShiftData {
  id: string;
  startTime: string;
  endTime: string;
  location: string;
  locationLat: number;
  locationLng: number;
  date: string;
  allDay: boolean;
  shiftTitle: string;
  job: string;
  note: string;
  shiftType: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
  shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
  createdAt: string;
  updatedAt: string;
  
}

interface Achievement {
  id: string;
  title: string;
  date: string;
  recipient: string;
}
const UserDashboard: React.FC = () => {
  // Get shift data from API
  const data = useGetClockInOutQuery({});
  const shiftData = data?.data?.data?.shift as ApiShiftData | undefined;
  const teamMembers = data?.data?.data?.teamMembers as any | undefined;
  // console.log(teamMembers, "Team members")
  // console.log("Current Shift Data Check:", shiftData);
  
  // const userData = useGetUserInformationQuery({})
  // const shifts = userData?.data?.data?.shift as ApiShiftData[] | undefined;
  // console.log("User Data:", shifts);
  
  // find today's date (YYYY-MM-DD)
  // const todayDate = new Date().toISOString().slice(0, 10);

  // const todayShifts = Array.isArray(shifts)
  //   ? shifts.filter((s: ApiShiftData) => {
  //       if (!s?.date) return false;
  //       try {
  //         return new Date(s.date).toISOString().slice(0, 10) === todayDate;
  //       } catch {
  //         return false;
  //       }
  //     })
  //   : [];

  // const latestTodayShift = todayShifts.length
  //   ? todayShifts.reduce((prev: ApiShiftData, curr: ApiShiftData) =>
  //       new Date(curr.createdAt).getTime() > new Date(prev.createdAt).getTime() ? curr : prev
  //     )
  //   : undefined;

  // Use the latest shift from today, or fallback to shiftData from clock API
  const currentApiShift = shiftData;
  // console.log(currentApiShift, "Current API Shift Data")

  // Convert API shift data to UI Shift format
  const currentShiftFromApi: Shift | undefined = currentApiShift
    ? {
        startTime: formatTimeFromISO(currentApiShift.startTime), // Convert ISO string to local time
        endTime: formatTimeFromISO(currentApiShift.endTime),
        date: formatDateFromISO(currentApiShift.date),
        location: currentApiShift.location || "",
        team: [], // Team data might need to be fetched separately or processed differently
      }
    : undefined;

    console.log(currentShiftFromApi, " Current Shift Formatted");
    // console.log("Raw API Shift Data:", currentApiShift);
    // console.log("Shift Title:", currentApiShift?.shiftTitle);
    // console.log("Job:", currentApiShift?.job);
    // console.log("Shift Type:", currentApiShift?.shiftType);

  // Fallback shift data when no API data is available
  const fallbackShift: Shift = {
    startTime: "No shift",
    endTime: "scheduled",
    date: "today",
    location: "No location assigned",
    team: [],
  };

  const upcomingTasks: Task[] = [
    { title: "Complete Q2 Sales Report", priority: "Today" },
    { title: "Follow up with new leads", priority: "Tomorrow" },
    { title: "Team sync meeting presentation", priority: "Tomorrow" },
  ];

  const nextShift = {
    time: "9:00 AM - 5:00 PM",
    location: "Main Office - Floor 3",
    colleagues: "Alice, Bob",
  };

  const upcomingTasksList = [
    {
      title: "Complete Q2 Performance Review",
      time: "Today, 5:00 PM",
    },
    {
      title: "Review Marketing Campaign Draft",
      time: "Today, 5:00 PM",
    },
  ];

  const companyUpdates: CompanyUpdate[] = [
    {
      department: "HR",
      title: "HR Department",
      description:
        "Annual Performance reviews are starting. Please schedule a meeting with your manager",
      time: "2 hours ago",
    },
    {
      department: "IT",
      title: "System Maintenance Alert",
      description:
        "Scheduled system maintenance on Sunday, June 22nd, from 1 AM to 3 AM.",
      time: "1 hour ago",
    },
    {
      department: "IT",
      title: "System Maintenance Alert",
      description:
        "Scheduled system maintenance on Sunday, June 22nd, from 1 AM to 3 AM.",
      time: "1 hour ago",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="w-full mx-auto">
        <AlertBanner
          message="Urgent Shift change for tomorrow, your shift starts at 8:00 AM instead of 9:00 AM"
          type="warning"
          onDismiss={() => console.log("Alert dismissed")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CurrentShiftCard shift={currentShiftFromApi || fallbackShift} team={teamMembers} />
          </div>

          <div>
            <TaskList
              title="Upcoming Tasks"
              tasks={upcomingTasks}
              showViewAll={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Section title="Upcoming Shifts & Tasks" icon={TaskIcon}>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-[#484848] mb-2">Next Shift:</h4>
                <NextShiftCard shift={nextShift} />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-[#484848] mb-2">
                  Upcoming Tasks:
                </h4>
                <div className="space-y-2">
                  {upcomingTasksList.map((task, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-start space-x-2 text-sm"
                    >
                      <div className="flex items-start gap-1.5">
                        <FileIcon />
                        <div className="flex flex-col">
                          <span className="text-gray-700">{task.title}</span>
                          <span className="text-gray-500">({task.time})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Company Updates" icon={UpdateIcon}>
            <div
              className={`space-y-4 ${
                companyUpdates.length > 2
                  ? "max-h-[330px] overflow-y-auto pr-2"
                  : ""
              }`}
            >
              {companyUpdates.map((update, index) => (
                <CompanyUpdateItem key={index} update={update} />
              ))}
            </div>
          </Section>

          <RecognitionUser achievements={achievements} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
