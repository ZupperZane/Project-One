import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./Pages/Home"

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>}/>
        </Routes>
  )
}
