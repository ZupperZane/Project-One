import { useEffect, useState } from "react";
import {
  createEvent,
  deleteEvent,
  displayCalendar,
  editEvent,
  shareEvent,
} from "../backend/eventHandler";
import { displayList, deleteFromList } from "../backend/todoHandler";
import type { EventRecord, ListItemRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { ROLES } from "../utils/constants";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(time: string | null | undefined): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface DayData {
  dateStr: string;
  events: EventRecord[];
  tasks: ListItemRecord[];
}

function Calendar() {
  const { user } = useAuth();
  const { activeUserId, linkedProfile, ownProfile, isViewingLinked } = useActiveProfile();
  const shareTargetId = isViewingLinked ? (ownProfile?.uid ?? null) : (linkedProfile?.uid ?? null);
  const canDelete = ownProfile?.role === ROLES.SUPPORTIVE;
  const today = toDateStr(new Date());

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState(today);
  const [name, setName] = useState("");
  const [startAt, setStartAt] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchWeek = async (start: Date, userId: string) => {
    const results = await Promise.all(
      Array.from({ length: 7 }, (_, i) => addDays(start, i)).map(async (d) => {
        const dateStr = toDateStr(d);
        const [events, tasks] = await Promise.all([
          displayCalendar(dateStr, userId),
          displayList(dateStr, userId),
        ]);
        return { dateStr, events, tasks };
      })
    );
    setWeekData(results);
  };

  useEffect(() => {
    if (!activeUserId) return;
    void fetchWeek(weekStart, activeUserId);
  }, [weekStart, activeUserId]);

  const prevWeek = () => setWeekStart((w) => addDays(w, -7));
  const nextWeek = () => setWeekStart((w) => addDays(w, 7));

  const weekLabel = `${days[0].toLocaleDateString([], { month: "short", day: "numeric" })} – ${days[6].toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}`;

  const create = async () => {
    try {
      setError("");
      await createEvent({
        name,
        day: selectedDay,
        startAt: startAt || null,
        notes,
        createdBy: activeUserId ?? user?.uid ?? "system",
      });
      setName("");
      setStartAt("");
      setNotes("");
      if (activeUserId) await fetchWeek(weekStart, activeUserId);
      window.dispatchEvent(new Event("events:changed"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create event.");
    }
  };

  const rename = async (entry: EventRecord) => {
    const nextName = window.prompt("Type a new event name:", entry.name)?.trim();
    if (!nextName) return;
    try {
      setError("");
      await editEvent(entry.id, { name: nextName });
      if (activeUserId) await fetchWeek(weekStart, activeUserId);
      window.dispatchEvent(new Event("events:changed"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to edit event.");
    }
  };

  const remove = async (entry: EventRecord) => {
    try {
      setError("");
      await deleteEvent(entry.id);
      if (activeUserId) await fetchWeek(weekStart, activeUserId);
      window.dispatchEvent(new Event("events:changed"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete event.");
    }
  };

  const share = async (entry: EventRecord) => {
    if (!shareTargetId) return;
    try {
      setError("");
      await shareEvent(entry.id, shareTargetId);
      if (activeUserId) await fetchWeek(weekStart, activeUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to share event.");
    }
  };

  const removeTask = async (task: ListItemRecord) => {
    try {
      setError("");
      await deleteFromList({ userId: task.userId, listName: task.listName, itemId: task.id });
      if (activeUserId) await fetchWeek(weekStart, activeUserId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete task.");
    }
  };

  const selectedDayData = weekData.find((d) => d.dateStr === selectedDay);

  return (
    <section className="mx-auto max-w-5xl space-y-4">
      <div className="rounded-xl bg-base-200 p-4">
        <h2 className="text-3xl font-bold">Calendar</h2>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between rounded-xl bg-base-100 px-4 py-3">
        <button type="button" className="btn btn-sm" onClick={prevWeek}>‹ Prev</button>
        <span className="text-lg font-semibold">{weekLabel}</span>
        <button type="button" className="btn btn-sm" onClick={nextWeek}>Next ›</button>
      </div>

      {/* 7-day grid */}
      <div className="overflow-x-auto">
        <div className="grid min-w-[560px] grid-cols-7 gap-2">
          {days.map((d, i) => {
            const dateStr = toDateStr(d);
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDay;
            const data = weekData.find((wd) => wd.dateStr === dateStr);
            const isEmpty = !data || (data.events.length === 0 && data.tasks.length === 0);

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDay(dateStr)}
                className={`rounded-xl p-2 text-left transition-colors ${
                  isSelected
                    ? "ring-2 ring-primary bg-primary/10"
                    : isToday
                    ? "bg-base-200"
                    : "bg-base-100 hover:bg-base-200"
                }`}
              >
                {/* Day header */}
                <div className={`mb-2 text-center ${isToday ? "text-primary font-bold" : "font-semibold"}`}>
                  <div className="text-xs opacity-60">{DAY_NAMES[i]}</div>
                  <div className="text-base">{d.getDate()}</div>
                </div>

                {/* Events */}
                {data?.events.map((event) => (
                  <div key={event.id} className="mb-1 rounded bg-accent/30 px-1.5 py-0.5 text-xs">
                    <div className="truncate font-semibold">{event.name}</div>
                    {event.startAt && (
                      <div className="opacity-70">{formatTime(event.startAt)}</div>
                    )}
                  </div>
                ))}

                {/* Tasks */}
                {data?.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`mb-1 rounded px-1.5 py-0.5 text-xs ${
                      task.completed ? "bg-success/20 opacity-50" : "bg-base-300"
                    }`}
                  >
                    <div className={`truncate ${task.completed ? "line-through" : ""}`}>
                      {task.text}
                    </div>
                  </div>
                ))}

                {isEmpty && (
                  <div className="mt-1 text-center text-xs opacity-20">—</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add event form for selected day */}
      <div className="rounded-xl bg-base-100 p-4">
        <h3 className="mb-3 text-xl font-bold">Add Event on {selectedDay}</h3>
        <form onSubmit={(e) => { e.preventDefault(); void create(); }} className="space-y-3">
          <input
            className="input input-bordered w-full text-lg"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event name"
            required
          />
          <input
            className="input input-bordered w-full text-lg"
            type="time"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
          <textarea
            className="textarea textarea-bordered w-full text-lg"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={2}
          />
          <button type="submit" className="btn btn-primary w-full text-lg" disabled={!name.trim()}>
            Add Event
          </button>
        </form>
      </div>

      {/* Selected day detail */}
      {selectedDayData && (selectedDayData.events.length > 0 || selectedDayData.tasks.length > 0) && (
        <div className="rounded-xl bg-base-100 p-4">
          <h3 className="text-2xl font-bold">Details for {selectedDay}</h3>

          {selectedDayData.events.length > 0 && (
            <>
              <h4 className="mt-3 text-lg font-semibold">Events</h4>
              <ul className="mt-1 space-y-2">
                {selectedDayData.events.map((entry) => (
                  <li key={entry.id} className="rounded-lg bg-base-200 p-3">
                    <p className="text-lg font-semibold">{entry.name}</p>
                    {entry.startAt && (
                      <p className="text-base opacity-80">{formatTime(entry.startAt)}</p>
                    )}
                    {entry.notes && <p className="text-base opacity-80">{entry.notes}</p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => void rename(entry)}>
                        Rename
                      </button>
                      {shareTargetId && !entry.sharedWith.includes(shareTargetId) && (
                        <button type="button" className="btn btn-accent btn-sm" onClick={() => void share(entry)}>
                          Share
                        </button>
                      )}
                      {shareTargetId && entry.sharedWith.includes(shareTargetId) && (
                        <span className="btn btn-sm btn-disabled">Shared ✓</span>
                      )}
                      {canDelete && (
                        <button type="button" className="btn btn-error btn-sm" onClick={() => void remove(entry)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {selectedDayData.tasks.length > 0 && (
            <>
              <h4 className="mt-3 text-lg font-semibold">Tasks</h4>
              <ul className="mt-1 space-y-1">
                {selectedDayData.tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`rounded-lg bg-base-200 p-3 text-lg ${task.completed ? "opacity-50" : ""}`}
                  >
                    <span className={task.completed ? "line-through" : ""}>{task.text}</span>
                    {canDelete && (
                      <div className="mt-2">
                        <button type="button" className="btn btn-error btn-sm" onClick={() => void removeTask(task)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {error ? <p className="text-error text-lg font-semibold">{error}</p> : null}
    </section>
  );
}

export default Calendar;
