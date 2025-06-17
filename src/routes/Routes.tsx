import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import NotFound from "../pages/NotFound";

import Login from "@/pages/Login";

import Dashboard from "@/pages/Dashboard";


import { Chat } from "@/pages/Chats";
import Recognition from "@/pages/Recognition";

import { Communication } from "@/Layout/CommunicationLayout/Communication";
import User from "@/Layout/UserLayout/UserLayout";


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
        path: "/user",
        element: <User></User>
      },

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
