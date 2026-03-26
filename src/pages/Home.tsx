import { useEffect, useState } from "react";
import Weather from "../components/Weather";
import { ListEvents } from "../backend/eventHandler";
import type { EventRecord } from "../backend/storage";

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
    <div>
      <h2>Home</h2>
      <Weather />
      <section>
        <h3>Recent Events</h3>
        <ul>
          {events.map((event) => (
            <li key={event.id}>{event.name}</li>
          ))}
        </ul>
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      </section>
    </div>
  );
}

export default Home;
