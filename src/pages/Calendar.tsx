import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  CreateEvent,
  DeleteEvent,
  DisplayCalender,
  EditEvent,
} from "../backend/eventHandler";
import { ListUsers } from "../backend/userHandler";
import type { EventRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";

function Calendar() {
  const { user } = useAuth();
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const resolvePosterName = (posterId: string) => {
    if (!posterId || posterId === "system") return "System";
    if (user?.uid && posterId === user.uid) return `${user.displayName || user.email || "You"} (You)`;
    return userNames[posterId] ?? posterId;
  };

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

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await ListUsers();
        const nextUserNames = Object.fromEntries(
          allUsers.map((entry) => [entry.id, entry.displayName || entry.email || entry.id])
        );
        setUserNames(nextUserNames);
      } catch {
        setUserNames({});
      }
    };

    void loadUsers();
  }, []);

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
    const nextName = window.prompt("Type a new event name:", entry.name)?.trim();
    if (!nextName) return;

    try {
      setError("");
      await EditEvent(entry.id, { name: nextName });
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
    <section className="mx-auto max-w-4xl space-y-4">
      <div className="rounded-xl bg-base-200 p-4">
        <h2 className="text-3xl font-bold">Calendar</h2>
        <p className="mt-1 text-lg">Choose a day, then add or manage events.</p>
      </div>

      <div className="rounded-xl bg-base-100 p-4">
        <label htmlFor="calendar-day" className="mb-2 block text-lg font-semibold">
          Day
        </label>
        <input
          id="calendar-day"
          className="input input-bordered w-full text-lg"
          type="date"
          value={day}
          onChange={(event) => setDay(event.target.value)}
        />

        <form onSubmit={create} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            className="input input-bordered text-lg"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Type a new event name"
            required
          />
          <button type="submit" className="btn btn-primary text-lg" disabled={!name.trim()}>
            Add Event
          </button>
        </form>
      </div>

      <div className="rounded-xl bg-base-100 p-4">
        <h3 className="text-2xl font-bold">Events on {day}</h3>
        <ul className="mt-3 space-y-2">
          {events.length === 0 ? <li className="text-lg">No events for this day.</li> : null}
          {events.map((entry) => (
            <li key={entry.id} className="rounded-lg bg-base-200 p-3">
              <p className="text-lg font-semibold">{entry.name}</p>
              <p className="text-sm opacity-80">Added by: {resolvePosterName(entry.createdBy)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => void rename(entry)}>
                  Rename
                </button>
                <button type="button" className="btn btn-error btn-sm" onClick={() => void remove(entry)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {error ? <p className="text-error text-lg font-semibold">{error}</p> : null}
    </section>
  );
}

export default Calendar;
