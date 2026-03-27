import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  DisplayList,
  DisplayCalender,
  addToList,
  deleteFromList,
  editfromList,
} from "../backend/todoHandler";
import { EnsureUser } from "../backend/userHandler";
import type { EventRecord, ListItemRecord, UserRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";
import { useActiveProfile } from "../hooks/useActiveProfile";
import "../Tasks.css";

function Tasks() {
  const { user } = useAuth();
  const { activeUserId } = useActiveProfile();
  const [selfUser, setSelfUser] = useState<UserRecord | null>(null);
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<ListItemRecord[]>([]);
  const [calendar, setCalendar] = useState<EventRecord[]>([]);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");

  const refresh = async (userId: string, selectedDay: string) => {
    const [listItems, calEvents] = await Promise.all([
      DisplayList(selectedDay, userId),
      DisplayCalender(selectedDay),
    ]);

    setItems(listItems);
    setCalendar(calEvents);
  };

  useEffect(() => {
    const init = async () => {
      if (!user || !activeUserId) return;

      const localUser = await EnsureUser({ externalId: activeUserId });
      setSelfUser(localUser);
      await refresh(localUser.id, day);
    };

    void init();
  }, [day, user, activeUserId]);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!selfUser) {
      setError("No authenticated user is available for list operations.");
      return;
    }

    try {
      await addToList({
        userId: selfUser.id,
        listName: "default",
        text: newItem,
        day,
      });

      setNewItem("");
      await refresh(selfUser.id, day);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not add list item";
      setError(message);
    }
  };

  const toggleItem = async (item: ListItemRecord) => {
    if (!selfUser) return;

    await editfromList({
      userId: selfUser.id,
      listName: "default",
      itemId: item.id,
      completed: !item.completed,
    });

    await refresh(selfUser.id, day);
  };

  const removeItem = async (item: ListItemRecord) => {
    if (!selfUser) return;

    await deleteFromList({
      userId: selfUser.id,
      listName: "default",
      itemId: item.id,
    });

    await refresh(selfUser.id, day);
  };

    return (
    <section className="tasks-section">
      <h2 className="tasks-title">📋 To-Do / Calendar</h2>

      <div>
        <label htmlFor="task-day" className="day-label">Day</label>
        <input id="task-day" type="date" value={day} onChange={(e) => setDay(e.target.value)} className="day-input" />
      </div>

      <form onSubmit={handleAdd} className="task-form">
        <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add to-do item..." className="task-input" />
        <button type="submit" className="task-submit-btn">＋ Add To List</button>
      </form>
<div className="tasks-grid">
        <div className="card">
          <h3 className="card-title">Tasks for {day || "..."}</h3>
          <ul className="task-list">
            {items.map((item) => (
              <li key={item.id} className="task-item">
                <span className={`task-text ${item.completed ? "completed" : ""}`}>{item.text}</span>
                <div className="task-actions">
                  <button type="button" onClick={() => void toggleItem(item)} className={item.completed ? "btn-undo" : "btn-done"}>
                    {item.completed ? "Undo" : "Done"}
                  </button>
                  <button type="button" onClick={() => void removeItem(item)} className="btn-delete">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title"> Events for {day || "..."}</h3>
          <ul className="task-list">
            {calendar.map((event) => (
              <li key={event.id} className="task-item">{event.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {error ? <p className="task-error">{error}</p> : null}
    </section>
  );
}

export { Tasks };
