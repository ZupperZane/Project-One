import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { DisplayMessages, SendMessage } from "../backend/chatHandler";
import { EnsureUser, ListUsers, RelationFor } from "../backend/userHandler";
import type { MessageRecord, UserRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";

function Chat() {
  const { user } = useAuth();
  const [selfUser, setSelfUser] = useState<UserRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [activeTargetId, setActiveTargetId] = useState<string>("");
  const [relation, setRelation] = useState<string>("unknown");
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [body, setBody] = useState("");
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

  const visibleMessages = useMemo(() => {
    if (!selfUser || !activeTargetId) return [];

    return messages.filter(
      (message) =>
        (message.fromUserId === selfUser.id && message.toUserId === activeTargetId) ||
        (message.fromUserId === activeTargetId && message.toUserId === selfUser.id)
    );
  }, [activeTargetId, messages, selfUser]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

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

  return (
    <section>
      <h2>Chat</h2>
      <p>Selected relation: {relation}</p>

      <label htmlFor="chat-target">Chat with</label>
      <select
        id="chat-target"
        value={activeTargetId}
        onChange={(event) => setActiveTargetId(event.target.value)}
      >
        <option value="">Select user</option>
        {users.map((target) => (
          <option key={target.id} value={target.id}>
            {target.displayName}
          </option>
        ))}
      </select>

      <ul>
        {visibleMessages.map((message) => (
          <li key={message.id}>
            [{new Date(message.createdAt).toLocaleTimeString()}] {message.body}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem", maxWidth: "480px" }}>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Type a message"
          rows={3}
        />
        <button type="submit">Send</button>
      </form>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </section>
  );
}

export default Chat;
