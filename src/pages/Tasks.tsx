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

function Tasks() {
  const { user } = useAuth();
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
      if (!user) return;

      const localUser = await EnsureUser({
        externalId: user.uid,
        email: user.email ?? undefined,
        displayName: user.displayName ?? undefined,
      });

      setSelfUser(localUser);
      await refresh(localUser.id, day);
    };

    void init();
  }, [day, user]);

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
    <section>
      <h2>To-Do / Calendar</h2>
      <label htmlFor="task-day">Day</label>
      <input
        id="task-day"
        type="date"
        value={day}
        onChange={(event) => setDay(event.target.value)}
      />

      <form onSubmit={handleAdd} style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem", maxWidth: "420px" }}>
        <input
          type="text"
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="Add to-do item"
        />
        <button type="submit">Add To List</button>
      </form>

      <h3>DisplayList({day})</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => void toggleItem(item)}>
              {item.completed ? "Undo" : "Done"}
            </button>{" "}
            {item.text}
            <button type="button" onClick={() => void removeItem(item)} style={{ marginLeft: "0.5rem" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h3>DisplayCalender({day})</h3>
      <ul>
        {calendar.map((event) => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </section>
  );
}

export { Tasks };
