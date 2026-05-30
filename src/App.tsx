import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./routes/index";
import Folder from "./routes/folder.$id";
import Entry from "./routes/entry.$id";
import { ThemeToggle } from "./components/ThemeToggle";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/folder/:id" element={<Folder />} />
        <Route path="/entry/:id" element={<Entry />} />
      </Routes>
      <ThemeToggle />
    </BrowserRouter>
  );
}
