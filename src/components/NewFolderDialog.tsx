import { useState } from "react";
import { X, Book, BookOpen, Heart, Star, Coffee, Cloud, Compass, Feather, Leaf, Moon, Sun, Camera, Music, Map, PenTool, Sparkles } from "lucide-react";
import { FOLDER_COLORS, createFolder } from "@/lib/journal-store";

const ICON_MAP: Record<string, React.ElementType> = {
  Book, BookOpen, Heart, Star, Coffee, Cloud, Compass, Feather,
  Leaf, Moon, Sun, Camera, Music, Map, PenTool, Sparkles
};
const ICONS = Object.keys(ICON_MAP);

export function NewFolderDialog({ onClose, onCreated }: { onClose: () => void; onCreated?: (id: string) => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(FOLDER_COLORS[0]);
  const [coverStyle, setCoverStyle] = useState<string>("solid");
  const [icon, setIcon] = useState<string>("Book");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const f = await createFolder({ name, color, coverStyle, icon, password: password.trim() || undefined });
    onCreated?.(f.id);
    onClose();
  };

  const gradients: Record<string, string> = {
    midnight: "linear-gradient(135deg, oklch(0.35 0.05 250), oklch(0.25 0.05 250))",
    burgundy: "linear-gradient(135deg, oklch(0.40 0.12 15), oklch(0.30 0.12 15))",
    forest: "linear-gradient(135deg, oklch(0.40 0.08 140), oklch(0.30 0.08 140))",
    ochre: "linear-gradient(135deg, oklch(0.60 0.12 65), oklch(0.50 0.12 65))",
    slate: "linear-gradient(135deg, oklch(0.45 0.04 220), oklch(0.35 0.04 220))",
    lavender: "linear-gradient(135deg, oklch(0.50 0.08 290), oklch(0.40 0.08 290))",
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-sm rounded-md border border-border bg-popover p-5 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg">New notebook</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="text-xs uppercase tracking-wide text-muted-foreground">Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Travel diary"
          className="mt-1.5 mb-4 w-full rounded border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />

        <label className="text-xs uppercase tracking-wide text-muted-foreground">Color</label>
        <div className="mt-2 mb-4 flex gap-2">
          {FOLDER_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={c}
              className={`h-8 w-8 rounded-full border-2 transition ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
              style={{ background: gradients[c] }}
            />
          ))}
        </div>

        <label className="text-xs uppercase tracking-wide text-muted-foreground">Texture</label>
        <div className="mt-2 mb-5 flex flex-wrap gap-2">
          {["solid", "dots", "lines", "grid", "leather"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setCoverStyle(s)}
              className={`px-3 py-1 text-xs rounded border transition ${coverStyle === s ? "border-foreground bg-accent text-foreground" : "border-border bg-card text-muted-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <label className="text-xs uppercase tracking-wide text-muted-foreground">Icon</label>
        <div className="mt-2 mb-5 flex flex-wrap gap-1">
          {ICONS.map((name) => {
            const IconComponent = ICON_MAP[name];
            return (
              <button
                key={name}
                type="button"
                onClick={() => setIcon(name)}
                className={`h-8 w-8 flex items-center justify-center rounded border transition ${icon === name ? "border-foreground bg-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                <IconComponent className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        <label className="text-xs uppercase tracking-wide text-muted-foreground flex justify-between">
          <span>Secret Password</span>
          <span className="text-muted-foreground/50 italic">(optional)</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank for no password"
          className="mt-1.5 mb-2 w-full rounded border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <p className="text-[10px] text-muted-foreground italic mb-6 leading-tight">
          Warning: If you forget this password, you cannot recover it or change it without deleting the entire notebook and all its contents.
        </p>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button type="submit" className="px-4 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:opacity-90">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
