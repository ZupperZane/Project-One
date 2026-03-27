import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { ROUTES, ROLES } from "../utils/constants";
import ProfileSetup from "../Components/ProfileSetup";
import "../Root.css";

function resolveDisplayName(name: string | undefined, role: string | undefined) {
  if (name && name !== "User") return name;
  return role === ROLES.PRIMARY ? "Olivia" : "Emma";
}

function Root() {
  const { user, loading, signOutUser } = useAuth();
  const { canToggle, isViewingLinked, linkedProfile, ownProfile, toggle } = useActiveProfile();

  const linkedName = resolveDisplayName(linkedProfile?.displayName, linkedProfile?.role);

  return (
    <main>
      <header className="root-header">
        <span className="root-brand">Globo Life</span>
        <span className="root-status">
          {loading ? "loading" : user ? `Signed in as: ${user?.email ?? user?.uid}` : "guest"}
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
            <Link to={ROUTES.SITES}>Saved Sites</Link>
            {canToggle && (
              <button type="button" onClick={toggle}>
                {isViewingLinked ? "Switch to Yourself" : `Switch to ${linkedName}`}
              </button>
            )}
            <button type="button" onClick={() => void signOutUser()}>Logout</button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LANDING}>Landing</Link>
            <Link to={ROUTES.LOGIN}>Login</Link>
            <Link to={ROUTES.SIGNUP}>Signup</Link>
          </>
        )}
      </nav>

      {ownProfile && !ownProfile.linkedUserId && <ProfileSetup profile={ownProfile} />}
      {isViewingLinked && (
        <p style={{ background: "#fff3cd", border: "1px solid #ffc107", color: "#333", padding: "0.5rem 1rem", marginBottom: "1rem" }}>
          Managing {linkedName}&apos;s account — your changes affect their data.
        </p>
      )}

      <div className="root-content">
        <Outlet />
      </div>
    </main>
  );
}

export default Root;
