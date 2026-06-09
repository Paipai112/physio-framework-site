import type { Metadata } from "next";
import PanoramicMap from "@/components/PanoramicMap";
import { layers } from "@/data/layers";
import { getLayerHex } from "@/data/colors";
import { modules } from "@/data/modules";

export const metadata: Metadata = {
  title: "全景地图 — 生理信号处理框架",
  description: "全模块依赖关系地图，点击任意模块查看上下游依赖关系",
};

export default function PanoramaPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          全景地图
        </h1>
        <p className="mt-3 text-text-secondary max-w-2xl">
          展示全部 {modules.length}{" "}
          个模块之间的依赖关系。点击任意模块高亮其上下游依赖，悬停查看简介，点击箭头跳转到详情页。
        </p>
        {/* Layer legend pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {layers
            .filter((l) => l.id !== "L0")
            .map((layer) => (
              <span
                key={layer.id}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
                style={{
                  borderColor: getLayerHex(layer.id) + "40",
                  color: getLayerHex(layer.id),
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getLayerHex(layer.id) }}
                />
                {layer.name}
              </span>
            ))}
        </div>
      </div>

      <PanoramicMap />
    </div>
  );
}
