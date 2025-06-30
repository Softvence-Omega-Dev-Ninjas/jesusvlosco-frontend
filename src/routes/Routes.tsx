import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import NotFound from "../pages/NotFound";

import Login from "@/pages/Login";

import Dashboard from "@/pages/Dashboard";

import { Chat } from "@/pages/Chats";
import Recognition from "@/pages/Recognition";

import { Communication } from "@/Layout/CommunicationLayout/Communication";

import Payroll from "@/Layout/UserLayout/Payroll";
import { UserLayout } from "@/Layout/UserLayout/UserLayout";
import UserOffDeatils from "@/Layout/UserLayout/UserOffDeatils";
import AddUserProfile from "@/pages/AddUserProfile";
import JobSchedulingLobby from "@/pages/JobSchedulingLobby";
import OverviewProject from "@/pages/OverviewProject";
import Schedule from "@/pages/Schedule";
import ShiftScheduling from "@/pages/ShiftScheduling";
import SidebarSetting from "@/pages/SidebarSetting";
import TimeClock from "@/pages/TimeClock";
import TimeOffRequest from "@/pages/TimeOffRequest";
import TimeSheet from "@/pages/TimeSheet";
import TimeSheets from "@/pages/TimeSheets";
import User from "@/pages/User";
import UserProfile from "@/pages/UserProfile";
import SurveyAndPoll from "@/pages/SurveyAndPoll";
import SurveyPage from "./SurveyPage";
import PollPage from "@/pages/PollPage";
import PublishSurvey from "@/pages/PublishSurvey";
import PublishPoll from "@/pages/PublishPoll";
import SurveyMainPage from "@/pages/SurveyMainPage";
import SurveyResponse from "@/pages/SurveyResponse";
import SurveyDetails from "@/pages/SurveyDetails";
import PollTemplate from "@/pages/PollTemplate";
import SurveyTemplate from "@/pages/SurveyTemplate";
import RecognitionTable from "@/pages/RecognitionTable";
import CreateRecognition from "@/pages/CreateRecognition";
import BadgeLibrary from "@/pages/BadgeLibrary";
import EditBadge from "@/pages/EditBadge";
import CreateBadge from "@/pages/CreateBadge";
import TaskAndProject from "@/pages/TaskAndProject";
import AdminLayout from "@/Layout/Admin/AdminLayout";
import UserDashboard from "@/pages/userpages/UserDashboard";
import UserCommunication from "@/pages/userpages/UserCommunication";
import UserRecognition from "@/pages/userpages/UserRecognition";
import UserChat from "@/pages/userpages/UserChat";
import UserSurvey from "@/pages/userpages/UserSurvey";



const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },


  // ✅ Admin routes grouped here
  {
    path: "/user",
    element: <UserDashboard></UserDashboard>,
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: "communication",
        element: <UserCommunication></UserCommunication>,
        children: [
          { index: true, element: <UserChat></UserChat> },
          { path: "userchat", element: <UserChat></UserChat> },
          { path: "user-recognition", element: <UserRecognition></UserRecognition> },
        ],

      },
      {
        path: "survey",
        element: <UserSurvey></UserSurvey>
      },
    ]
  },



  {
    path: "/admin",
    element: <AdminLayout />, // Admin shell with sidebar/header
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "communication",
        element: <Communication />,
        children: [
          { index: true, element: <Chat /> },
          { path: "chat", element: <Chat /> },
          { path: "recognition", element: <RecognitionTable /> },
        ],
      },
      { path: "send-recognition", element: <CreateRecognition /> },
      { path: "badge-library", element: <BadgeLibrary /> },
      { path: "edit-badge", element: <EditBadge /> },
      { path: "create-badge", element: <CreateBadge /> },

      {
        path: "schedule",
        element: <Schedule />,
        children: [
          { index: true, element: <JobSchedulingLobby /> },
          { path: "shiftschedule", element: <ShiftScheduling /> },
          { path: "overviewProjects", element: <OverviewProject /> },
          { path: "timeclock", element: <TimeClock /> },
          {
            path: "timesheet",
            element: <TimeSheet />,
            children: [
              { index: true, element: <TimeSheets /> },
              { path: "time", element: <TimeSheets /> },
              { path: "payroll", element: <Payroll /> },
            ],
          },
          { path: "useroffdetails", element: <UserOffDeatils /> },
          { path: "timeoffrequest", element: <TimeOffRequest /> },
        ],
      },

      { path: "survey-poll", element: <SurveyMainPage /> },
      { path: "survey-response", element: <SurveyResponse /> },
      { path: "survey-details", element: <SurveyDetails /> },
      {
        path: "survey-poll-page",
        element: <SurveyAndPoll />,
        children: [
          { index: true, element: <SurveyPage /> },
          { path: "survey", element: <SurveyPage /> },
          { path: "poll", element: <PollPage /> },
        ],
      },
      { path: "publish-survey", element: <PublishSurvey /> },
      {
        path: "survey-template",
        element: <SurveyTemplate onBackToPollCreation={() => { }} />,
      },
      { path: "publish-poll", element: <PublishPoll /> },
      {
        path: "poll-template",
        element: <PollTemplate onBackToPollCreation={() => { }} />,
      },

      { path: "tasks-projects", element: <TaskAndProject /> },

      {
        path: "user",
        element: <UserLayout />,
        children: [
          { index: true, element: <User /> },
          { path: "user", element: <Chat /> },
          { path: "user-profile", element: <UserProfile /> },
        ],
      },


      {

      },
      {
        path: "add-user",
        element: <AddUserProfile></AddUserProfile>,
      },
      {
        path: "sidebar-settings",
        element: <SidebarSetting></SidebarSetting>,
      },

      { path: "add-user", element: <AddUserProfile /> },
      { path: "sidebar-settings", element: <SidebarSetting /> },

    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
