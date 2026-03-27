import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  addSavedSite,
  deleteSavedSite,
  DisplaySavedSites,
} from "../backend/savedSitesHandler";
import { EnsureUser, ListUsers } from "../backend/userHandler";
import type { SavedSiteRecord, UserRecord } from "../backend/storage";
import useAuth from "../hooks/useAuth";

function SavedSites() {
  const { user, loading } = useAuth();
  const [selfUser, setSelfUser] = useState<UserRecord | null>(null);
  const [sites, setSites] = useState<SavedSiteRecord[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const resolvePosterName = (posterId: string) => {
    if (!posterId) return "Unknown";
    if (selfUser && posterId === selfUser.id) return `${selfUser.displayName || selfUser.email || "You"} (You)`;
    return userNames[posterId] ?? posterId;
  };

  const refresh = async (userId: string) => {
    setSites(await DisplaySavedSites(userId));
  };

  const resolveCurrentBackendUser = useCallback(async () => {
    if (!user) {
      throw new Error("You must be signed in to manage saved sites.");
    }

    const localUser = await EnsureUser({
      externalId: user.uid,
      email: user.email ?? undefined,
      displayName: user.displayName ?? undefined,
    });

    setSelfUser(localUser);
    return localUser;
  }, [user]);

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
        const allUsers = await ListUsers();
        const nextUserNames = Object.fromEntries(
          allUsers.map((entry) => [entry.id, entry.displayName || entry.email || entry.id])
        );
        setUserNames(nextUserNames);
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
    <section className="mx-auto max-w-4xl space-y-4">
      <div className="rounded-xl bg-base-200 p-4">
        <h2 className="text-3xl font-bold">Saved Sites</h2>
        <p className="mt-1 text-lg">Save important websites so they are easy to open later.</p>
      </div>

      <form onSubmit={handleAdd} className="rounded-xl bg-base-100 p-4">
        <label htmlFor="site-title" className="mb-2 block text-lg font-semibold">
          Website name
        </label>
        <input
          id="site-title"
          className="input input-bordered mb-3 w-full text-lg"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: Family Photos"
          required
        />

        <label htmlFor="site-url" className="mb-2 block text-lg font-semibold">
          Website address
        </label>
        <input
          id="site-url"
          className="input input-bordered w-full text-lg"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          required
        />

        <button type="submit" className="btn btn-primary mt-4 w-full text-xl" disabled={loading || !user}>
          Save Website
        </button>
      </form>

      <div className="rounded-xl bg-base-100 p-4">
        <h3 className="text-2xl font-bold">Your saved websites</h3>
        <ul className="mt-3 space-y-2">
          {sites.length === 0 ? <li className="text-lg">No websites saved yet.</li> : null}
          {sites.map((site) => (
            <li key={site.id} className="rounded-lg bg-base-200 p-3">
              <a className="block text-lg font-semibold underline" href={site.url} target="_blank" rel="noreferrer">
                {site.title}
              </a>
              <p className="text-sm opacity-80">Saved by: {resolvePosterName(site.userId)}</p>
              <button type="button" className="btn btn-error btn-sm mt-2" onClick={() => void remove(site.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {error ? <p className="text-error text-lg font-semibold">{error}</p> : null}
    </section>
  );
}

export default SavedSites;
