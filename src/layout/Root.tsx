import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";
import "../Root.css";

function Root() {
  const { user, loading, signOutUser } = useAuth();

  return (
    <main>
      <header className="root-header">
        <span className="root-brand">Globo Chat</span>
        <span className="root-status">
          {loading ? "loading" : user ? `Signed in as: ${user?.email ?? user?.uid}`  : "guest"} 
        </span>
      </header>

      <nav className="root-nav">
        {user ? (
          <>
            <Link to={ROUTES.HOME}>Home</Link>
            <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
            <Link to={ROUTES.CHAT}>Chat</Link>
            <Link to={ROUTES.TASKS}>To-Do</Link>
            <Link to={ROUTES.CALENDAR}>Calendar</Link>
            <Link to={ROUTES.SITES}>Sites</Link>
            <button type="button" onClick={() => void signOutUser()}>Logout</button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LANDING} >Landing</Link>
            <Link to={ROUTES.LOGIN} >Login</Link>
            <Link to={ROUTES.SIGNUP} >Signup</Link>
          </>
        )}
      </nav>

      <div className="root-content">
        <Outlet />
      </div>
    </main>
  );
}

export default Root;
