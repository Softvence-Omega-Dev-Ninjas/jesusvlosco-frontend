/* eslint-disable @typescript-eslint/no-explicit-any */
import CompanyUpdateItem from "@/components/UserDashoboard/CompanyUpdateItem";
import CurrentShiftCard from "@/components/UserDashoboard/CurrentShiftCard";
import {
  FileIcon,
  TaskIcon,
  UpdateIcon,
} from "@/components/UserDashoboard/icons";
import Section from "@/components/UserDashoboard/Section";
import TaskList from "@/components/UserDashoboard/TaskList";
import { Shift } from "@/components/UserDashoboard/types";
import { RecognitionUser } from "@/components/UserDashoboard/RecognitionUser";
import { useGetClockInOutQuery } from "@/store/api/clockInOut/clockinoutapi";
import { formatDateFromISO, formatTimeFromISO } from "@/utils/formatDateToMDY";
import { useGetUserDashboardDataQuery } from "@/store/api/user/getUserDashboardData";

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

const UserDashboard: React.FC = () => {
  // Get shift data from API
  const data = useGetClockInOutQuery({});
  const currentApiShift = data?.data?.data?.shift as ApiShiftData | undefined;
  const teamMembers = data?.data?.data?.teamMembers as any | undefined;
  const clock = data?.data?.data?.clock as any | undefined;
  // console.log(teamMembers, "Team members")
  // console.log(currentApiShift, "Current API Shift Data")
  // console.log("Dashboard Data", data?.data?.data);
  const isClockedIn = clock?.clockInAt ? true : false;
  const isClockedOut = clock?.clockOutAt ? true : false;
  // console.log("isClockedIn", isClockedIn, "isClockedOut", isClockedOut);

  // Use the latest shift from today, or fallback to shiftData from clock API
  

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

  const fallbackShift: Shift = {
    startTime: "No shift",
    endTime: "scheduled",
    date: "today",
    location: "No location assigned",
    team: [],
  };

  // Dashboard API
  const dashboardData = useGetUserDashboardDataQuery({});
  const recognitions = dashboardData?.data?.data?.recognitions ?? [];
  const upcomingShiftsData = dashboardData?.data?.data?.upcomingShifts ?? [];
  const upcomingTasksData = dashboardData?.data?.data?.upcomingTasks ?? [];
  const companyUpdatesData = dashboardData?.data?.data?.companyUpdates ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CurrentShiftCard 
            shift={currentShiftFromApi || fallbackShift} 
            team={teamMembers} 
            isClockedIn={isClockedIn}
            isClockedOut={isClockedOut}
            />
          </div>

          <div>
            <TaskList
              title="Upcoming Tasks"
              tasks={upcomingTasksData}
              // showViewAll={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Section title="Upcoming Shifts" icon={TaskIcon}>
            <h4 className="font-semibold text-lg text-[#484848] mb-2">
              Upcoming Shifts:
            </h4>
            <div className="space-y-2">
              {upcomingShiftsData.map((shift: any) => (
                <div
                  key={shift.id}
                  className="flex flex-col items-start space-x-2 text-m"
                >
                  <div className="flex items-start gap-1.5">
                    <FileIcon />
                    <div className="flex flex-col">
                      <span className="text-gray-700">
                        {shift.shiftTitle || "Untitled Shift"}
                      </span>
                      <span className="text-gray-500">
                        ({formatDateFromISO(shift.date)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Company Updates" icon={UpdateIcon}>
            <div
              className={`space-y-4 ${
                companyUpdatesData.length > 2
                  ? "max-h-[330px] overflow-y-auto pr-2"
                  : ""
              }`}
            >
              {companyUpdatesData.map((update: any, index: number) => (
                <CompanyUpdateItem key={index} update={update} />
              ))}
            </div>
          </Section>

          <RecognitionUser achievements={recognitions} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
