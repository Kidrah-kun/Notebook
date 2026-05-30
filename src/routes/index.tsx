import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import GlassIcons from "@/components/GlassIcons";
import { SettingsPanel } from "@/components/SettingsPanel";
import { NewFolderDialog } from "@/components/NewFolderDialog";
import { listFolders, removeFolder, type Folder, FOLDER_COLORS } from "@/lib/journal-store";
import { Book, BookOpen, Heart, Star, Coffee, Cloud, Compass, Feather, Leaf, Moon, Sun, Camera, Music, Map, PenTool, Sparkles } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Book, BookOpen, Heart, Star, Coffee, Cloud, Compass, Feather,
  Leaf, Moon, Sun, Camera, Music, Map, PenTool, Sparkles
};

const gradientMapping: Record<string, string> = {
  midnight: "linear-gradient(135deg, #1e293b, #0f172a)",
  burgundy: "linear-gradient(135deg, #7f1d1d, #450a0a)",
  forest: "linear-gradient(135deg, #14532d, #052e16)",
  ochre: "linear-gradient(135deg, #78350f, #451a03)",
  slate: "linear-gradient(135deg, #334155, #0f172a)",
  lavender: "linear-gradient(135deg, #581c87, #3b0764)"
};

export default function Index() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem("notebook-mock-auth") === "true" : false;
  });
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [manage, setManage] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const load = async () => setFolders(await listFolders());
      load();
      window.addEventListener("journal:change", load);
      
      // Clear unlocked passwords when visiting the shelf
      if (typeof sessionStorage !== 'undefined') {
        const keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith('notebook-pwd-')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => sessionStorage.removeItem(k));
      }

      return () => window.removeEventListener("journal:change", load);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    localStorage.setItem("notebook-mock-auth", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("notebook-mock-auth");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen flex flex-col text-[#2C2C2C] selection:bg-[#E8E2D2]"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
          
          {/* Floating Words */}
          <div className="absolute inset-0 max-w-5xl mx-auto w-full h-full pointer-events-none hidden md:block">
            <span className="absolute top-[25%] left-[20%] font-serif tracking-widest text-[#5C5C5C] text-sm">JOURNALS</span>
            <span className="absolute top-[25%] right-[20%] font-serif tracking-widest text-[#5C5C5C] text-sm">REFLECTIONS</span>
            <span className="absolute bottom-[30%] left-[25%] font-serif tracking-widest text-[#5C5C5C] text-sm">SPACES</span>
            <span className="absolute bottom-[30%] right-[25%] font-serif tracking-widest text-[#5C5C5C] text-sm">CONNECTION</span>
          </div>

          <div className="max-w-2xl relative z-10 bg-white/40 backdrop-blur-sm p-12 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="font-handwritten text-7xl md:text-8xl mb-6 text-[#1A1A1A]">notebook.</h1>
            <p className="font-serif text-lg md:text-xl text-[#4A4A4A] mb-12 leading-relaxed">
              A deeply personal, distraction-free space for your thoughts, secrets, and ideas. 
              Keep them locked away in beautifully crafted digital journals.
            </p>
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur border border-[#E2E2E2] rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 font-serif text-lg text-[#2C2C2C]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </main>
        <footer className="py-6 text-center font-serif text-sm text-[#8C8C8C] relative z-10 bg-white/20 backdrop-blur-sm">
          Designed for thinkers, writers, and dreamers.
        </footer>
      </div>
    );
  }

  const items = folders.map((f) => {
    const IconCmp = f.icon && ICON_MAP[f.icon] ? ICON_MAP[f.icon] : null;
    return {
      icon: IconCmp ? <IconCmp className="h-8 w-8 text-white" /> : <span className="text-white font-handwritten text-3xl leading-none">{f.name.charAt(0).toUpperCase()}</span>,
      color: f.color,
      coverStyle: f.coverStyle,
      label: f.name,
      hasPassword: f.hasPassword,
      onClick: () => navigate(`/folder/${f.id}`),
      onDelete: async () => {
        if (confirm(`Delete "${f.name}" and all its entries?`)) {
          await removeFolder(f.id);
          setFolders(await listFolders());
        }
      }
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="font-handwritten text-2xl">notebook.</div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLogout}
            className="text-xs font-serif text-muted-foreground hover:text-foreground mr-2"
          >
            Sign out
          </button>
          <button
            onClick={() => setManage((v) => !v)}
            className="text-sm text-muted-foreground hover:text-foreground italic px-2"
          >
            {manage ? "done" : "manage"}
          </button>
          <SettingsPanel />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="text-center max-w-xl">
          <p className="font-handwritten text-3xl md:text-4xl text-muted-foreground mb-3">
            welcome back,
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            Open a notebook
          </h1>
          <p className="text-muted-foreground italic">
            Pick a shelf, or start a new one. Everything stays on this device.
          </p>
        </div>

        {folders.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="font-handwritten text-2xl text-muted-foreground mb-4">your shelf is empty</p>
          </div>
        ) : (
          <GlassIcons items={items} isManaging={manage} className="mt-6" />
        )}

        <button
          onClick={() => setShowNew(true)}
          className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-border bg-card hover:bg-accent text-foreground transition"
        >
          <Plus className="h-4 w-4" /> New notebook
        </button>
      </main>

      <footer className="text-center pb-8 text-sm text-muted-foreground italic">
        written quietly, just for you
      </footer>

      {showNew && <NewFolderDialog onClose={() => setShowNew(false)} />}
    </div>
  );
}
