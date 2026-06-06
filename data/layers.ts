import { Layer } from "./types";

export const layers: Layer[] = [
  {
    id: "L0",
    name: "人体/信号源",
    description: "人体作为生理信号的源头，提供所有传感器测量的物理基础",
    icon: "👤",
    color: "gray",
  },
  {
    id: "L1",
    name: "传感器层",
    description:
      "生物医学信号采集的物理基础与传感器技术，涵盖光电、压电、电容等多种传感原理",
    icon: "📡",
    color: "red",
  },
  {
    id: "L2",
    name: "基础指标层",
    description: "从传感器原始信号中提取的初级生理参数，如心率、心率变异性、血氧、呼吸频率等·是所有中高级指标的计算基石",
    icon: "🔧",
    color: "amber",
  },
  {
    id: "L3",
    name: "中级（融合）指标层",
    description: "基于多个基础指标融合计算得出的综合指标，如睡眠分期、训练负荷(TRIMP)、急慢性负荷比(ACWR)、最大摄氧量(VO₂max)等·融合多维度数据产生更高级的洞察",
    icon: "📊",
    color: "emerald",
  },
  {
    id: "L4",
    name: "高级指标层",
    description: "跨系统多维度融合指标，WHOOP/Polar/Garmin/Fitbit/Oura等产品层面的专有评分体系·将多个中级指标加权组合为可读的恢复、训练、睡眠等评分",
    icon: "🧠",
    color: "blue",
  },
  {
    id: "L5",
    name: "AI教练/平台层",
    description: "基于高级指标的AI解读与个性化建议，将复杂数据转化为可执行的健康/训练指导·涵盖WHOOP Coach、Gemini Health Coach等AI教练体系",
    icon: "💊",
    color: "violet",
  },
];

export function getLayerById(id: string): Layer | undefined {
  return layers.find((l) => l.id === id);
}

export function getLayerColor(id: string): string {
  const layer = getLayerById(id);
  return layer?.color ?? "slate";
}
