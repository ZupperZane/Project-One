import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { DisplayMessages, SendMessage } from "../backend/chatHandler";
import { EnsureUser } from "../backend/userHandler";
import type { MessageRecord, UserRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";
import { useActiveProfile } from "../hooks/useActiveProfile";
import { ROLES } from "../utils/constants";
import type { UserProfile } from "../hooks/useUserProfile";

function resolveDisplayName(profile: UserProfile | null): string {
  if (!profile) return "your contact";
  if (profile.displayName && profile.displayName !== "User") return profile.displayName;
  return profile.role === ROLES.PRIMARY ? "Olivia" : "Emma";
}

const COLORS = {
  bg: "#1a1a1a",
  header: "#141414",
  messageBg: "linear-gradient(160deg, #252525 0%, #2e1a08 100%)",
  inputBar: "#1e1e1e",
  inputField: "#2a2a2a",
  ownBubble: "#35AADA",
  otherBubble: "#E8B800",
  ownText: "#ffffff",
  otherText: "#1a1a1a",
  subtext: "#888",
  border: "#333",
};

function Chat() {
  const { user } = useAuth();
  const { linkedProfile, ownProfile, activeUserId, isViewingLinked } = useActiveProfile();
  const [selfUser, setSelfUser] = useState<UserRecord | null>(null);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Perspective flips with the toggle:
  // Emma viewing self  → self=Emma,  target=Olivia
  // Emma viewing Olivia → self=Olivia, target=Emma
  const selfId = activeUserId;
  const targetId = isViewingLinked ? (ownProfile?.uid ?? null) : (linkedProfile?.uid ?? null);
  const selfName = resolveDisplayName(isViewingLinked ? linkedProfile : ownProfile);
  const targetName = resolveDisplayName(isViewingLinked ? ownProfile : linkedProfile);

  useEffect(() => {
    const setup = async () => {
      if (!user || !selfId) return;
      const localUser = await EnsureUser({ externalId: selfId });
      setSelfUser(localUser);
      setMessages(await DisplayMessages(selfId));
    };
    void setup();
  }, [user, selfId]);

  const visibleMessages = useMemo(() => {
    if (!selfId || !targetId) return [];
    return messages.filter(
      (m) =>
        (m.fromUserId === selfId && m.toUserId === targetId) ||
        (m.fromUserId === targetId && m.toUserId === selfId)
    );
  }, [selfId, targetId, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!body.trim() || !selfUser || !targetId) return;
    setError("");
    try {
      await SendMessage({ fromUserId: selfUser.id, toUserId: targetId, body });
      setBody("");
      setMessages(await DisplayMessages(selfUser.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Message send failed");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 220px)",
      minHeight: "400px",
      maxWidth: "640px",
      margin: "0 auto",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      border: `1px solid ${COLORS.border}`,
      background: COLORS.bg,
    }}>

      {/* Header */}
      <div style={{
        background: COLORS.header,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        flexShrink: 0,
      }}>
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: COLORS.ownBubble,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "1.1rem",
          color: "#fff",
          flexShrink: 0,
        }}>
          {targetName[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#f0f0f0" }}>
            {targetName}
          </div>
          <div style={{ fontSize: "0.75rem", color: COLORS.subtext }}>
            {targetId ? "Messages saved automatically" : "No linked contact"}
          </div>
        </div>
      </div>

      {/* Message list */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "1.25rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        background: COLORS.messageBg,
      }}>
        {!targetId && (
          <p style={{ color: COLORS.subtext, textAlign: "center", marginTop: "2rem" }}>
            No linked contact found.
          </p>
        )}

        {visibleMessages.length === 0 && targetId && (
          <p style={{ color: COLORS.subtext, textAlign: "center", marginTop: "2rem" }}>
            No messages yet — say hello!
          </p>
        )}

        {visibleMessages.map((message) => {
          const isOwn = message.fromUserId === selfId;
          return (
            <div key={message.id} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isOwn ? "flex-end" : "flex-start",
            }}>
              <div style={{
                fontSize: "0.7rem",
                color: COLORS.subtext,
                marginBottom: "0.25rem",
                paddingLeft: "4px",
                paddingRight: "4px",
              }}>
                {isOwn ? selfName : targetName}
              </div>
              <div style={{
                background: isOwn ? COLORS.ownBubble : COLORS.otherBubble,
                color: isOwn ? COLORS.ownText : COLORS.otherText,
                padding: "0.6rem 1rem",
                borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                maxWidth: "70%",
                lineHeight: 1.45,
                wordBreak: "break-word",
                fontSize: "0.95rem",
              }}>
                {message.body}
              </div>
              <div style={{
                fontSize: "0.68rem",
                color: COLORS.subtext,
                marginTop: "0.2rem",
                paddingLeft: "4px",
                paddingRight: "4px",
              }}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        borderTop: `1px solid ${COLORS.border}`,
        background: COLORS.inputBar,
        flexShrink: 0,
      }}>
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={targetId ? `Message ${targetName}…` : "No contact linked"}
          disabled={!targetId}
          style={{
            flex: 1,
            padding: "0.65rem 1.1rem",
            borderRadius: "999px",
            border: `1.5px solid ${COLORS.border}`,
            background: COLORS.inputField,
            color: "#f0f0f0",
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={!targetId || !body.trim()}
          style={{
            background: COLORS.ownBubble,
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "0.65rem 1.3rem",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: targetId && body.trim() ? "pointer" : "not-allowed",
            opacity: targetId && body.trim() ? 1 : 0.4,
            transition: "opacity 0.15s",
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </form>

      {error && (
        <p style={{
          color: "#ff6b6b",
          padding: "0.25rem 1rem 0.5rem",
          background: COLORS.inputBar,
          margin: 0,
          fontSize: "0.85rem",
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Chat;
