import "./GlassIcons.css";
import type { ReactElement } from "react";

export type GlassIconsItem = {
  icon: ReactElement;
  color: string;
  coverStyle?: string;
  label: string;
  hasPassword?: boolean;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  customClass?: string;
};

const gradientMapping: Record<string, string> = {
  midnight: "linear-gradient(135deg, oklch(0.35 0.05 250), oklch(0.25 0.05 250))",
  burgundy: "linear-gradient(135deg, oklch(0.40 0.12 15), oklch(0.30 0.12 15))",
  forest: "linear-gradient(135deg, oklch(0.40 0.08 140), oklch(0.30 0.08 140))",
  ochre: "linear-gradient(135deg, oklch(0.60 0.12 65), oklch(0.50 0.12 65))",
  slate: "linear-gradient(135deg, oklch(0.45 0.04 220), oklch(0.35 0.04 220))",
  lavender: "linear-gradient(135deg, oklch(0.50 0.08 290), oklch(0.40 0.08 290))",
};

export default function GlassIcons({
  items,
  isManaging = false,
  className = "",
}: {
  items: GlassIconsItem[];
  isManaging?: boolean;
  className?: string;
}) {
  const getBg = (color: string) =>
    gradientMapping[color] ? { background: gradientMapping[color] } : { background: color };

  return (
    <div className={`icon-btns ${className}`}>
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          aria-label={item.label}
          onClick={item.onClick}
          className={`icon-btn ${item.customClass ?? ""}`}
        >
          <span className="icon-btn__back" style={getBg(item.color)} data-cover={item.coverStyle || "solid"} />
          <span className="icon-btn__front">
            {item.hasPassword && !isManaging && (
              <span className="absolute top-2 right-2 text-white/70">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            )}
            {isManaging && item.onDelete && (
              <button
                type="button"
                className="absolute -top-2 -right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  item.onDelete?.(e);
                }}
                aria-label="Delete notebook"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <span className="icon-btn__icon">{item.icon}</span>
          </span>
          <span className="icon-btn__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
