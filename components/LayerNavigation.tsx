import Link from "next/link";
import { layers } from "@/data/layers";

interface Props {
  activeLayerId?: string;
}

const layerColors: Record<string, string> = {
  L1: "border-red-500/50 hover:border-red-400 bg-red-500/5",
  L2: "border-amber-500/50 hover:border-amber-400 bg-amber-500/5",
  L3: "border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/5",
  L4: "border-blue-500/50 hover:border-blue-400 bg-blue-500/5",
  L5: "border-violet-500/50 hover:border-violet-400 bg-violet-500/5",
};

const activeColors: Record<string, string> = {
  L1: "border-red-400 bg-red-500/10 ring-1 ring-red-500/30",
  L2: "border-amber-400 bg-amber-500/10 ring-1 ring-amber-500/30",
  L3: "border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/30",
  L4: "border-blue-400 bg-blue-500/10 ring-1 ring-blue-500/30",
  L5: "border-violet-400 bg-violet-500/10 ring-1 ring-violet-500/30",
};

export default function LayerNavigation({ activeLayerId }: Props) {
  return (
    <nav className="space-y-2">
      {layers.map((layer) => {
        const isActive = layer.id === activeLayerId;
        const styleClass = isActive
          ? activeColors[layer.id]
          : layerColors[layer.id];

        return (
          <Link
            key={layer.id}
            href={`/layer/${layer.id}`}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${styleClass} ${
              isActive ? "" : "opacity-70 hover:opacity-100"
            }`}
          >
            <span className="text-xl">{layer.icon}</span>
            <div>
              <div
                className={`text-sm font-medium ${
                  isActive ? "text-white" : "text-slate-300"
                }`}
              >
                {layer.name}
              </div>
              <div className="text-xs text-slate-500">{layer.id}</div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
