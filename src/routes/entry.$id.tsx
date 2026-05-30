import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Maximize2, Minimize2, FileText, Type, Star, Heart, Cloud, Sun, Moon, Coffee, Book, Music, Camera, Compass, CircleDashed } from "lucide-react";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useSettings } from "@/hooks/use-settings";
import { FONTS, PAPERS, fontCss } from "@/lib/themes";
import { getEntry, getFolder, updateEntry, type JournalEntry } from "@/lib/journal-store";

const ICON_MAP: Record<string, React.ElementType> = {
  Star, Heart, Cloud, Sun, Moon, Coffee, Book, Music, Camera, Compass
};
const ICONS = Object.keys(ICON_MAP);

export default function EntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState("");
  const [paper, setPaper] = useState<string>("ruled");
  const [font, setFont] = useState<string>("Caveat");
  const [focus, setFocus] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [folderName, setFolderName] = useState("");
  const [iconOpen, setIconOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem("notebook-font-size") || "18"));
  const [titleFontSize, setTitleFontSize] = useState(() => parseInt(localStorage.getItem("notebook-title-font-size") || "36"));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem("notebook-font-size", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("notebook-title-font-size", titleFontSize.toString());
  }, [titleFontSize]);

  useEffect(() => {
    const load = async () => {
      try {
        const e = await getEntry(id!);
        if (!e) {
          navigate("/");
          return;
        }
        setEntry(e);
        setTitle(e.title);
        setContent(e.content);
        setMood(e.mood ?? "");
        setTags(e.tags.join(", "));
        setPaper(e.paper ?? settings.paper);
        setFont(e.font ?? settings.font);
        const f = await getFolder(e.folderId);
        if (f) setFolderName(f.name);
      } catch (err: any) {
        if (err.message === "Unauthorized" && err.folderId) {
          navigate(`/folder/${err.folderId}`);
        } else {
          navigate("/");
        }
      }
    };
    load();
  }, [id, navigate, settings.paper, settings.font]);

  useEffect(() => {
    if (!entry) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await updateEntry({
        id: entry.id,
        patch: {
          title: title.trim() || "Untitled",
          content,
          mood: mood || undefined,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          paper,
          font,
        }
      });
      setSavedAt(Date.now());
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [title, content, mood, tags, paper, font, entry]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.minHeight = "0px";
      textareaRef.current.style.minHeight = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, fontSize]);

  if (!entry) return null;

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const created = new Date(entry.createdAt);
  const writingFont = fontCss(font);
  const CurrentIcon = mood && ICON_MAP[mood] ? ICON_MAP[mood] : CircleDashed;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 overflow-x-hidden w-full max-w-[100vw]">
      {!focus && (
        <header className="flex items-center justify-between px-4 py-3 md:px-8 border-b border-border gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Link
              to={`/folder/${entry.folderId}`}
              className="p-2 rounded hover:bg-accent text-muted-foreground transition inline-flex items-center gap-2"
              aria-label="Back to folder"
            >
              <ArrowLeft className="h-4 w-4" /> <span className="text-sm font-serif">{folderName}</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                className="bg-transparent text-foreground focus:outline-none"
                aria-label="Paper style"
              >
                {PAPERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="bg-transparent text-foreground focus:outline-none max-w-[140px]"
                aria-label="Writing font"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="inline-flex items-center rounded border border-border bg-card">
              <span className="px-2 py-1 text-xs text-muted-foreground border-r border-border uppercase tracking-widest">Title</span>
              <button 
                onClick={() => setTitleFontSize(s => Math.max(16, s - 2))} 
                className="px-2 py-1 text-xs font-serif text-muted-foreground hover:text-foreground border-r border-border"
                aria-label="Decrease title size"
              >
                A-
              </button>
              <button 
                onClick={() => setTitleFontSize(s => Math.min(64, s + 2))} 
                className="px-2 py-1 text-sm font-serif text-muted-foreground hover:text-foreground"
                aria-label="Increase title size"
              >
                A+
              </button>
            </div>
            <div className="inline-flex items-center rounded border border-border bg-card">
              <span className="px-2 py-1 text-xs text-muted-foreground border-r border-border uppercase tracking-widest">Body</span>
              <button 
                onClick={() => setFontSize(s => Math.max(12, s - 2))} 
                className="px-2 py-1 text-xs font-serif text-muted-foreground hover:text-foreground border-r border-border"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <button 
                onClick={() => setFontSize(s => Math.min(28, s + 2))} 
                className="px-2 py-1 text-sm font-serif text-muted-foreground hover:text-foreground"
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3 text-xs text-muted-foreground italic">
            <span>{savedAt ? "saved" : "auto-saves"}</span>
            <div className="flex items-center gap-3">
              <button
              onClick={() => setFocus(true)}
              aria-label="Focus mode"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-accent"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <SettingsPanel />
            </div>
          </div>
        </header>
      )}

      {focus && (
        <button
          onClick={() => setFocus(false)}
          aria-label="Exit focus"
          className="fixed top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur hover:bg-accent"
        >
          <Minimize2 className="h-4 w-4" />
        </button>
      )}

      <main className="flex-1 flex justify-center px-4 py-8">
        <div 
          className={`paper paper-${paper} w-full max-w-3xl px-10 md:px-16 pt-[32px] pb-[32px] shadow-md flex flex-col`}
          style={{ aspectRatio: "1 / 1.4142" }}
        >
          <div className="flex items-end justify-between text-xs italic text-muted-foreground h-[32px] pb-1">
            <span>
              {created.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>{words} words</span>
          </div>

          <div className="flex items-end gap-3 h-[64px] mb-[32px] pb-1 relative">
            <div className="relative flex flex-col justify-end">
              <button
                onClick={() => setIconOpen(!iconOpen)}
                className="bg-transparent border-none focus:outline-none cursor-pointer flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ 
                  width: `${Math.max(24, titleFontSize * 0.8)}px`, 
                  height: `${Math.max(24, titleFontSize * 0.8)}px`,
                  transform: "translateY(0.25em)"
                }}
                aria-label="Select Icon"
              >
                <CurrentIcon className="w-full h-full" strokeWidth={1.5} />
              </button>
              
              {iconOpen && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-popover border border-border rounded-md shadow-xl grid grid-cols-4 gap-1 z-50 min-w-[160px]">
                  <button
                    onClick={() => { setMood(""); setIconOpen(false); }}
                    className="h-8 w-8 flex items-center justify-center rounded hover:bg-accent text-muted-foreground"
                  >
                    <CircleDashed className="h-4 w-4" />
                  </button>
                  {ICONS.map((name) => {
                    const IconCmp = ICON_MAP[name];
                    return (
                      <button
                        key={name}
                        onClick={() => { setMood(name); setIconOpen(false); }}
                        className={`h-8 w-8 flex items-center justify-center rounded hover:bg-accent ${mood === name ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
                      >
                        <IconCmp className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="flex-1 min-w-0 bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/50 leading-none"
              style={{ color: "var(--ink)", fontFamily: writingFont, fontSize: `${titleFontSize}px`, padding: 0, margin: 0, lineHeight: 1, transform: "translateY(0.25em)" }}
            />
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing…"
            spellCheck
            className="w-full flex-1 bg-transparent border-none resize-none focus:outline-none placeholder:italic placeholder:text-muted-foreground/50 overflow-hidden"
            style={{ 
              color: "var(--ink)", 
              lineHeight: "32px", 
              fontFamily: writingFont, 
              fontSize: `${fontSize}px`, 
              padding: 0, 
              paddingTop: `${Math.max(0, 14 - 0.3 * fontSize)}px`,
              marginTop: 0
            }}
          />

          {!focus && (
            <div className="mt-8 pt-4 border-t border-border/60">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tags, comma, separated"
                className="w-full bg-transparent border-none text-sm italic focus:outline-none placeholder:text-muted-foreground/50"
                style={{ color: "var(--ink)" }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
