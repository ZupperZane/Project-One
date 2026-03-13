import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./contexts/AuthProvider.jsx";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    <ToastContainer position="bottom-right" autoClose={2000} />
    </AuthProvider>

  </StrictMode>
);
