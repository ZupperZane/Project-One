import type { RouteObject } from "react-router-dom";
import Root from "../layout/Root";
import PrivateRoute from "./PrivateRoute";
import { ROUTES } from "../utils/constants";

import Dashboard from "../pages/Dashboard";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ErrorPage from "../pages/ErrorPage";
import Chat from "../pages/Chat";
import { Tasks } from "../pages/Tasks";
import Calendar from "../pages/Calendar";
import SavedSites from "../pages/SavedSites";

const mainRouter: RouteObject[] = [
  {
    path: ROUTES.LANDING,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.SIGNUP,
        element: <Signup />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.HOME,
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.CHAT,
        element: (
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.TASKS,
        element: (
          <PrivateRoute>
            <Tasks />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.CALENDAR,
        element: (
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.SITES,
        element: (
          <PrivateRoute>
            <SavedSites />
          </PrivateRoute>
        ),
      },
    ],
  },
];

export default mainRouter;
