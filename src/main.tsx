
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AuthProvider from "./contexts/AuthProvider";
import { COLLECTIONS } from "./backend/storage";
import "./index.css";
import "./App.css"

const BUILD_MARKER = "PROJECTONE_FIRESTORE_UPPERCASE_V2";
console.info(BUILD_MARKER, COLLECTIONS);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
