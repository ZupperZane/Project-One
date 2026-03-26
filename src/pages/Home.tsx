import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Weather from "../Components/Weather";
import { ListEvents } from "../backend/eventHandler";
import type { EventRecord } from "../backend/storage";
import { ROUTES } from "../utils/constants";

function Home() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

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
        <Link to={ROUTES.SITES} className="btn btn-outline text-2xl font-bold w-3/4 h-full">
          Saved Sites
        </Link>
      </div>

      <div className="flex items-center justify-center w-3/4 h-25 bg-base-300 rounded-xl p-4">
        <Weather />
      </div>

      <div className="w-3/4 bg-base-200 rounded-xl p-4">
        <h3 className="font-semibold mb-2">Recent Events</h3>
        {events.length === 0 ? <p>No recent events yet.</p> : null}
        <ul className="list-disc pl-5">
          {events.map((event) => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
        {error ? <p className="text-error">{error}</p> : null}
      </div>
    </div>
  );
}

export default Home;
