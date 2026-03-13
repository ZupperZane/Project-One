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
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Outlet />
    </main>
  );
}

export default Root;
