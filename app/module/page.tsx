import type { Metadata } from "next";
import { modules } from "@/data/modules";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ModuleListClient from "@/components/ModuleListClient";

export const metadata: Metadata = {
  title: "全部模块 - 生理信号处理框架",
  description:
    "浏览全部98个生理信号处理知识模块，涵盖传感器、信号处理、特征提取、模式识别与临床决策支持",
};

export default function ModuleListPage() {
  return (
    <div className="space-y-8">
      <BreadcrumbNav
        crumbs={[
          { label: "首页", href: "/" },
          { label: "全部模块" },
        ]}
      />

      <ModuleListClient modules={modules} />
    </div>
  );
}
