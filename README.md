# 生理信号处理框架 / Physiological Signal Processing Framework

> 系统化的穿戴式生理信号处理知识体系  
> A systematic knowledge framework for wearable physiological signal processing

---

## 📖 项目定位 / What is This

这是一个系统化的穿戴式生理信号处理知识体系，覆盖从传感器物理原理到临床应用的技术全栈。

面向可穿戴设备工程师、生物医学工程研究者、运动科学从业者、以及所有对可穿戴健康监测技术感兴趣的开发者。

Built as a structured knowledge base covering the full tech stack — from sensor physics to clinical applications — for wearable device engineers, biomedical researchers, sports scientists, and developers interested in wearable health monitoring.

---

## 🏗️ 五层架构 / Five-Layer Architecture

| 层级 | 名称 | 说明 |
|------|------|------|
| **L0** | 人体/信号源 | 人体作为生理信号的源头，提供所有传感器测量的物理基础 |
| **L1** | 传感器层 | PPG, ECG, BIA, 加速度计, 陀螺仪, 温度, 气压, GSR |
| **L2** | 基础指标层 | HR, HRV, SpO₂, RR, IBI, 加速度等 |
| **L3** | 中级（融合）指标层 | 睡眠分期, VO₂max, TRIMP, ACWR, HRV平衡, 体成分等 |
| **L4** | 高级指标层 | WHOOP恢复, Polar夜充, Garmin身体电量, Oura准备度, Fitbit睡眠评分等 |
| **L5** | AI教练/平台层 | WHOOP Coach, Gemini Health Coach, 厂商生态系统等 |

```
L0: 人体 → L1: 传感器 → L2: 基础指标 → L3: 融合指标 → L4: 高级指标 → L5: AI教练
```

---

## 📊 数据规模 / Data Scale

- **40+ 模块 / 98 total** (L0:1, L1:8, L2:16, L3:39, L4:29, L5:5)
- **84 篇参考文献** / Academic references (论文 / 文档 / 网站 / 专利 / 书籍)
- **43 个术语** / Glossary terms
- **10+ React 组件** / Interactive components
- **5306 行 TypeScript 数据** / Data definitions

---

## 🛠️ 技术栈 / Tech Stack

| 技术 | 用途 |
|------|------|
| [Next.js 14](https://nextjs.org/) | App Router + Static Export |
| [TypeScript](https://www.typescriptlang.org/) | Strict mode, 全类型安全 |
| [React 18](https://react.dev/) | 组件化 UI |
| [Tailwind CSS 3.4](https://tailwindcss.com/) | 实用优先的样式系统 |

### 关键依赖

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.4.0"
}
```

---

## 🚀 快速开始 / Quick Start

```bash
# 安装依赖
npm install

# 本地开发（默认 3000 端口）
npm run dev
# → http://localhost:3000

# 生产构建（纯静态导出）
npm run build
# → out/ 目录

# 预览构建结果
npx serve out/
```

---

## 📁 项目结构 / Project Structure

```
physio-framework-site/
├── app/               # Next.js 14 App Router 页面
│   ├── layout.tsx     # 根布局（深色模式）
│   ├── page.tsx       # 首页（五层架构概览）
│   ├── layer/         # 层级浏览
│   ├── module/        # 模块详情
│   ├── glossary/      # 术语表
│   └── references/    # 参考文献总汇
├── components/        # React 组件（10个）
│   ├── BreadcrumbNav, CitationMarker, DependencyGraph
│   ├── DescriptionRenderer, GlossaryPopup
│   ├── ImplementationTabs, LayerNavigation
│   ├── ModuleCard, ReferenceList, TermLink
├── data/              # 知识数据
│   ├── types.ts       # 类型定义
│   ├── layers.ts      # 6层架构定义
│   ├── modules-data.ts# 模块数据（3476行）
│   ├── modules.ts     # 模块查询函数
│   ├── references.ts  # 84篇参考文献
│   └── glossary.ts    # 术语表
├── scripts/           # 工具脚本
└── [config files]     # next.config.js, tailwind.config.ts, tsconfig.json
```

---

## ✏️ 知识编辑 / Editing the Knowledge Base

所有知识数据位于 `data/` 目录下的 TypeScript 文件：

```bash
data/
├── types.ts           # Layer, Module, Implementation, Reference, GlossaryTerm 接口
├── layers.ts          # 编辑层级定义
├── modules-data.ts    # 编辑模块内容（核心）
├── references.ts      # 编辑参考文献
└── glossary.ts        # 编辑术语定义
```

**引用系统**：正文使用 `[ref-xxx]` 格式标记参考文献，所有引用 ID 需在 `references.ts` 中有对应条目。

**数据质量标准**：
- 缺失字段用 `"-"` 标记，不编造数据
- 数值字段携带单位
- 类型安全由 TypeScript 严格模式保障

---

## 📜 当前进度 / Progress

### ✅ 已完成 (7 项修复)

| # | 问题 | 状态 |
|---|------|------|
| 1 | 层命名：L1-L5 统一命名规范 | ✅ 已修复 |
| 2 | Citations 填充：全部 modules-data 完成引用标注 | ✅ 已修复 |
| 3 | 引用标记全覆盖：所有 [ref-xxx] 对应 references.ts 条目 | ✅ 已修复 |
| 4 | TermLink 集成：DescriptionRenderer 自动链接术语 | ✅ 已修复 |
| 5 | 实现差异化描述：主流方案/进阶方案区分 | ✅ 已修复 |
| 6 | 体成分数据补齐 | ✅ 已修复 |
| 7 | L0 迁移至独立模块 | ✅ 已修复 |

### 🗺️ 待完善 / Known Gaps

- **EEG 信号**: 3 篇 EEG 参考文献未纳入当前框架（脑电信号是重要的生理信号），建议扩展 L1 传感器层和相应模块
- **数据覆盖**: 部分模块的实现方案可进一步补充供应商、对比数据
- **交互优化**: DependencyGraph 可视化可增加缩放、平移等交互
- **国际化**: 目前为全中文界面，可考虑 i18n 支持
- **搜索**: 可添加全文搜索功能
- **数据关系图**: 可生成可导出的知识图谱

---

## 🤝 关于 / About

本项目由 **Mala**（OpenClaw AI Agent）与 **Paip** 共同构建。  
知识体系整理自公开学术文献、专利、厂商文档及行业分析。

Built by **Mala** (an OpenClaw AI agent) in collaboration with **Paip**.  
Knowledge compiled from public academic literature, patents, vendor documentation, and industry analysis.

---

## 📄 许可 / License

知识内容仅供教育和研究参考。引用请标注原始出处。

Knowledge content for educational and research reference only. Cite original sources when referencing.
