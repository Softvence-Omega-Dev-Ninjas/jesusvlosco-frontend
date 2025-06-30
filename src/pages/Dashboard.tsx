import React from "react";
import { Chat } from "../components/Dashboard/Chat";
import {
  Achievement,
  ChatMessage,
  Employee,
  Recognition,
} from "../components/Dashboard/dashboard";
import { EmployeeTable } from "../components/Dashboard/EmployeeTable";
import { MapLocation } from "../components/Dashboard/MapLocation";
import { QuickActions } from "../components/Dashboard/QuickActions";
import { RecognitionEngagement } from "../components/Dashboard/RecognitionEngagement";
import { RecognitionTable } from "../components/Dashboard/RecognitionTable";
import { ShiftNotifications } from "../components/Dashboard/ShiftNotifications";
import { SurveyPoll } from "../components/Dashboard/SurveyPoll";
import TimeOffRequests from "../components/Dashboard/TimeOffRequests";

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
    {
      id: "6",
      name: "Jecy Cooper",
      role: "Project Manager",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      project: "Metro Shopping Center",
      shift: "Morning",
      date: "22/05/2025",
      time: "9:00am-5:00pm",
    },
  ];

  const timeOffRequests = [
    {
      id: "1",
      name: "Jane Cooper",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      type: "Doctor's appointment",
      date: "Mar 25, 2025",
      status: "pending",
    },
    {
      id: "2",
      name: "Jenny Wilson",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      type: "Sick leave",
      date: "Mar 30, 2025",
      status: "approved",
    },
    {
      id: "3",
      name: "Kristin Watson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      type: "Personal day",
      date: "Jun 02, 2025",
      status: "declined",
    },
  ];
  const handleApprove = (id: string) => {
    console.log("Dashboard approved request id:", id);
  };

  const handleDecline = (id: string) => {
    console.log("Dashboard declined request id:", id);
  };

  const chatMessages: ChatMessage[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "SJ",
      imageUrl: "https://randomuser.me/api/portraits/women/9.jpg",
      message: "Thanks for the project...",
      time: "2 min ago",
      unreadCount: 2,
      isActive: true,
    },
    {
      id: "2",
      name: "Emily Chen",
      avatar: "EC",
      imageUrl: "https://randomuser.me/api/portraits/women/15.jpg",
      message: "Thanks for the project...",
      time: "2 min ago",
      unreadCount: 2,
      isActive: true,
    },
    {
      id: "3",
      name: "Michael Davis",
      avatar: "MD",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      message: "Thanks for the project...",
      time: "2 min ago",
      unreadCount: 0,
      isActive: true,
    },
    {
      id: "4",
      name: "Jessica Wilson",
      avatar: "JW",
      imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      message: "Thanks for the project...",
      time: "2 min ago",
      unreadCount: 0,
      isActive: true,
    },
    {
      id: "5",
      name: "David Brown",
      avatar: "DB",
      imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      message: "Thanks for the project...",
      time: "2 min ago",
      unreadCount: 0,
      isActive: true,
    },
    {
      id: "6",
      name: "Lisa Anderson",
      avatar: "LA",
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      message: "Thanks for the project...",
      time: "2 min ago",
      unreadCount: 0,
      isActive: true,
    },
    {
      id: "7",
      name: "Robert Taylor",
      avatar: "RT",
      imageUrl: "https://randomuser.me/api/portraits/men/55.jpg",
      message: "Thanks for the project...",
      time: "2 min ago",
      unreadCount: 0,
      isActive: true,
    },
  ];

  const recognitions: Recognition[] = [
    {
      id: "1",
      from: "Team Members",
      avatar: "TM",
      type: "Team player",
      message: "Well-done team",
      viewer: "All",
    },
    {
      id: "2",
      from: "Floyd Miles",
      avatar: "FM",
      type: "Creative",
      message: "Innovative solution for client presentation",
      viewer: "Team A",
    },
    {
      id: "3",
      from: "Sarah Johnson",
      avatar: "SJ",
      type: "Leadership",
      message: "Excellent project management skills",
      viewer: "Management",
    },
    {
      id: "4",
      from: "Mike Chen",
      avatar: "MC",
      type: "Creative",
      message: "Outstanding design work",
      viewer: "Team B",
    },
    {
      id: "5",
      from: "Lisa Anderson",
      avatar: "LA",
      type: "Collaboration",
      message: "Great cross-team coordination",
      viewer: "All Teams",
    },
    {
      id: "6",
      from: "Sarah Johnson",
      avatar: "SJ",
      type: "Leadership",
      message: "Excellent project management skills",
      viewer: "Management",
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
    <div className="min-h-screen bg-gray-50 pt-4 w-full mx-auto">
      <div className="w-full mx-auto">
        <div className="w-full grid grid-cols-1 2xl:grid-cols-4 gap-0 2xl:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <QuickActions />
            <SurveyPoll />
            <EmployeeTable employees={employees} />
            <RecognitionTable recognitions={recognitions} />
            <MapLocation />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 w-full mx-auto">
            <Chat messages={chatMessages} />
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
