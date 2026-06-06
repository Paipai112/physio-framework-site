import Link from "next/link";
import { layers } from "@/data/layers";

/**
 * HEX colors for each layer color name used in layers.ts.
 */
const LAYER_HEX_COLORS: Record<string, string> = {
  red: "#EF4444",
  amber: "#F59E0B",
  emerald: "#10B981",
  blue: "#3B82F6",
  violet: "#8B5CF6",
  gray: "#6B7280",
} as const;

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getLayerHex(layerColor: string): string {
  return LAYER_HEX_COLORS[layerColor] ?? "#6B7280";
}

interface LayerNavigationProps {
  /** ID of the currently active layer, e.g. "L1" */
  activeLayerId?: string;
}

/**
 * Horizontal layer navigation bar showing chip-style buttons for each layer.
 * Each chip links to `/layer/[id]` and uses layer-specific colors for
 * border, text, and background via inline styles.
 *
 * L0 is excluded by default since it has no dedicated page.
 */
export default function LayerNavigation({ activeLayerId }: LayerNavigationProps) {
  return (
    <nav className="flex flex-wrap items-center gap-3">
      {layers
        .filter((layer) => layer.id !== "L0")
        .map((layer) => {
          const hex = getLayerHex(layer.color);
          const isActive = layer.id === activeLayerId;

          const chipStyle: React.CSSProperties = isActive
            ? {
                color: "#FFFFFF",
                borderColor: hexToRgba(hex, 0.6),
                backgroundColor: hexToRgba(hex, 0.15),
              }
            : {
                color: hex,
                borderColor: hexToRgba(hex, 0.3),
                backgroundColor: hexToRgba(hex, 0.05),
              };

          return (
            <Link
              key={layer.id}
              href={`/layer/${layer.id}`}
              style={chipStyle}
              className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border whitespace-nowrap"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#FFFFFF";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  hexToRgba(hex, 0.5);
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  hexToRgba(hex, 0.1);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = isActive
                  ? "#FFFFFF"
                  : hex;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = isActive
                  ? hexToRgba(hex, 0.6)
                  : hexToRgba(hex, 0.3);
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = isActive
                  ? hexToRgba(hex, 0.15)
                  : hexToRgba(hex, 0.05);
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="mr-1.5">{layer.icon}</span>
              {layer.name}
            </Link>
          );
        })}
    </nav>
  );
}
