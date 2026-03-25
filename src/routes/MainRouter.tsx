import type { RouteObject } from "react-router-dom";
import Root from "../layout/Root";
import PrivateRoute from "./PrivateRoute";
import { ROUTES } from "../utils/constants";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import ErrorPage from "../Pages/ErrorPage";
import { Messages } from "../Pages/Messages";
import { Tasks } from "../Pages/Tasks";

// These pages don't exist yet — stubs will be added by their owners.
// Uncomment each line as the page is created.
// import Calendar from "../Pages/Calendar";
// import Sites from "../Pages/Sites";
// import PasswordRecovery from "../Pages/PasswordRecovery";

const mainRouter: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      // {
      //   path: ROUTES.RESET_PASSWORD,
      //   element: <PasswordRecovery />,
      // },
      {
        path: ROUTES.DASHBOARD,
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
      {
        path: ROUTES.MESSAGES,
        element: <PrivateRoute><Messages /></PrivateRoute>,
      },
      {
        path: ROUTES.TASKS,
        element: <PrivateRoute><Tasks /></PrivateRoute>,
      },
      // {
      //   path: ROUTES.CALENDAR,
      //   element: <PrivateRoute><Calendar /></PrivateRoute>,
      // },
      // {
      //   path: ROUTES.SITES,
      //   element: <PrivateRoute><Sites /></PrivateRoute>,
      // },
    ],
  },
];

export default mainRouter;
