<<<<<<< HEAD
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import mainRouter from "./routes/MainRouter";

const router = createBrowserRouter(mainRouter);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
=======
import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./Pages/Home"
import { Messages } from "./Pages/Messages";
import { Login } from "./Pages/Login";
import { Tasks } from "./Pages/Tasks";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>}/>
                <Route path="/Messages" element={<Messages/>}/>
                        <Route path="/Login" element={<Login/>}/>
                                <Route path="/Tasks" element={<Tasks/>}/>
        </Routes>
  )
}
>>>>>>> origin/weather
