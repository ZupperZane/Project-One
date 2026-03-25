import useAuth from "../hooks/useAuth";

function Dashboard() {
  const { user, signOutUser } = useAuth();

  return (
    <section>
      <h2>Dashboard</h2>
      <p>Signed in as: {user?.email ?? user?.uid}</p>
      <button type="button" onClick={() => void signOutUser()}>
        Sign out
      </button>
    </section>
  );
}

export default Dashboard;
