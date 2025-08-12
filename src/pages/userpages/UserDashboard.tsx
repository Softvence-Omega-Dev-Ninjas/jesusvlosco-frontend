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

interface Achievement {
  id: string;
  title: string;
  date: string;
  recipient: string;
}
const UserDashboard: React.FC = () => {
  const currentShift: Shift = {
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    date: "Friday, June 20",
    location: "Downtown Flagship Store",
    team: ["L", "M", "C"],
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
            <CurrentShiftCard shift={currentShift} />
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
