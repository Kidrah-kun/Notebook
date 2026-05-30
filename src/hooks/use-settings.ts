import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SETTINGS, getSettings, updateSettings as apiUpdateSettings, type Settings } from "@/lib/journal-store";
import { fontCss } from "@/lib/themes";

export function applySettings(s: Settings) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", s.theme);
  document.documentElement.style.setProperty("--font-serif", fontCss(s.serifFont));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const load = async () => {
      const s = await getSettings();
      setSettings(s);
      applySettings(s);
    };
    load();
  }, []);

  const update = useCallback(async (patch: Partial<Settings>) => {
    await apiUpdateSettings(patch);
    const s = await getSettings();
    setSettings(s);
    applySettings(s);
  }, []);

  return { settings, update };
}
