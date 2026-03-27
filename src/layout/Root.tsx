import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { ROUTES, ROLES } from "../utils/constants";
import ProfileSetup from "../Components/ProfileSetup";

// Use displayName if it's been set properly, otherwise fall back to role label.
function resolveDisplayName(name: string | undefined, role: string | undefined) {
  if (name && name !== "User") return name;
  return role === ROLES.PRIMARY ? "Olivia" : "Emma";
}

function Root() {
  const { user, loading, firebaseConfigured, signOutUser } = useAuth();
  const { canToggle, isViewingLinked, linkedProfile, ownProfile, toggle } = useActiveProfile();

  const ownName = resolveDisplayName(ownProfile?.displayName, ownProfile?.role);
  const linkedName = resolveDisplayName(linkedProfile?.displayName, linkedProfile?.role);

  return (
    <main>
      <h1>Globo Chat</h1>
      <p>
        Status: {loading ? "loading" : user ? "authenticated" : "guest"} | Firebase: {firebaseConfigured ? "configured" : "not configured"}
      </p>
      <nav style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
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
      {ownProfile && !ownProfile.linkedUserId && <ProfileSetup profile={ownProfile} />}
      {isViewingLinked && (
        <p style={{ background: "#fff3cd", border: "1px solid #ffc107", color: "#333", padding: "0.5rem 1rem", marginBottom: "1rem" }}>
          Managing {linkedName}&apos;s account — your changes affect their data.
        </p>
      )}
      <Outlet />
    </main>
  );
}

export default Root;
