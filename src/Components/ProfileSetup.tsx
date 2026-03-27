import { useState } from "react";
import type { FormEvent } from "react";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { ROLES } from "../utils/constants";
import type { Role } from "../utils/constants";
import type { UserProfile } from "../hooks/useUserProfile";

interface ProfileSetupProps {
  profile: UserProfile;
}

function ProfileSetup({ profile }: ProfileSetupProps) {
  const [role, setRole] = useState<Role>(profile.role);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setError("");
    setSaving(true);

    try {
      const trimmed = email.trim().toLowerCase();
      const snap = await getDocs(
        query(collection(db, "Users"), where("email", "==", trimmed))
      );

      if (snap.empty) {
        setError(`No account found for ${trimmed}.`);
        return;
      }

      const otherDoc = snap.docs[0];
      if (otherDoc.id === profile.uid) {
        setError("That's your own account.");
        return;
      }

      await Promise.all([
        setDoc(doc(db, "Users", profile.uid), { role, linkedUserId: otherDoc.id }, { merge: true }),
        setDoc(doc(db, "Users", otherDoc.id), { linkedUserId: profile.uid }, { merge: true }),
      ]);

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ border: "1px solid #f0ad4e", background: "#fffbe6", color: "#333", padding: "1rem", marginBottom: "1rem", maxWidth: "400px" }}>
      <strong>One-time account setup</strong>
      <form onSubmit={handleSubmit} style={{ marginTop: "0.5rem", display: "grid", gap: "0.5rem" }}>
        <label>
          I am:
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={{ marginLeft: "0.5rem" }}>
            <option value={ROLES.PRIMARY}>Olivia (primary user)</option>
            <option value={ROLES.SUPPORTIVE}>Emma (helper)</option>
          </select>
        </label>
        <label>
          Other person&apos;s email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="their@email.com"
            required
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}
      </form>
    </div>
  );
}

export default ProfileSetup;
