import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Search, Trash2, Pencil, Lock } from "lucide-react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { getFolder, listEntries, createEntry, updateEntry, removeEntry, removeFolder, type Folder, type JournalEntry } from "@/lib/journal-store";

export default function FolderPage() {
  const { id } = useParams<{ id: string }>();
  const folderId = id as string;
  const navigate = useNavigate();
  const [folder, setFolder] = useState<Folder | undefined>();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const [isLocked, setIsLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const load = async (pwd?: string) => {
    try {
      setFolder(await getFolder(folderId, pwd));
      setEntries(await listEntries(folderId));
      setIsLocked(false);
      setPasswordError(false);
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        setIsLocked(true);
        if (pwd) setPasswordError(true);
      }
    }
  };

  useEffect(() => {
    load();
    const onAuth = () => load();
    window.addEventListener("journal:change", onAuth);
    return () => window.removeEventListener("journal:change", onAuth);
  }, [id]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    load(passwordInput);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = entries;
    if (q) {
      list = list.filter((e) => {
        const dateStr = new Date(e.createdAt).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).toLowerCase();
        const shortDateStr = new Date(e.createdAt).toLocaleDateString().toLowerCase();
        
        return (
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          dateStr.includes(q) ||
          shortDateStr.includes(q)
        );
      });
    }
    return [...list].sort((a, b) =>
      sort === "newest" ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt,
    );
  }, [entries, query, sort]);

  const handleCreate = async () => {
    const e = await createEntry(folderId);
    if (e) {
      navigate(`/entry/${e.id}`);
    }
  };

  const handleRename = async (eid: string, current: string) => {
    const next = prompt("Rename entry", current);
    if (next && next.trim()) {
      await updateEntry({ id: eid, patch: { title: next.trim() } });
      setEntries(await listEntries(folderId));
    }
  };

  const handleDelete = async (eid: string) => {
    if (confirm("Delete this entry forever?")) {
      await removeEntry(eid);
      setEntries(await listEntries(folderId));
    }
  };

  const handleDeleteFolder = async () => {
    if (confirm(`Delete notebook "${folder?.name}" and all its entries? This cannot be undone.`)) {
      await removeFolder(folderId);
      navigate("/");
    }
  };

  if (!folder && !isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-handwritten text-2xl mb-2">notebook not found</p>
          <Link to="/" className="underline text-sm">Back to shelf</Link>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl mb-2">Locked Notebook</h2>
          <p className="text-sm text-muted-foreground italic mb-6">
            Please enter the secret password to open this notebook.
          </p>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(false);
              }}
              autoFocus
              placeholder="Enter password..."
              className={`w-full rounded border bg-background px-4 py-2 mb-4 focus:outline-none focus:ring-2 ${passwordError ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-ring'}`}
            />
            {passwordError && (
              <p className="text-xs text-destructive mb-4 animate-in fade-in slide-in-from-top-1">
                Incorrect password. Please try again.
              </p>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate("/")} className="flex-1 py-2 text-sm rounded border border-border hover:bg-accent transition text-muted-foreground">
                Back to shelf
              </button>
              <button type="submit" className="flex-1 py-2 text-sm rounded bg-primary text-primary-foreground hover:opacity-90 transition">
                Unlock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 md:px-10 border-b border-border">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> shelf
        </Link>
        <h1 className="font-handwritten text-2xl md:text-3xl">{folder?.name}</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleDeleteFolder} aria-label="Delete Notebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </button>
          <SettingsPanel />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search entries…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-card border border-border rounded-sm font-serif text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="px-3 py-2 bg-card border border-border rounded-sm font-serif text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" /> New entry
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-handwritten text-2xl text-muted-foreground mb-2">
              this notebook is empty
            </p>
            <p className="text-sm text-muted-foreground italic">
              Start a new entry to fill the first page.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((e) => (
                <div
                  key={e.id}
                  className="notebook-card p-5 group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300"
                  onClick={() => navigate(`/entry/${e.id}`)}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="font-serif text-lg leading-tight">
                      {e.mood && <span className="mr-1">{e.mood}</span>}
                      {e.title || "Untitled"}
                    </h2>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={(ev) => { ev.stopPropagation(); handleRename(e.id, e.title); }} aria-label="Rename" className="p-1.5 rounded hover:bg-accent text-muted-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id); }} aria-label="Delete" className="p-1.5 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 italic min-h-[3em]">
                    {e.content.trim() || "blank page…"}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                    <span>edited {relativeTime(e.updatedAt)}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
