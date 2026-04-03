import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Weather from "../Components/Weather";
import { DeleteEvent, ListEvents } from "../backend/eventHandler";
import { ListUsers } from "../backend/userHandler";
import type { EventRecord } from "../backend/storage";
import { ROLES, ROUTES } from "../utils/constants";
import { useActiveProfile } from "../hooks/useActiveProfile";

function Home() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const { activeUserId, ownProfile, loading } = useActiveProfile();
  const profile = ownProfile;
  const canDelete = ownProfile?.role === ROLES.SUPPORTIVE;
  const actionCards = [
    {
      to: ROUTES.CHAT,
      title: "Messages",
      hint: "Read and send messages.",
      btnClass: "btn-primary",
    },
    {
      to: ROUTES.TASKS,
      title: "Tasks",
      hint: "See tasks and mark them done.",
      btnClass: "btn-secondary",
    },
    {
      to: ROUTES.CALENDAR,
      title: "Calendar",
      hint: "Check events for each day.",
      btnClass: "btn-accent",
    },
    {
      to: ROUTES.SITES,
      title: "Saved Sites",
      hint: "Open favorite websites.",
      btnClass: "btn-warning",
    },
  ];

  const resolvePosterName = (posterId: string) => {
    if (!posterId || posterId === "system") return "System";
    if (profile && posterId === profile.uid) return `${profile.displayName || profile.email || "You"} (You)`;
    return userNames[posterId] ?? posterId;
  };

  const handleDelete = async (event: EventRecord) => {
    try {
      setError("");
      await DeleteEvent(event.id);
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      window.dispatchEvent(new Event("events:changed"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete event.");
    }
  };

  useEffect(() => {
    if (!activeUserId) return;

    const loadEvents = async () => {
      try {
        setError("");
        const all = await ListEvents();
        const visible = all.filter(
          (e) =>
            e.createdBy === activeUserId ||
            e.createdBy === "system" ||
            e.sharedWith.includes(activeUserId)
        );
        setEvents(visible.slice(0, 5));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load events.";
        setError(message);
      }
    };

    void loadEvents();
    window.addEventListener("events:changed", loadEvents);
    return () => window.removeEventListener("events:changed", loadEvents);
  }, [activeUserId]);

  useEffect(() => {
    if (!activeUserId) return;
    const loadUsers = async () => {
      try {
        const allUsers = await ListUsers();
        setUserNames(Object.fromEntries(
          allUsers.map((entry) => [entry.id, entry.displayName || entry.email || entry.id])
        ));
      } catch {
        setUserNames({});
      }
    };
    void loadUsers();
  }, [activeUserId]);

   if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="text-base-content/60">Please log in to continue.</p>
        <Link to={ROUTES.LOGIN} className="btn btn-primary text-xl w-1/2">
          Login
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl bg-base-200 p-5">
        <h2 className="text-3xl font-bold">Home</h2>
        <p className="mt-2 text-lg">
          Choose one button below. Each button opens one part of the app.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {actionCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`btn ${card.btnClass} h-auto min-h-28 flex-col items-start gap-1 rounded-xl px-5 py-4 text-left`}
          >
            <span className="text-2xl font-extrabold">{card.title}</span>
            <span className="text-base font-medium">{card.hint}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-base-300 p-4">
          <h3 className="mb-2 text-2xl font-bold">Weather</h3>
          <Weather />
        </div>

        <div className="rounded-xl bg-base-200 p-4">
          <h3 className="mb-2 text-2xl font-bold">Recent Events</h3>
          {events.length === 0 ? <p className="text-lg">No recent events yet.</p> : null}
          <ul className="space-y-2 text-lg">
            {events.map((event) => (
              <li key={event.id} className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold">{event.name}</span>
                  <span className="block text-sm opacity-80">Added by: {resolvePosterName(event.createdBy)}</span>
                </div>
                {canDelete && (
                  <button
                    type="button"
                    className="btn btn-error btn-xs shrink-0"
                    onClick={() => void handleDelete(event)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
          {error ? <p className="mt-2 text-error">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}

export default Home;
