<<<<<<< HEAD
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
>>>>>>> origin/weather

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AuthProvider from "./contexts/AuthProvider";
import "./index.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
<<<<<<< HEAD
    <AuthProvider>
            <App />
    </AuthProvider>
  </StrictMode>
);
=======
        <BrowserRouter>
            <App />
        </BrowserRouter>
  </StrictMode>,
)
>>>>>>> origin/weather
