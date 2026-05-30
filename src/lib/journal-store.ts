export type JournalEntry = {
  id: string;
  folderId: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  paper?: string;
  font?: string;
  createdAt: number;
  updatedAt: number;
};

export type Folder = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  coverStyle: string;
  hasPassword?: boolean;
  createdAt: number;
};

export type Settings = {
  theme: string;
  font: string;
  serifFont: string;
  paper: string;
};

export const FOLDER_COLORS = ["midnight", "burgundy", "forest", "ochre", "slate", "lavender"] as const;

export const DEFAULT_SETTINGS: Settings = {
  theme: "cream",
  font: "Caveat",
  serifFont: "Lora",
  paper: "ruled",
};

const notify = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("journal:change"));
  }
};

const getAuthHeaders = (folderId?: string) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (folderId && typeof sessionStorage !== 'undefined') {
    const pwd = sessionStorage.getItem(`notebook-pwd-${folderId}`);
    if (pwd) headers['x-folder-password'] = pwd;
  }
  return headers;
};

export const listFolders = async (): Promise<Folder[]> => {
  const res = await fetch('/api/folders');
  return res.json();
};

export const getFolder = async (id: string, password?: string): Promise<Folder | undefined> => {
  const headers = getAuthHeaders(id);
  if (password) {
    headers['x-folder-password'] = password;
  }
  const res = await fetch(`/api/folders/${id}`, { headers });
  if (res.status === 401) throw new Error("Unauthorized");
  if (res.status === 404) return undefined;
  
  if (password && typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(`notebook-pwd-${id}`, password);
  }
  
  return res.json();
};

export const createFolder = async (data: { name: string, color: string, coverStyle?: string, icon?: string, password?: string }): Promise<Folder> => {
  const res = await fetch('/api/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const folder = await res.json();
  
  if (data.password && typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(`notebook-pwd-${folder.id}`, data.password);
  }
  
  notify();
  return folder;
};

export const updateFolder = async (data: { id: string, patch: Partial<Folder> }) => {
  await fetch(`/api/folders/${data.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.patch)
  });
  notify();
};

export const removeFolder = async (id: string) => {
  await fetch(`/api/folders/${id}`, { method: 'DELETE', headers: getAuthHeaders(id) });
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(`notebook-pwd-${id}`);
  }
  notify();
};

export const listEntries = async (folderId?: string): Promise<JournalEntry[]> => {
  const res = await fetch(`/api/entries${folderId ? `?folderId=${folderId}` : ''}`, {
    headers: getAuthHeaders(folderId)
  });
  if (res.status === 401) throw new Error("Unauthorized");
  return res.json();
};

export const getEntry = async (id: string, folderId?: string): Promise<JournalEntry | undefined> => {
  const res = await fetch(`/api/entries/${id}`, {
    headers: getAuthHeaders(folderId)
  });
  if (res.status === 401) {
    const data = await res.json();
    const err = new Error("Unauthorized");
    (err as any).folderId = data.folderId;
    throw err;
  }
  if (res.status === 404) return undefined;
  return res.json();
};

export const createEntry = async (folderId: string): Promise<JournalEntry> => {
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderId })
  });
  const entry = await res.json();
  notify();
  return entry;
};

export const updateEntry = async (data: { id: string, patch: Partial<JournalEntry> }) => {
  await fetch(`/api/entries/${data.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.patch)
  });
  notify();
};

export const removeEntry = async (id: string) => {
  await fetch(`/api/entries/${id}`, { method: 'DELETE' });
  notify();
};

export const getSettings = async (): Promise<Settings> => {
  const res = await fetch('/api/settings');
  return res.json();
};

export const updateSettings = async (patch: Partial<Settings>) => {
  await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  notify();
};
