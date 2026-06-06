// Auto-generated from V1 data.json
// Do not edit manually. Data in modules-data.ts

import { Module } from "./types";
import { modules as moduleData } from "./modules-data";

export const modules: Module[] = moduleData;

export function getModuleById(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getModulesByLayer(layerId: string): Module[] {
  return modules.filter((m) => m.layer === layerId);
}

export function getModulesByIds(ids: string[]): Module[] {
  return ids
    .map((id) => getModuleById(id))
    .filter(Boolean) as Module[];
}
