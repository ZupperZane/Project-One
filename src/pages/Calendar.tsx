import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  CreateEvent,
  DeleteEvent,
  DisplayCalender,
  EditEvent,
} from "../backend/eventHandler";
import type { EventRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";

function Calendar() {
  const { user } = useAuth();
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [error, setError] = useState("");

  const refresh = async (selectedDay: string) => {
    const dayEvents = await DisplayCalender(selectedDay);
    setEvents(dayEvents);
  };

  useEffect(() => {
    let mounted = true;

    void DisplayCalender(day).then((dayEvents) => {
      if (mounted) {
        setEvents(dayEvents);
      }
    });

    return () => {
      mounted = false;
    };
  }, [day]);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setError("");
      await CreateEvent({ name, day, createdBy: user?.uid ?? "system" });
      setName("");
      await refresh(day);
      window.dispatchEvent(new Event("events:changed"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create event.";
      setError(message);
    }
  };

  const rename = async (entry: EventRecord) => {
    try {
      setError("");
      await EditEvent(entry.id, { name: `${entry.name} (edited)` });
      await refresh(day);
      window.dispatchEvent(new Event("events:changed"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to edit event.";
      setError(message);
    }
  };

  const remove = async (entry: EventRecord) => {
    try {
      setError("");
      await DeleteEvent(entry.id);
      await refresh(day);
      window.dispatchEvent(new Event("events:changed"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete event.";
      setError(message);
    }
  };

  return (
    <section>
      <h2>Calendar</h2>
      <label htmlFor="calendar-day">Day</label>
      <input
        id="calendar-day"
        type="date"
        value={day}
        onChange={(event) => setDay(event.target.value)}
      />

      <form onSubmit={create} style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Event name"
          required
        />
        <button type="submit">CreateEvent</button>
      </form>

      <ul>
        {events.map((entry) => (
          <li key={entry.id}>
            {entry.name}
            <button type="button" onClick={() => void rename(entry)} style={{ marginLeft: "0.5rem" }}>
              EditEvent
            </button>
            <button type="button" onClick={() => void remove(entry)} style={{ marginLeft: "0.5rem" }}>
              DeleteEvent
            </button>
          </li>
        ))}
      </ul>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </section>
  );
}

export default Calendar;
