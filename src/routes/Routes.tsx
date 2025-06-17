import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import NotFound from "../pages/NotFound";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";

import User from "@/pages/User";
import { Chat } from "@/pages/Chats";
import Recognition from "@/pages/Recognition";
import { CompanyUpdate } from "@/pages/CompanyUpdate";
import { Communication } from "@/pages/Communication";


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
        element: <Communication />, // Parent layout component for Chat & Community
        children: [
          {
            index: true, // Default child route for /communication (e.g., show chat by default)
            element: <Chat />
          },
          {
            path: "chat", // Full path: /communication/chat
            element: <Chat />
          },
          {
            path: "recognition", // Full path: /communication/community
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
