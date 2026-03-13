import Home from "../components/Home";
import Root from "../layout/Root";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import ErrorPage from "../components/pages/ErrorPage";
import PrivateRoute from "./PrivateRoute";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Home },
      { path: "signup", Component: SignUp },
      { path: "login", Component: Login },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
  },
];

export default MainRouter;