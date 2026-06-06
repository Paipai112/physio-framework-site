export const LAYER_COLORS: Record<string, string> = {
  L1: "#ef4444",
  L2: "#f59e0b",
  L3: "#10b981",
  L4: "#3b82f6",
  L5: "#8b5cf6",
} as const;

export const LAYER_COLOR_FALLBACK = "#64748b";

export function getLayerHex(id: string): string {
  return LAYER_COLORS[id] ?? LAYER_COLOR_FALLBACK;
}

export const layerBorderColors: Record<string, string> = {
  L1: "border-red-500/20 hover:border-red-500/50",
  L2: "border-amber-500/20 hover:border-amber-500/50",
  L3: "border-emerald-500/20 hover:border-emerald-500/50",
  L4: "border-blue-500/20 hover:border-blue-500/50",
  L5: "border-violet-500/20 hover:border-violet-500/50",
};

export const layerBadgeColors: Record<string, string> = {
  L1: "bg-red-500/10 text-red-400",
  L2: "bg-amber-500/10 text-amber-400",
  L3: "bg-emerald-500/10 text-emerald-400",
  L4: "bg-blue-500/10 text-blue-400",
  L5: "bg-violet-500/10 text-violet-400",
};
