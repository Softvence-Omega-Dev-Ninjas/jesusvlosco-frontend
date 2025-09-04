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
import OverviewProject from "@/pages/OverviewProject";
import PollPage from "@/pages/PollPage";
import PollTemplate from "@/pages/PollTemplate";
// import PublishPoll from "@/pages/PublishPoll";
import PublishSurvey from "@/pages/PublishSurvey";
import RecognitionTable from "@/pages/RecognitionTable";
import Schedule from "@/pages/Schedule";
import ShiftScheduling from "@/pages/ShiftScheduling";
import SidebarSetting from "@/pages/SidebarSetting";
import SurveyAndPoll from "@/pages/SurveyAndPoll";
import SurveyDetails from "@/pages/SurveyDetails";
import SurveyMainPage from "@/pages/SurveyAndPoll/SurveyMainPage";
import SurveyResponse from "@/pages/SurveyResponse";
import SurveyTemplate from "@/pages/SurveyTemplate";
// import TaskAndProject from "@/pages/TaskAndProject/";

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
// import UserTaskDetails from "@/pages/userpages/UserTaskDetails";
import UserTaskMainPage from "@/pages/UserTaskAndProjects/UserTaskMainPage";
import UserTimeClock from "@/pages/userpages/UserTimeClock";
import UserTimeOffRequests from "@/pages/userpages/UserTimeOffRequests";
import EmailLogin from "@/pages/email-login/EmailLogin";

import CreateTeam from "@/pages/Admin/CreateTeam";

// import TaskAndProject from "../pages/TaskAndProject/TaskAndProject";
import TasksAndProjects from "@/pages/TasksAndProjects/TasksAndProjects";
import AdminRoute from "./AdminRoutes";
import ScheduleAssignPage from "@/pages/ScheduleAssignPage";
import ShiftSchedule from "@/pages/userpages/ShiftSchedule";
// import EmailLogin from "@/pages/EmailLogin";
import UserTaskDetails from "@/pages/UserTaskAndProjects/UserTaskDetails";
import SurveyStatisticsPage from "@/pages/SurveyAndPoll/SurveyStatisticsPage";
import PollStatisticsPage from "@/pages/SurveyAndPoll/PollStatisticsPage";
import ManageTeams from "@/pages/Admin/team-management/ManageTeams";
import ClockInRequest from "@/pages/ClockInRequest/ClockInRequest";
import SingleUserSheet from "@/Layout/UserLayout/SingleUserSheet";
import UserClockInRequest from "@/pages/ClockInRequest/UserClockInRequest";
import OvertimeRequest from "@/pages/OvertimeRequest/OvertimeRequest";
import EmployeeRoutes from "./EmployeeRoutes";
// import UserTaskDetails from "@/pages/UserTaskAndProjects/UserTaskDetails";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <EmailLogin />,
  },
  {
    path: "/email-login",
    element: <Login />,
  },

  // ✅ Admin routes grouped here
  {
    path: "/user",
    element:<EmployeeRoutes> <UserMain></UserMain></EmployeeRoutes>,
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
            path: "user-shift-schedule",
            element: <ShiftSchedule />,
          },
          {
            path: "user-shift-schedule/:id",
            element: <UserShiftScheduling></UserShiftScheduling>,
          },
          {
            path: "user-overviewProjects/:id",
            element: <ShiftSchedulingProjectDetails></ShiftSchedulingProjectDetails>,
          },
          { path: "user-timeclock", element: <UserTimeClock /> },

          {
            path: "user-timeoffrequest",
            element: <UserTimeOffRequests></UserTimeOffRequests>,
          },
          {
            path: "user-clock-in-request",
            element: <UserClockInRequest />,
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
        path: "take-survey/:id/assigned",
        element: <TakeSurvey></TakeSurvey>,
      },

      {
        path: "take-pool/:id/assigned",
        element: <UserPoll></UserPoll>,
      },

      {
        path: "user-task",
        element: <UserTaskMainPage></UserTaskMainPage>,
      },
      {
        path: "user-task/:id",
        element: <UserTaskDetails />,
      },

      // dynamic routes
      // {
      //   path: "user-task-details",
      //   element: <UserTaskDetails></UserTaskDetails>,
      // },
    ],
  },

  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ), // Admin shell with sidebar/header
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
      { path: "edit-badge/:id", element: <EditBadge /> },
      { path: "create-badge", element: <CreateBadge /> },

      {
        path: "schedule",
        element: <Schedule />,
        children: [
          // { path: "shiftschedule", element: <JobSchedulingLobby /> },
          { path: "shiftschedule", element: <ScheduleAssignPage /> },
          //dynamic routes
          { path: "overviewProjects/:id", element: <OverviewProject /> },
          // { path: "timeclock", element: <TimeClock /> },
          {
            path: "shift-scheduling/:id",
            element: <ShiftScheduling />,
          },
          {
            path: "timesheet",
            element: <TimeSheet />,
            children: [
              { index: true, element: <TimeSheets /> },
              { path: "time", element: <TimeSheets /> },
              { path: "payroll", element: <Payroll /> },
              { path: "payroll/:id", element: <SingleUserSheet /> },
            ],
          },
          // dynamic
          { path: "useroffdetails", element: <UserOffDeatils /> },
          { path: "timeoffrequest", element: <TimeOffRequest /> },
          { path: "clock-in-request", element: <ClockInRequest /> },
          { path: "overtime-request", element: <OvertimeRequest /> },
        ],
      },

      {
        path: "survey-poll",
        element: <SurveyMainPage />,
        // children: [{ path: "survey", element: <SurveyPage /> }],
      },
      { path: "poll-analytics", element: <PollStatisticsPage /> },
      { path: "survey-analytics", element: <SurveyStatisticsPage /> },
      { path: "create-team", element: <CreateTeam /> },
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
        element: <SurveyTemplate onBackToPollCreation={() => {}} />,
      },
      { path: "publish-poll", element: <PublishSurvey /> },
      {
        path: "poll-template",
        element: <PollTemplate onBackToPollCreation={() => {}} />,
      },

      { path: "tasks-projects", element: <TasksAndProjects /> },
      // { path: "user", element: <TaskAndProject /> },

      {
        path: "user",
        element: <UserLayout />,
        children: [
          { index: true, element: <User /> },
          { path: "user", element: <Chat /> },
          { path: "user-profile/:id", element: <UserProfile /> },
        ],
      },

      {
        path: "manage-teams",
        element: <ManageTeams />,
      },
      {
        path: "add-user",
        element: <AddUserProfile></AddUserProfile>,
      },
      {
        path: "sidebar-settings",
        element: <SidebarSetting></SidebarSetting>,
      },

      // { path: "add-user", element: <AddUserProfile /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
