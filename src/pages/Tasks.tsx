import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  DisplayList,
  DisplayCalender,
  addToList,
  deleteFromList,
  editfromList,
} from "../backend/todoHandler";
import { EnsureUser, ListUsers } from "../backend/userHandler";
import type { EventRecord, ListItemRecord, UserRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";


function Tasks() {
  const { user } = useAuth();
  const [selfUser, setSelfUser] = useState<UserRecord | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserRecord[]>([]);
  const [recipientUserId, setRecipientUserId] = useState("");
  const [sharingPdf, setSharingPdf] = useState(false);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<ListItemRecord[]>([]);
  const [calendar, setCalendar] = useState<EventRecord[]>([]);
  const [newItem, setNewItem] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const refresh = async (userId: string, selectedDay: string) => {
    const [listItems, calEvents] = await Promise.all([
      DisplayList(selectedDay, userId),
      DisplayCalender(selectedDay),
    ]);

    setItems(listItems);
    setCalendar(calEvents);
  };

  const resolvePosterName = (userId: string) => {
    if (!userId || userId === "system") return "System";
    if (selfUser && userId === selfUser.id) return `${selfUser.displayName} (You)`;
    return userNames[userId] ?? userId;
  };

  const buildPdfForDay = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const fileName = `tasks-calendar-${day}.pdf`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 48;
    const usableWidth = pageWidth - marginX * 2;
    const lineHeight = 18;
    let y = 52;

    const ensureSpace = (required = 28) => {
      if (y + required <= pageHeight - 48) return;
      doc.addPage();
      y = 52;
    };

    const addWrappedLine = (text: string, fontSize = 12) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, usableWidth) as string[];
      for (const line of lines) {
        ensureSpace(lineHeight);
        doc.text(line, marginX, y);
        y += lineHeight;
      }
    };

    doc.setFontSize(20);
    doc.text("Tasks + Calendar Report", marginX, y);
    y += 28;

    doc.setFontSize(12);
    addWrappedLine(`Date: ${day}`);
    addWrappedLine(`Prepared by: ${selfUser?.displayName || selfUser?.email || "User"}`);
    y += 6;

    doc.setFontSize(16);
    ensureSpace(24);
    doc.text("Checklist Items", marginX, y);
    y += 22;

    if (items.length === 0) {
      addWrappedLine("- No checklist items for this date.");
    } else {
      for (const item of items) {
        const status = item.completed ? "[Done]" : "[Not done]";
        addWrappedLine(`- ${status} ${item.text}`);
        addWrappedLine(`  Added by: ${resolvePosterName(item.userId)}`, 11);
      }
    }

    y += 8;
    doc.setFontSize(16);
    ensureSpace(24);
    doc.text("Calendar Events", marginX, y);
    y += 22;

    if (calendar.length === 0) {
      addWrappedLine("- No calendar events for this date.");
    } else {
      for (const event of calendar) {
        addWrappedLine(`- ${event.name}`);
        addWrappedLine(`  Added by: ${resolvePosterName(event.createdBy)}`, 11);
      }
    }

    const blob = doc.output("blob");
    const file = new File([blob], fileName, { type: "application/pdf" });
    return { blob, file, fileName };
  };

  const triggerPdfDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    try {
      setError("");
      setNotice("");
      const { blob, fileName } = buildPdfForDay();
      triggerPdfDownload(blob, fileName);
      setNotice("PDF downloaded.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not create PDF.";
      setError(message);
    }
  };

  const handleEmailPdf = async () => {
    const recipient = availableUsers.find((candidate) => candidate.id === recipientUserId);
    if (!recipient?.email) {
      setError("Please choose a recipient with an email address.");
      return;
    }

    try {
      setError("");
      setNotice("");
      setSharingPdf(true);
      const { blob, file, fileName } = buildPdfForDay();
      const title = `Tasks and Calendar for ${day}`;
      const text = `Hi ${recipient.displayName || recipient.email}, here is the PDF report for ${day}.`;

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text,
        });
        setNotice("Share dialog opened. Choose your email app to send the PDF.");
        return;
      }

      triggerPdfDownload(blob, fileName);
      const subject = encodeURIComponent(title);
      const body = encodeURIComponent(
        `Hi ${recipient.displayName || recipient.email},\n\nI downloaded the PDF report (${fileName}) for ${day}.\nPlease attach that file from Downloads before sending.\n`
      );
      window.location.href = `mailto:${encodeURIComponent(recipient.email)}?subject=${subject}&body=${body}`;
      setNotice("Email draft opened. Attach the downloaded PDF and send.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not prepare email PDF.";
      setError(message);
    } finally {
      setSharingPdf(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!user) {
        setSelfUser(null);
        setItems([]);
        setCalendar([]);
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        setError("");
        setNotice("");
        const localUser = await EnsureUser({
          externalId: user.uid,
          email: user.email ?? undefined,
          displayName: user.displayName ?? undefined,
        });

        const allUsers = await ListUsers();
        const nextUserNames = Object.fromEntries(
          allUsers.map((entry) => [entry.id, entry.displayName || entry.email || entry.id])
        );
        const recipients = allUsers.filter(
          (entry) => entry.id !== localUser.id && Boolean(entry.email?.trim())
        );

        setSelfUser(localUser);
        setUserNames(nextUserNames);
        setAvailableUsers(recipients);
        setRecipientUserId((previous) => previous || recipients[0]?.id || "");
        await refresh(localUser.id, day);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not load tasks.";
        setError(message);
      } finally {
        setLoadingData(false);
      }
    };

    void init();
  }, [day, user]);

  useEffect(() => {
    if (!selfUser) return;

    const refreshSharedTasks = () => {
      void refresh(selfUser.id, day);
    };

    const interval = window.setInterval(refreshSharedTasks, 5000);
    window.addEventListener("focus", refreshSharedTasks);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshSharedTasks);
    };
  }, [day, selfUser]);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

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

    try {
      setBusyItemId(item.id);
      setError("");
      setNotice("");
      await editfromList({
        userId: selfUser.id,
        listName: "default",
        itemId: item.id,
        completed: !item.completed,
      });

      await refresh(selfUser.id, day);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not update task.";
      setError(message);
    } finally {
      setBusyItemId(null);
    }
  };

  const removeItem = async (item: ListItemRecord) => {
    if (!selfUser) return;

    try {
      setBusyItemId(item.id);
      setError("");
      setNotice("");
      await deleteFromList({
        userId: selfUser.id,
        listName: "default",
        itemId: item.id,
      });

      await refresh(selfUser.id, day);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not delete task.";
      setError(message);
    } finally {
      setBusyItemId(null);
    }
  };

  if (!user) {
    return (
      <section className="mx-auto max-w-2xl space-y-4 rounded-xl bg-base-200 p-6">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <p className="text-lg">Please log in first to use your checklist.</p>
        <Link to={ROUTES.LOGIN} className="btn btn-primary text-lg">
          Go to Log In
        </Link>
      </section>
    );
  }

  if (loadingData) {
    return (
      <section className="mx-auto max-w-2xl rounded-xl bg-base-200 p-6">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <p className="text-lg">Loading your checklist...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-4">
      <div className="rounded-xl bg-base-200 p-4">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <p className="mt-1 text-lg">Shared checklist: all users can view and update tasks for this day.</p>
      </div>

      <div className="rounded-xl bg-base-100 p-4">
        <label htmlFor="task-day" className="mb-2 block text-lg font-semibold">
          Day
        </label>
        <input
          id="task-day"
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="input input-bordered w-full text-lg"
        />
      </div>

      <form onSubmit={handleAdd} className="rounded-xl bg-base-100 p-4">
        <label htmlFor="new-task" className="mb-2 block text-lg font-semibold">
          New task
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            id="new-task"
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Type your task here"
            className="input input-bordered text-lg"
            required
          />
          <button type="submit" className="btn btn-primary text-lg" disabled={!newItem.trim()}>
            Add Task
          </button>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-base-100 p-4">
          <h3 className="text-2xl font-bold">Tasks for {day}</h3>
          <ul className="mt-3 space-y-2">
            {items.length === 0 ? <li className="text-lg">No tasks yet.</li> : null}
            {items.map((item) => (
              <li key={item.id} className="rounded-lg bg-base-200 p-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-success checkbox-lg mt-1"
                    checked={item.completed}
                    disabled={busyItemId === item.id}
                    onChange={() => void toggleItem(item)}
                  />
                  <span className={`text-lg ${item.completed ? "line-through opacity-70" : ""}`}>{item.text}</span>
                </label>
                <p className="mt-1 text-sm opacity-80">Added by: {resolvePosterName(item.userId)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                {user?.uid !== "hkj5avXj30WV9ixoD9vLr7dvlo63" && (
                    <button
                      type="button"
                      onClick={() => void removeItem(item)}
                      className="btn btn-error btn-sm"
                      disabled={busyItemId === item.id}
                    >
                    Delete
                    </button>
                  )}
              
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-base-100 p-4">
          <h3 className="text-2xl font-bold">Events for {day}</h3>
          <ul className="mt-3 space-y-2">
            {calendar.length === 0 ? <li className="text-lg">No events for this day.</li> : null}
            {calendar.map((event) => (
              <li key={event.id} className="rounded-lg bg-base-200 p-3 text-lg">
                <p className="font-semibold">{event.name}</p>
                <p className="text-sm opacity-80">Added by: {resolvePosterName(event.createdBy)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl bg-base-100 p-4">
        <h3 className="text-2xl font-bold">Share as PDF</h3>
        <p className="mt-1 text-base">
          Download or email today&apos;s tasks and calendar as a PDF.
        </p>

        <label htmlFor="pdf-recipient" className="mt-3 block text-lg font-semibold">
          Email recipient
        </label>
        <select
          id="pdf-recipient"
          className="select select-bordered mt-2 w-full text-lg"
          value={recipientUserId}
          onChange={(event) => setRecipientUserId(event.target.value)}
          disabled={availableUsers.length === 0}
        >
          {availableUsers.length === 0 ? <option value="">No other users available</option> : null}
          {availableUsers.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.displayName} ({entry.email})
            </option>
          ))}
        </select>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" className="btn btn-primary text-lg" onClick={handleDownloadPdf}>
            Download PDF
          </button>
          <button
            type="button"
            className="btn btn-secondary text-lg"
            onClick={() => void handleEmailPdf()}
            disabled={!recipientUserId || sharingPdf}
          >
            {sharingPdf ? "Preparing..." : "Email PDF"}
          </button>
        </div>
      </div>

      {notice ? <p className="text-success text-lg font-semibold">{notice}</p> : null}
      {error ? <p className="text-error text-lg font-semibold">{error}</p> : null}
    </section>
  );
}

export { Tasks };
                  