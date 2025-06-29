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

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/communication",
        element: <Communication />,
        children: [
          {
            index: true,
            element: <Chat />,
          },
          {
            path: "chat",
            element: <Chat />,
          },
          {
            path: "recognition",
            element: <RecognitionTable></RecognitionTable>,
            // children: [


            // ]
          },

        ],

      },
      {
        path: 'send-recognition',
        element: <CreateRecognition></CreateRecognition>
      },
      {
        path: 'badge-library',
        element: <BadgeLibrary></BadgeLibrary>
      },
      {
        path: 'edit-badge',
        element: <EditBadge></EditBadge>
      },
      {
        path: '/create-badge',
        element: <CreateBadge></CreateBadge>
      },
      {
        path: "/schedule",
        element: <Schedule></Schedule>,

        children: [
          {
            path: "shiftschedule",
            element: <ShiftScheduling></ShiftScheduling>,
          },
          {
            index: true, // 👈 This is the default route for /schedule
            element: <JobSchedulingLobby></JobSchedulingLobby>,
          },
          {
            path: "overviewProjects",
            element: <OverviewProject></OverviewProject>,
          },
          {
            path: "timeclock",
            element: <TimeClock></TimeClock>,
          },
          {
            path: "timesheet",
            element: <TimeSheet />,
            children: [
              {
                index: true, // 👈 This is the default route for /timesheet
                element: <TimeSheets />,
              },
              {
                path: "time",
                element: <TimeSheets />,
              },
              {
                path: "payroll",
                element: <Payroll />,
              },
            ],
          },

          {
            path: "useroffdetails",
            element: <UserOffDeatils></UserOffDeatils>,
          },

          {
            path: "timeoffrequest",
            element: <TimeOffRequest></TimeOffRequest>,
          },

        ],
      },
      {
        path: '/survey-poll',
        element: <SurveyMainPage></SurveyMainPage>
      },

      {
        path: '/survey-response',
        element: <SurveyResponse></SurveyResponse>
      },
      {
        path: '/survey-details',
        element: <SurveyDetails></SurveyDetails>
      },
      {
        path: '/survey-poll-page',
        element: <SurveyAndPoll></SurveyAndPoll>,
        children: [
          {
            index: true,
            element: <SurveyPage></SurveyPage>
          },
          {
            path: 'survey',
            element: <SurveyPage></SurveyPage>
          },
          {
            path: 'poll',
            element: <PollPage></PollPage>
          },
        ]
      },
      {
        path: '/publish-survey',
        element: <PublishSurvey />
      },
      {
        path: '/survey-template',
        element: <SurveyTemplate onBackToPollCreation={() => { /* handle navigation or logic here */ }} />
      },
      {
        path: '/publish-poll',
        element: <PublishPoll></PublishPoll>
      },
      {
        path: '/poll-template',
        element: <PollTemplate onBackToPollCreation={() => { /* handle navigation or logic here */ }} />
      },

      {
        path: '/tasks-projects',
        element: <TaskAndProject></TaskAndProject>
      },


      {
        path: "/user",
        element: <UserLayout></UserLayout>,
        children: [
          {
            index: true,
            element: <User></User>,
          },
          {
            path: "user",
            element: <Chat />,
          },
          {
            path: "user-profile",
            element: <UserProfile></UserProfile>,
          },

        ],
      },

      {

      },
      {
        path: "/add-user",
        element: <AddUserProfile></AddUserProfile>,
      },
      {
        path: "/sidebar-settings",
        element: <SidebarSetting></SidebarSetting>,
       },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
