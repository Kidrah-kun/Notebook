export type ThemeDef = {
  id: string;
  label: string;
  mode: "light" | "dark";
  swatch: string;
};

export const THEMES: ThemeDef[] = [
  { id: "cream", label: "Cream Paper", mode: "light", swatch: "#f5e9cd" },
  { id: "sepia", label: "Aged Sepia", mode: "light", swatch: "#e8d5a8" },
  { id: "lavender", label: "Soft Lavender", mode: "light", swatch: "#e6d9f0" },
  { id: "linen", label: "White Linen", mode: "light", swatch: "#f4f0e8" },
  { id: "midnight", label: "Midnight Ink", mode: "dark", swatch: "#1a1d2e" },
  { id: "rainy", label: "Rainy Evening", mode: "dark", swatch: "#2a2a30" },
  { id: "forest", label: "Forest Cabin", mode: "dark", swatch: "#1f2a22" },
  { id: "ember", label: "Warm Ember", mode: "dark", swatch: "#2b1f1a" },
  { id: "sakura", label: "Cherry Blossom", mode: "light", swatch: "#fdf0f4" },
  { id: "ocean", label: "Deep Ocean", mode: "dark", swatch: "#102a43" },
  { id: "matcha", label: "Matcha Tea", mode: "light", swatch: "#eef2e6" },
];

export const PAPERS = [
  { id: "ruled", label: "Ruled" },
  { id: "dotted", label: "Dotted" },
  { id: "grid", label: "Grid" },
  { id: "blank", label: "Blank" },
  { id: "aged", label: "Aged" },
  { id: "legal", label: "Legal Pad" },
];

export const FONTS = [
  { id: "Caveat", label: "Caveat", css: "'Caveat', cursive", category: "Handwritten" },
  { id: "Kalam", label: "Kalam", css: "'Kalam', cursive", category: "Handwritten" },
  { id: "Patrick Hand", label: "Patrick Hand", css: "'Patrick Hand', cursive", category: "Handwritten" },
  { id: "Indie Flower", label: "Indie Flower", css: "'Indie Flower', cursive", category: "Handwritten" },
  { id: "Shadows Into Light", label: "Shadows Into Light", css: "'Shadows Into Light', cursive", category: "Handwritten" },
  { id: "Homemade Apple", label: "Homemade Apple", css: "'Homemade Apple', cursive", category: "Handwritten" },
  { id: "Architects Daughter", label: "Architects Daughter", css: "'Architects Daughter', cursive", category: "Handwritten" },
  { id: "Gloria Hallelujah", label: "Gloria Hallelujah", css: "'Gloria Hallelujah', cursive", category: "Handwritten" },
  { id: "Reenie Beanie", label: "Reenie Beanie", css: "'Reenie Beanie', cursive", category: "Handwritten" },
  { id: "Lora", label: "Lora (serif)", css: "'Lora', Georgia, serif", category: "Serif" },
  { id: "EB Garamond", label: "EB Garamond", css: "'EB Garamond', serif", category: "Serif" },
  { id: "Courier Prime", label: "Courier Prime", css: "'Courier Prime', monospace", category: "Typewriter" },
  { id: "JetBrains Mono", label: "JetBrains Mono", css: "'JetBrains Mono', monospace", category: "Mono" },
];

export function fontCss(id: string) {
  return FONTS.find((f) => f.id === id)?.css ?? FONTS[0].css;
}
