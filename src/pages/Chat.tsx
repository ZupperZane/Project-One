import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ClearConversationMessages, DisplayMessages, SendMessage } from "../backend/chatHandler";
import { ConnectUsers, EnsureUser, ListUsers, RelationFor } from "../backend/userHandler";
import type { MessageRecord, UserRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";

function Chat() {
  const { user } = useAuth();
  const [selfUser, setSelfUser] = useState<UserRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [activeTargetId, setActiveTargetId] = useState<string>("");
  const [relation, setRelation] = useState<string>("unknown");
  const [relationDraft, setRelationDraft] = useState<string>("");
  const [savingRelation, setSavingRelation] = useState(false);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState("");
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const setup = async () => {
      if (!user) return;

      const localUser = await EnsureUser({
        externalId: user.uid,
        email: user.email ?? undefined,
        displayName: user.displayName ?? undefined,
      });

      const allUsers = await ListUsers();
      const others = allUsers.filter((candidate) => candidate.id !== localUser.id);

      setSelfUser(localUser);
      setUsers(others);
      setActiveTargetId(others[0]?.id ?? "");
      setMessages(await DisplayMessages(localUser.id));
    };

    void setup();
  }, [user]);

  useEffect(() => {
    const loadRelation = async () => {
      if (!selfUser || !activeTargetId) {
        setRelation("unknown");
        return;
      }

      const value = await RelationFor(selfUser.id, activeTargetId);
      setRelation(value ?? "unknown");
    };

    void loadRelation();
  }, [activeTargetId, selfUser]);

  useEffect(() => {
    setRelationDraft(relation === "unknown" ? "" : relation);
  }, [relation, activeTargetId]);

  const visibleMessages = useMemo(() => {
    if (!selfUser || !activeTargetId) return [];

    return messages.filter(
      (message) =>
        (message.fromUserId === selfUser.id && message.toUserId === activeTargetId) ||
        (message.fromUserId === activeTargetId && message.toUserId === selfUser.id)
    );
  }, [activeTargetId, messages, selfUser]);

  const selectedTarget = users.find((target) => target.id === activeTargetId);
  const resolveSenderName = (fromUserId: string) => {
    if (selfUser && fromUserId === selfUser.id) return `${selfUser.displayName} (You)`;
    const sender = users.find((candidate) => candidate.id === fromUserId);
    return sender?.displayName ?? fromUserId;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!selfUser || !activeTargetId) {
      setError("You need another connected user to send a message.");
      return;
    }

    try {
      await SendMessage({
        fromUserId: selfUser.id,
        toUserId: activeTargetId,
        body,
      });
      setBody("");
      setMessages(await DisplayMessages(selfUser.id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Message send failed";
      setError(message);
    }
  };

  const handleClearConversation = async () => {
    if (!selfUser || !selectedTarget) {
      setError("Choose a person first.");
      return;
    }

    const shouldClear = window.confirm(
      `Clear all messages between you and ${selectedTarget.displayName}? This cannot be undone.`
    );
    if (!shouldClear) return;

    try {
      setClearing(true);
      setError("");
      setNotice("");
      const removedCount = await ClearConversationMessages(selfUser.id, selectedTarget.id);
      setMessages(await DisplayMessages(selfUser.id));
      setNotice(
        removedCount > 0
          ? `Cleared ${removedCount} message${removedCount === 1 ? "" : "s"}.`
          : "No messages were found to clear."
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not clear conversation.";
      setError(message);
    } finally {
      setClearing(false);
    }
  };

  const handleSaveRelation = async () => {
    if (!selfUser || !selectedTarget) {
      setError("Choose a person first.");
      return;
    }

    const nextRelation = relationDraft.trim();
    if (!nextRelation) {
      setError("Please type a relation before saving.");
      return;
    }

    try {
      setSavingRelation(true);
      setError("");
      setNotice("");
      await ConnectUsers({
        userId: selfUser.id,
        targetUserId: selectedTarget.id,
        relationToTarget: nextRelation,
      });
      setRelation(nextRelation);
      setNotice(`Relation saved: ${nextRelation}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save relation.";
      setError(message);
    } finally {
      setSavingRelation(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <div className="rounded-xl bg-base-200 p-4">
        <h2 className="text-3xl font-bold">Messages</h2>
        <p className="mt-1 text-lg">Step 1: Choose who you want to talk to.</p>
      </div>

      <div className="rounded-xl bg-base-100 p-4">
        <label htmlFor="chat-target" className="mb-2 block text-lg font-semibold">
          Person
        </label>
        <select
          id="chat-target"
          className="select select-bordered w-full text-lg"
          value={activeTargetId}
          onChange={(event) => setActiveTargetId(event.target.value)}
        >
          <option value="">Choose a person</option>
          {users.map((target) => (
            <option key={target.id} value={target.id}>
              {target.displayName}
            </option>
          ))}
        </select>
        <p className="mt-2 text-base">
          {selectedTarget ? `Now chatting with: ${selectedTarget.displayName}` : "No person selected yet."}
        </p>
        <p className="text-sm opacity-80">Relationship: {relation}</p>

        <div className="mt-3">
          <label htmlFor="relation-input" className="mb-2 block text-lg font-semibold">
            Relation to this person
          </label>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              id="relation-input"
              type="text"
              className="input input-bordered text-lg"
              placeholder="Example: Daughter, Friend, Caregiver"
              value={relationDraft}
              onChange={(event) => setRelationDraft(event.target.value)}
              disabled={!selectedTarget || savingRelation}
            />
            <button
              type="button"
              className="btn btn-secondary text-base"
              onClick={() => void handleSaveRelation()}
              disabled={!selectedTarget || !relationDraft.trim() || savingRelation}
            >
              {savingRelation ? "Saving..." : "Save Relation"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-base-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-2xl font-bold">Conversation</h3>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => void handleClearConversation()}
            disabled={!selectedTarget || clearing}
          >
            {clearing ? "Clearing..." : "Clear Chat History"}
          </button>
        </div>
        <ul className="mt-2 max-h-72 space-y-2 overflow-y-auto">
          {visibleMessages.length === 0 ? <li className="text-lg">No messages yet.</li> : null}
          {visibleMessages.map((message) => (
            <li key={message.id} className="rounded-lg bg-base-200 p-3 text-left text-lg">
              <p className="text-sm font-semibold opacity-80">
                From: {resolveSenderName(message.fromUserId)}
              </p>
              <span className="mr-2 text-sm opacity-70">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
              {message.body}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl bg-base-100 p-4">
        <label htmlFor="message-body" className="mb-2 block text-lg font-semibold">
          Step 2: Type your message
        </label>
        <textarea
          id="message-body"
          className="textarea textarea-bordered h-28 w-full text-lg"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Type your message here"
          rows={3}
        />
        <button
          type="submit"
          className="btn btn-primary mt-3 w-full text-xl"
          disabled={!activeTargetId || !body.trim()}
        >
          Step 3: Send Message
        </button>
      </form>

      {notice ? <p className="text-success text-lg font-semibold">{notice}</p> : null}
      {error ? <p className="text-error text-lg font-semibold">{error}</p> : null}
    </section>
  );
}

export default Chat;
