import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useActiveProfile } from "./useActiveProfile";

export interface CalendarEvent {
  id: string;
  ownerId: string;
  title: string;
  date: Date;
  type: "appointment" | "social" | "todo";
  sharedWith: string[];
  isTodo: boolean;
  todoCompleted: boolean;
}

interface UseCalendarReturn {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  // Stubs — Chris will implement these
  addEvent: () => void;
  editEvent: (eventId: string) => void;
  deleteEvent: (eventId: string) => void;
}

export function useCalendar(): UseCalendarReturn {
  const { activeUserId } = useActiveProfile();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeUserId || !db) {
      setEvents([]);
      setLoading(false);
      return;
    }

    // Fetch events where the active user is the owner or in sharedWith
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("sharedWith", "array-contains", activeUserId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: CalendarEvent[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ownerId: data.ownerId as string,
            title: data.title as string,
            date: (data.date as { toDate: () => Date }).toDate(),
            type: data.type as CalendarEvent["type"],
            sharedWith: data.sharedWith as string[],
            isTodo: data.isTodo as boolean,
            todoCompleted: data.todoCompleted as boolean,
          };
        });
        setEvents(fetched);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load events.");
        setLoading(false);
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [activeUserId]);

  // Stubs for Chris
  const addEvent = () => {
    console.log("addEvent — not yet implemented");
  };

  const editEvent = (eventId: string) => {
    console.log("editEvent — not yet implemented", eventId);
  };

  const deleteEvent = (eventId: string) => {
    console.log("deleteEvent — not yet implemented", eventId);
  };

  return { events, loading, error, addEvent, editEvent, deleteEvent };
}
