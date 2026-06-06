export const LAYER_COLORS: Record<string, string> = {
  L1: "#FF5757",
  L2: "#FFB347",
  L3: "#4ADE80",
  L4: "#60A5FA",
  L5: "#C084FC",
} as const;

export const LAYER_GLOW_COLORS: Record<string, string> = {
  L1: "rgba(255, 87, 87, 0.15)",
  L2: "rgba(255, 179, 71, 0.15)",
  L3: "rgba(74, 222, 128, 0.15)",
  L4: "rgba(96, 165, 250, 0.15)",
  L5: "rgba(192, 132, 252, 0.15)",
} as const;

export const LAYER_COLOR_FALLBACK = "#737373";

export function getLayerHex(id: string): string {
  return LAYER_COLORS[id] ?? LAYER_COLOR_FALLBACK;
}

export function getLayerGlow(id: string): string {
  return LAYER_GLOW_COLORS[id] ?? "rgba(115, 115, 115, 0.1)";
}

export const layerBorderColors: Record<string, string> = {
  L1: "border-red-500/20 hover:border-red-500/40",
  L2: "border-amber-500/20 hover:border-amber-500/40",
  L3: "border-emerald-500/20 hover:border-emerald-500/40",
  L4: "border-blue-500/20 hover:border-blue-500/40",
  L5: "border-violet-500/20 hover:border-violet-500/40",
};

export const layerBadgeColors: Record<string, string> = {
  L1: "bg-red-500/10 text-red-400 border-red-500/20",
  L2: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  L3: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  L4: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  L5: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export const layerGlowBorders: Record<string, string> = {
  L1: "border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(255,87,87,0.15)]",
  L2: "border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(255,179,71,0.15)]",
  L3: "border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]",
  L4: "border-blue-500/30 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]",
  L5: "border-violet-500/30 hover:border-violet-500/60 hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]",
};
