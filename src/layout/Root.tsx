import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

function Root() {
  const { user, loading, firebaseConfigured, signOutUser } = useAuth();

  return (
    <main>
      <h1>Globo Chat Skeleton</h1>
      <p>
        Status: {loading ? "loading" : user ? "authenticated" : "guest"} | Firebase: {firebaseConfigured ? "configured" : "not configured"}
      </p>
      <nav style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {user ? (
          <>
            <Link to={ROUTES.HOME}>Home</Link>
            <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
            <Link to={ROUTES.CHAT}>Chat</Link>
            <Link to={ROUTES.TASKS}>To-Do</Link>
            <Link to={ROUTES.CALENDAR}>Calendar</Link>
            <Link to={ROUTES.SITES}>Saved Sites</Link>
            <button type="button" onClick={() => void signOutUser()}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LANDING}>Landing</Link>
            <Link to={ROUTES.LOGIN}>Login</Link>
            <Link to={ROUTES.SIGNUP}>Signup</Link>
          </>
        )}
      </nav>
      <Outlet />
    </main>
  );
}

export default Root;
