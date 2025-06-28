import React from "react";
import { Chat } from "../components/Dashboard/Chat";
import {
  Achievement,
  ChatMessage,
  Employee,
  Recognition,
  TimeOffRequest,
} from "../components/Dashboard/dashboard";
import { EmployeeTable } from "../components/Dashboard/EmployeeTable";
import { MapLocation } from "../components/Dashboard/MapLocation";
import { QuickActions } from "../components/Dashboard/QuickActions";
import { RecognitionEngagement } from "../components/Dashboard/RecognitionEngagement";
import { RecognitionTable } from "../components/Dashboard/RecognitionTable";
import { ShiftNotifications } from "../components/Dashboard/ShiftNotifications";
import { SurveyPoll } from "../components/Dashboard/SurveyPoll";
import { TimeOffRequests } from "../components/Dashboard/TimeOffRequests";

const Dashboard: React.FC = () => {
  // Sample data
  const employees: Employee[] = [
    {
      id: "1",
      name: "Jane Cooper",
      role: "Project Manager",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      project: "Metro Shopping Center",
      shift: "Morning",
      date: "22/05/2025",
      time: "9:00am-5:00pm",
    },
    {
      id: "2",
      name: "Robert Fox",
      role: "Construction Site Manager",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      project: "Riverside Apartments",
      shift: "Night",
      date: "07/02/2025",
      time: "9:00am-6:00pm",
    },
    {
      id: "3",
      name: "Esther Howard",
      role: "Assistant Project Manager",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      project: "City Bridge Renovations",
      shift: "Night",
      date: "22/06/2025",
      time: "9:00am-6:00pm",
    },
    {
      id: "4",
      name: "Desirae Botosh",
      role: "Superintendent",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      project: "Tech Campus Phase 2",
      shift: "Morning",
      date: "02/02/2025",
      time: "9:00am-5:00pm",
    },
    {
      id: "5",
      name: "Marley Stanton",
      role: "Coordinator",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      project: "Golden Hills Estates",
      shift: "Morning",
      date: "02/02/2025",
      time: "9:00am-5:00pm",
    },
  ];

  const timeOffRequests: TimeOffRequest[] = [
    {
      id: "1",
      name: "Jane Cooper",
      avatar: "JC",
      type: "Doctor's appointment",
      date: "Mar 25,2025",
      status: "pending",
    },
    {
      id: "2",
      name: "Jenny Wilson",
      avatar: "JW",
      type: "Sick leave",
      date: "Mar 30,2025",
      status: "approved",
    },
    {
      id: "3",
      name: "Kristin Watson",
      avatar: "KW",
      type: "Personal day",
      date: "Jun 02,2025",
      status: "declined",
    },
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "SJ",
      message: "Thanks for the project...",
      time: "3 min ago",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "SJ",
      message: "Thanks for the project...",
      time: "5 min ago",
    },
    {
      id: "3",
      name: "Sarah Johnson",
      avatar: "SJ",
      message: "Thanks for the project...",
      time: "7 min ago",
    },
    {
      id: "4",
      name: "Sarah Johnson",
      avatar: "SJ",
      message: "Thanks for the project...",
      time: "7 min ago",
    },
    {
      id: "5",
      name: "Sarah Johnson",
      avatar: "SJ",
      message: "Thanks for the project...",
      time: "7 min ago",
    },
  ];

  const recognitions: Recognition[] = [
    {
      id: "1",
      from: "Team player",
      avatar: "TP",
      type: "Team player",
      message: "Well-done team",
      viewer: "All",
    },
    {
      id: "2",
      from: "Floyd Miles",
      avatar: "FM",
      type: "Creative",
      message: "-----",
      viewer: "Team A",
    },
    {
      id: "3",
      from: "Floyd Miles",
      avatar: "FM",
      type: "Creative",
      message: "-----",
      viewer: "Team A",
    },
    {
      id: "4",
      from: "Floyd Miles",
      avatar: "FM",
      type: "Creative",
      message: "-----",
      viewer: "Team A",
    },
    {
      id: "5",
      from: "Floyd Miles",
      avatar: "FM",
      type: "Creative",
      message: "-----",
      viewer: "Team A",
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
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <QuickActions />
            <SurveyPoll />
            <EmployeeTable employees={employees} />
            <RecognitionTable recognitions={recognitions} />
            <MapLocation />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <Chat messages={chatMessages} />
            <TimeOffRequests requests={timeOffRequests} />
            <ShiftNotifications />
            <RecognitionEngagement achievements={achievements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
