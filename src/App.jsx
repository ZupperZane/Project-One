import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainRouter from "./routes/MainRouter";

const router = createBrowserRouter(MainRouter);

function App() {
  return <RouterProvider router={router} />;
}

export default App;