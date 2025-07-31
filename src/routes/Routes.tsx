import { createBrowserRouter } from "react-router-dom";

import NotFound from "../pages/NotFound";

import Login from "@/pages/Login";

import Dashboard from "@/pages/Dashboard";

import { Chat } from "@/pages/Chats";

import { Communication } from "@/Layout/CommunicationLayout/Communication";

import AdminLayout from "@/Layout/Admin/AdminLayout";
import Payroll from "@/Layout/UserLayout/Payroll";
import { UserLayout } from "@/Layout/UserLayout/UserLayout";
import UserOffDeatils from "@/Layout/UserLayout/UserOffDeatils";
import AddUserProfile from "@/pages/AddUserProfile";
import BadgeLibrary from "@/pages/BadgeLibrary";
import CreateBadge from "@/pages/CreateBadge";
import CreateRecognition from "@/pages/CreateRecognition";
import EditBadge from "@/pages/EditBadge";
import JobSchedulingLobby from "@/pages/JobSchedulingLobby";
import OverviewProject from "@/pages/OverviewProject";
import PollPage from "@/pages/PollPage";
import PollTemplate from "@/pages/PollTemplate";
import PublishPoll from "@/pages/PublishPoll";
import PublishSurvey from "@/pages/PublishSurvey";
import RecognitionTable from "@/pages/RecognitionTable";
import Schedule from "@/pages/Schedule";
import ShiftScheduling from "@/pages/ShiftScheduling";
import SidebarSetting from "@/pages/SidebarSetting";
import SurveyAndPoll from "@/pages/SurveyAndPoll";
import SurveyDetails from "@/pages/SurveyDetails";
import SurveyMainPage from "@/pages/SurveyMainPage";
import SurveyResponse from "@/pages/SurveyResponse";
import SurveyTemplate from "@/pages/SurveyTemplate";
import TaskAndProject from "@/pages/TaskAndProject";

import TimeOffRequest from "@/pages/TimeOffRequest";
import TimeSheet from "@/pages/TimeSheet";
import TimeSheets from "@/pages/TimeSheets";
import User from "@/pages/User";
import UserDashboard from "@/pages/userpages/UserDashboard";
import UserProfile from "@/pages/UserProfile";
import SurveyPage from "./SurveyPage";

import UserMain from "@/Layout/User/UserMain";
import ShiftSchedulingProjectDetails from "@/pages/userpages/ShiftSchedulingProjectDetails";
import TakeSurvey from "@/pages/userpages/TakeSurvey";
import UserChat from "@/pages/userpages/UserChat";
import UserChatSetting from "@/pages/userpages/UserChatSetting";
import { UserCommunication } from "@/pages/userpages/UserCommunication";
import UserNotification from "@/pages/userpages/UserNotification";
import UserPageProfile from "@/pages/userpages/UserPageProfile";
import UserPoll from "@/pages/userpages/UserPoll";
import UserRecognition from "@/pages/userpages/UserRecognition";
import UserShiftScheduling from "@/pages/userpages/UserShiftScheduling";
import UserSurvey from "@/pages/userpages/UserSurvey";
import UserTaskDetails from "@/pages/userpages/UserTaskDetails";
import UserTaskMainPage from "@/pages/userpages/UserTaskMainPage";
import UserTimeClock from "@/pages/userpages/UserTimeClock";
import UserTimeOffRequests from "@/pages/userpages/UserTimeOffRequests";
import EmailLogin from "@/pages/email-login/EmailLogin";
// import EmailLogin from "@/pages/EmailLogin";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/email-login",
    element: <EmailLogin />,
  },

  // ✅ Admin routes grouped here
  {
    path: "/user",
    element: <UserMain></UserMain>,
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
          {
            path: "user-recognition",
            element: <UserRecognition></UserRecognition>,
          },
        ],
      },
      {
        path: "user-notification",
        element: <UserNotification></UserNotification>,
      },
      {
        path: "user-profile",
        element: <UserPageProfile></UserPageProfile>,
      },
      {
        path: "user-schedule",
        element: <Schedule />,
        children: [
          {
            path: "user-shiftschedule",
            element: <UserShiftScheduling></UserShiftScheduling>,
          },
          {
            path: "user-overviewProjects/:id",
            element: (
              <ShiftSchedulingProjectDetails></ShiftSchedulingProjectDetails>
            ),
          },
          { path: "user-timeclock", element: <UserTimeClock /> },

          {
            path: "user-timeoffrequest",
            element: <UserTimeOffRequests></UserTimeOffRequests>,
          },
        ],
      },
      {
        path: "user-chat-setting",
        element: <UserChatSetting></UserChatSetting>,
      },
      {
        path: "survey",
        element: <UserSurvey></UserSurvey>,
      },
      {
        path: "take-survey/:id",
        element: <TakeSurvey></TakeSurvey>,
      },

      {
        path: "poll",
        element: <UserPoll></UserPoll>,
      },

      {
        path: "user-task",
        element: <UserTaskMainPage></UserTaskMainPage>,
      },

      // dynamic routes
      {
        path: "user-task-details",
        element: <UserTaskDetails></UserTaskDetails>,
      },
    ],
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

          { path: "shiftschedule", element: <JobSchedulingLobby /> },
          //dynamic routes
          { path: "overviewProjects/:id", element: <OverviewProject /> },
          // { path: "timeclock", element: <TimeClock /> },
          {
            path: 'shift-scheduling',
            element: <ShiftScheduling />
          },
          {
            path: "timesheet",
            element: <TimeSheet />,
            children: [
              { index: true, element: <TimeSheets /> },
              { path: "time", element: <TimeSheets /> },
              { path: "payroll", element: <Payroll /> },
            ],
          },
          // dynamic
          { path: "useroffdetails", element: <UserOffDeatils /> },
          { path: "timeoffrequest", element: <TimeOffRequest /> },
        ],
      },

      { path: "survey-poll", element: <SurveyMainPage /> },
      { path: "survey-response", element: <SurveyResponse /> },
      { path: "survey-details/", element: <SurveyDetails /> },
      // dynamic
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

      {},
      {
        path: "add-user",
        element: <AddUserProfile></AddUserProfile>,
      },
      {
        path: "sidebar-settings",
        element: <SidebarSetting></SidebarSetting>,
      },

      { path: "add-user", element: <AddUserProfile /> },
      // { path: "sidebar-settings", element: <SidebarSetting /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
