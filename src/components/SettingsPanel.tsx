import { useEffect, useRef, useState } from "react";
import { Settings as SettingsIcon, X } from "lucide-react";
import { THEMES, FONTS, PAPERS } from "@/lib/themes";
import { useSettings } from "@/hooks/use-settings";

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { settings, update } = useSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Settings"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
      >
        <SettingsIcon className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 w-72 rounded-md border border-border bg-popover p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-base">Settings</h3>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Theme</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update({ theme: t.id })}
                  title={t.label}
                  className={`h-8 w-full rounded border-2 transition ${
                    settings.theme === t.id ? "border-foreground" : "border-transparent"
                  }`}
                  style={{ background: t.swatch }}
                  aria-label={t.label}
                />
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground italic">
              {THEMES.find((t) => t.id === settings.theme)?.label}
            </p>
          </div>

          <div className="mb-4">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Default writing font</label>
            <select
              value={settings.font}
              onChange={(e) => update({ font: e.target.value })}
              className="mt-2 w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <optgroup label="Handwritten">
                {FONTS.filter((f) => f.category === "Handwritten").map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </optgroup>
              <optgroup label="Serif">
                {FONTS.filter((f) => f.category === "Serif").map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </optgroup>
              <optgroup label="Typewriter & Mono">
                {FONTS.filter((f) => f.category === "Typewriter" || f.category === "Mono").map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">UI Serif Font</label>
            <select
              value={settings.serifFont}
              onChange={(e) => update({ serifFont: e.target.value })}
              className="mt-2 w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {FONTS.filter((f) => f.category === "Serif").map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Default Paper Style</label>
            <select
              value={settings.paper}
              onChange={(e) => update({ paper: e.target.value })}
              className="mt-2 w-full rounded border border-border bg-card px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {PAPERS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
