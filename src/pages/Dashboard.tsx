import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { UpdateUserDisplayName } from "../backend/userHandler";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

function Dashboard() {
  const { user, signOutUser, updateUserProfile } = useAuth();
  const [displayNameInput, setDisplayNameInput] = useState(user?.displayName?.trim() || "");
  const [savingName, setSavingName] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const displayName = user?.displayName?.trim() || "Account User";
  const email = user?.email || "No email available";
  const userId = user?.uid || "Unavailable";

  useEffect(() => {
    setDisplayNameInput(user?.displayName?.trim() || "");
  }, [user]);

  const handleDisplayNameSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!user) {
      setError("You must be logged in to update your display name.");
      return;
    }

    const nextName = displayNameInput.trim();
    if (!nextName) {
      setError("Display name cannot be empty.");
      return;
    }

    try {
      setSavingName(true);
      await updateUserProfile({ displayName: nextName });
      await UpdateUserDisplayName({
        userId: user.uid,
        displayName: nextName,
        email: user.email ?? undefined,
      });
      setNotice("Display name updated.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update display name.";
      setError(message);
    } finally {
      setSavingName(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-xl bg-base-200 p-6">
        <h2 className="text-4xl font-extrabold">Account</h2>
        <p className="mt-2 text-lg">Manage your sign-in details and account actions.</p>
      </div>

      <div className="rounded-xl bg-base-100 p-5">
        <h3 className="text-2xl font-bold">Your information</h3>
        <dl className="mt-3 space-y-2 text-lg">
          <div>
            <dt className="font-semibold">Name</dt>
            <dd>{displayName}</dd>
          </div>
          <div>
            <dt className="font-semibold">Email</dt>
            <dd>{email}</dd>
          </div>
          <div>
            <dt className="font-semibold">User ID</dt>
            <dd className="break-all text-base">{userId}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleDisplayNameSave} className="rounded-xl bg-base-100 p-5">
        <h3 className="text-2xl font-bold">Display name</h3>
        <p className="mt-1 text-base">This name appears in messages, tasks, and other shared items.</p>
        <label htmlFor="display-name" className="mt-3 block text-lg font-semibold">
          Name
        </label>
        <input
          id="display-name"
          className="input input-bordered mt-2 w-full text-lg"
          type="text"
          value={displayNameInput}
          onChange={(event) => setDisplayNameInput(event.target.value)}
          placeholder="Type your display name"
          required
        />
        <button type="submit" className="btn btn-primary mt-4 w-full text-lg" disabled={savingName}>
          {savingName ? "Saving..." : "Save Display Name"}
        </button>
        {notice ? <p className="mt-2 text-success font-semibold">{notice}</p> : null}
        {error ? <p className="mt-2 text-error font-semibold">{error}</p> : null}
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to={ROUTES.HOME}
          className="btn btn-primary h-auto min-h-24 flex-col items-start rounded-xl px-5 py-4 text-left"
        >
          <span className="text-2xl font-extrabold">Go to Home</span>
          <span className="text-base font-medium">Return to the main menu</span>
        </Link>

        <Link
          to={ROUTES.RESET_PASSWORD}
          className="btn btn-secondary h-auto min-h-24 flex-col items-start rounded-xl px-5 py-4 text-left"
        >
          <span className="text-2xl font-extrabold">Reset Password</span>
          <span className="text-base font-medium">Send yourself a reset email</span>
        </Link>
      </div>

      <div className="rounded-xl bg-base-100 p-5">
        <button type="button" className="btn btn-error w-full text-xl" onClick={() => void signOutUser()}>
          Log Out
        </button>
      </div>
    </section>
  );
}

export default Dashboard;
