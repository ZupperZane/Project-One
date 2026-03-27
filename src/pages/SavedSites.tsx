import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  addSavedSite,
  deleteSavedSite,
  DisplaySavedSites,
} from "../backend/savedSitesHandler";
import { EnsureUser } from "../backend/userHandler";
import type { SavedSiteRecord, UserRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";
import { useActiveProfile } from "../hooks/useActiveProfile";

function SavedSites() {
  const { user, loading } = useAuth();
  const { activeUserId } = useActiveProfile();
  const [selfUser, setSelfUser] = useState<UserRecord | null>(null);
  const [sites, setSites] = useState<SavedSiteRecord[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const refresh = async (userId: string) => {
    setSites(await DisplaySavedSites(userId));
  };

  const resolveCurrentBackendUser = useCallback(async () => {
    if (!user || !activeUserId) {
      throw new Error("You must be signed in to manage saved sites.");
    }

    const localUser = await EnsureUser({ externalId: activeUserId });
    setSelfUser(localUser);
    return localUser;
  }, [user, activeUserId]);

  useEffect(() => {
    const setup = async () => {
      if (loading) return;
      if (!user) {
        setSelfUser(null);
        setSites([]);
        return;
      }

      try {
        setError("");
        const localUser = await resolveCurrentBackendUser();
        await refresh(localUser.id);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not load saved sites.";
        setError(message);
      }
    };

    void setup();
  }, [loading, resolveCurrentBackendUser, user]);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const localUser = await resolveCurrentBackendUser();
      await addSavedSite({ userId: localUser.id, title, url });
      setTitle("");
      setUrl("");
      await refresh(localUser.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save site";
      setError(message);
    }
  };

  const remove = async (siteId: string) => {
    try {
      const localUser = selfUser ?? (await resolveCurrentBackendUser());
      await deleteSavedSite({ userId: localUser.id, siteId });
      await refresh(localUser.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete saved site";
      setError(message);
    }
  };

  return (
    <section>
      <h2>Saved Sites</h2>
      <form onSubmit={handleAdd} style={{ display: "grid", gap: "0.5rem", maxWidth: "480px" }}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          required
        />
        <button type="submit" disabled={loading || !user}>
          addSavedSite
        </button>
      </form>

      <ul>
        {sites.map((site) => (
          <li key={site.id}>
            <a href={site.url} target="_blank" rel="noreferrer">
              {site.title}
            </a>
            <button type="button" onClick={() => void remove(site.id)} style={{ marginLeft: "0.5rem" }}>
              deleteSavedSite
            </button>
          </li>
        ))}
      </ul>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </section>
  );
}

export default SavedSites;
