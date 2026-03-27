import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Weather from "../Components/Weather";
import { ListEvents } from "../backend/eventHandler";
import type { EventRecord } from "../backend/storage";
import { ROUTES } from "../utils/constants";
import { useUserProfile } from "../hooks/useUserProfile";

function Home() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [error, setError] = useState("");
  const { profile, loading } = useUserProfile();

  useEffect(() => {
    if (!profile) return;

    const loadEvents = async () => {
      try {
        setError("");
        const existingEvents = await ListEvents();
        setEvents(existingEvents.slice(0, 5));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load events.";
        setError(message);
      }
    };

    void loadEvents();

    const onEventsChanged = () => {
      void loadEvents();
    };

    window.addEventListener("events:changed", onEventsChanged);
    return () => {
      window.removeEventListener("events:changed", onEventsChanged);
    };
  }, [profile]);

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
    <div className="h-auto w-full flex flex-col items-center gap-14 margin-auto">
      <div className="flex items-center justify-center w-full h-25">
        <Link to={ROUTES.CHAT} className="btn btn-primary text-2xl font-bold w-3/4 h-full">
          Chat
        </Link>
      </div>

      <div className="flex items-center justify-center w-full h-25">
        <Link to={ROUTES.TASKS} className="btn btn-secondary text-2xl font-bold w-3/4 h-full">
          Tasks
        </Link>
      </div>

      <div className="flex items-center justify-center w-full h-25">
        <Link to={ROUTES.CALENDAR} className="btn btn-accent text-2xl font-bold w-3/4 h-full">
          Calendar
        </Link>
      </div>

      <div className="flex items-center justify-center w-full h-25">
        <Link to={ROUTES.SITES} className="btn text-2xl font-bold w-3/4 h-full" style={{ background: "#DA6535", color: "#fff", borderColor: "#DA6535" }}>
          Saved Sites
        </Link>
      </div>

      <div className="w-3/4 rounded-xl p-4" style={{ background: "rgba(0,0,0,0.15)" }}>
        <h3 className="font-semibold mb-3 text-white text-center">Weather</h3>
        <Weather />
      </div>

      <div className="w-3/4 rounded-xl p-4" style={{ background: "rgba(0,0,0,0.15)" }}>
        <h3 className="font-semibold mb-3 text-white">Recent Events</h3>
        {events.length === 0 ? <p className="text-white opacity-70">No recent events yet.</p> : null}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {events.map((event) => (
            <li key={event.id} style={{ color: "#fff", padding: "0.4rem 0.75rem", background: "rgba(255,255,255,0.12)", borderRadius: "8px" }}>
              {event.name}
            </li>
          ))}
        </ul>
        {error ? <p className="text-error">{error}</p> : null}
      </div>
    </div>
  );
}

export default Home;
