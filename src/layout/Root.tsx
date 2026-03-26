import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Root() {
  const { user, loading, firebaseConfigured } = useAuth();

  return (
    <main>
      <h1>Auth Skeleton</h1>
      <p>
        Status: {loading ? "loading" : user ? "authenticated" : "guest"} | Firebase: {firebaseConfigured ? "configured" : "not configured"}
      </p>
      <nav style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>

        {/*Home Button*/}
        <Link to="/" className="btn btn-neutral">
          Home
        </Link>

        {/*Login Button*/}
        <Link to="/login" className="btn btn-neutral">
          Login
        </Link>

        {/*Dashboard Button*/}
        <Link to="/dashboard" className="btn btn-neutral">
          Dashboard
        </Link>

      </nav>
      <Outlet />
    </main>
  );
}

export default Root;
