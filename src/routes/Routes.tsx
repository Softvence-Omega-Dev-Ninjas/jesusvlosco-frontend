import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import NotFound from "../pages/NotFound";

import Login from "@/pages/Login";

import Dashboard from "@/pages/Dashboard";


import { Chat } from "@/pages/Chats";
import Recognition from "@/pages/Recognition";

import { Communication } from "@/Layout/CommunicationLayout/Communication";

import UserProfile from "@/pages/UserProfile";
import { UserLayout } from "@/Layout/UserLayout/UserLayout";
import User from "@/pages/User";
import Schedule from "@/pages/Schedule";
import ShiftScheduling from "@/pages/ShiftScheduling";
import TimeClock from "@/pages/TimeClock";
import TimeSheet from "@/pages/TimeSheet";
import TimeOffRequest from "@/pages/TimeOffRequest";
import JobSchedulingLobby from "@/pages/JobSchedulingLobby";
import OverviewProject from "@/pages/OverviewProject";
import TimeSheets from "@/pages/TimeSheets";
import Payroll from "@/Layout/UserLayout/Payroll";
import UserOffDeatils from "@/Layout/UserLayout/UserOffDeatils";
import SidebarSetting from "@/pages/SidebarSetting";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [



      {
        path: "/",
        element: <Dashboard></Dashboard>
      },
      {
        path: "/communication",
        element: <Communication />,
        children: [
          {
            index: true,
            element: <Chat />
          },
          {
            path: "chat",
            element: <Chat />
          },
          {
            path: "recognition",
            element: <Recognition></Recognition>
          }
        ]
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
                element: <TimeSheets />
              },
              {
                path: "time",
                element: <TimeSheets />
              },
              {
                path: "payroll",
                element: <Payroll />
              }
            ]
          },

          {
            path: 'useroffdetails',
            element: <UserOffDeatils></UserOffDeatils>
          },

          {
            path: "timeoffrequest",
            element: <TimeOffRequest></TimeOffRequest>,
          },
        ]

      },
      {

      },

      {
        path: "/user",
        element: <UserLayout></UserLayout>,
        children: [
          {
            index: true,
            element: <User></User>
          },
          {
            path: "user",
            element: <Chat />
          },
          {
            path: "user-profile",
            element: <UserProfile></UserProfile>
          },
        ]
      },
      {
        path: '/sidebar-settings',
        element: <SidebarSetting></SidebarSetting>
      }

    ],
  },
  {
    path: "/login",
    element: <Login></Login>
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
