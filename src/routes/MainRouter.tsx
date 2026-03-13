import type { RouteObject } from "react-router-dom";
import Root from "../layout/Root";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ErrorPage from "../pages/ErrorPage";

const mainRouter: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
];

export default mainRouter;
