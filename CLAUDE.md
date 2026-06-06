# 生理信号处理框架 — Claude Code 上下文

> 项目 ID: physio-framework-site  
> 构建者: Mala (OpenClaw AI Agent) + Paip  
> 知识库类型: 穿戴式生理信号处理系统化知识体系

---

## 🎯 项目愿景

构建一个可维护、可扩展的系统化知识体系，涵盖从传感器物理原理到临床应用的全栈技术。面向可穿戴设备工程师、生物医学工程研究者、运动科学从业者。

知识体系采用 **五层架构（L0-L5）**，数据使用 TypeScript 严格类型保障完整性，前端使用 Next.js 14 App Router 实现静态导出。

---

## 🏛️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | ^14.2.0 | App Router + Static Export |
| React | ^18.3.0 | 组件化 UI |
| TypeScript | ^5.4.0 | 严格模式，全类型安全 |
| Tailwind CSS | ^3.4.0 | 实用优先的样式系统 |
| PostCSS + Autoprefixer | ^8.4 / ^10.4 | CSS 处理 |

### 构建模式

- 使用 `next build` → 输出 `out/` 目录（纯静态站）
- `next.config.js` 配置了 `images.unoptimized: true`
- 深色模式默认启用（`<html className="dark">`）

---

## 📂 项目结构

```
physio-framework-site/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx          # 根布局（暗色主题，导航+页脚）
│   ├── page.tsx            # 首页（五层架构概览+统计）
│   ├── globals.css         # 全局样式（Tailwind + CSS变量）
│   ├── layer/              # 层级浏览 [id]
│   ├── module/             # 模块详情 [id]
│   ├── glossary/           # 术语表 [id]
│   └── references/         # 参考文献总汇
├── components/             # 10 个 React 组件
│   ├── BreadcrumbNav.tsx   # 面包屑导航
│   ├── CitationMarker.tsx  # 引用标记
│   ├── DependencyGraph.tsx # 依赖关系图
│   ├── DescriptionRenderer.tsx # 描述渲染（自动链接术语）
│   ├── GlossaryPopup.tsx   # 术语弹窗
│   ├── ImplementationTabs.tsx  # 实现方案切换
│   ├── LayerNavigation.tsx # 层级导航
│   ├── ModuleCard.tsx      # 模块卡片
│   ├── ReferenceList.tsx   # 参考文献列表
│   └── TermLink.tsx        # 术语链接
├── data/                   # 全部知识数据
│   ├── types.ts            # 类型定义
│   ├── layers.ts           # 6层架构定义
│   ├── modules-data.ts     # 模块数据（3476行，98个模块）
│   ├── modules.ts          # 模块查询工具函数
│   ├── references.ts       # 84篇参考文献
│   └── glossary.ts         # 43个术语
├── scripts/                # 工具脚本
│   ├── fix_citations.py    # 引用标记修复
│   └── migrate.py          # v1 数据迁移
└── [config files]          # next.config.js, tailwind.config.ts 等
```

---

## 📦 数据模式 (data/types.ts)

### Layer
```typescript
interface Layer {
  id: string;        // "L1", "L2"...
  name: string;      // "传感器层"
  description: string;
  icon: string;      // emoji
  color: string;     // tailwind color class
}
```

### Module
```typescript
interface Module {
  id: string;             // "L1:ppg"
  layer: string;          // "L1" - "L5"
  name: string;
  summary: string;        // ≤200字
  description: string;    // 含技术细节
  importance: "high" | "medium" | "low";
  dependsOn: string[];    // 依赖的模块 ID
  feedsInto: string[];    // 输出的模块 ID
  tags: string[];
  implementations: Implementation[];  // L0 可为空
  glossaryTerms: string[];
  references: string[];
}
```

### Implementation
```typescript
interface Implementation {
  type: "mainstream" | "advanced";
  name: string;
  vendor: string;
  description: string;
  pros: string[];
  cons: string[];
  citations: string[];
}
```

### Reference
```typescript
interface Reference {
  id: string;          // "ref-allen2007"
  title: string;
  authors?: string;
  url?: string;
  doi?: string;
  year?: number;
  type: "paper" | "website" | "patent" | "documentation" | "book";
  zhSummary?: string;
}
```

### GlossaryTerm
```typescript
interface GlossaryTerm {
  id: string;          // "ppg"
  term: string;        // "PPG"
  category: string;    // "光学"
  definition: string;
  references: string[];
}
```

---

## 🏗️ 架构设计决策

### 五层架构（L0-L5）

| 层级 | 名称 | 模块数 | 说明 |
|------|------|--------|------|
| L0 | 人体/信号源 | 1 | 人体作为信号源头 |
| L1 | 传感器层 | 8 | PPG, ECG, BIA, 加速度计, 陀螺仪, 温度, 气压, GSR |
| L2 | 基础指标层 | 16 | HR, HRV, SpO₂, RR, IBI 等 |
| L3 | 融合指标层 | 39 | 睡眠分期, VO₂max, TRIMP, ACWR 等 |
| L4 | 高级指标层 | 29 | 厂商专有评分体系 |
| L5 | AI 教练层 | 5 | AI 解读与个性化建议 |

### 页面路由设计

| 路由 | 动态/静态 | 作用 |
|------|-----------|------|
| `/` | 静态 | 首页（五层架构概览） |
| `/layer` | 静态 | 层级列表 |
| `/layer/[id]` | 动态 | 层级详情 |
| `/module` | 静态 | 模块列表 |
| `/module/[id]` | 动态 | 模块详情 |
| `/glossary` | 静态 | 术语列表 |
| `/glossary/[id]` | 动态 | 术语详情 |
| `/references` | 静态 | 参考文献总汇 |

### 特殊路由
- 不存在的 ID（如 `/module/nonexistent`）→ redirect to `/`
- 不存在的术语 → redirect to `/glossary`

### 组件架构

- **DescriptionRenderer**: 自动将正文中的术语词渲染为 `<TermLink>`，匹配规则：长词优先，不部分匹配
- **ImplementationTabs**: 主流方案 / 进阶方案 Tab 切换，无实现时显示"暂无实现方案"
- **DependencyGraph**: SVG 节点按层级分组，悬停显示名称，高亮关联边
- **ModuleCard**: 层级标签颜色、方案徽章(蓝色)、术语徽章(紫色)

### 样式约定

- 深色模式强制默认（`<html className="dark">`）
- 层级颜色: L1=red, L2=amber, L3=emerald, L4=blue, L5=violet
- CSS 变量驱动 (`--color-bg`, `--color-text` 等)，支持浅色/深色
- Tailwind 自定义主题色 `primary-*` 在 `tailwind.config.ts` 中定义

### 数据质量标准

1. **缺失必标** — 采不到写 `"-"`
2. **带单位** — 字段值自带单位，不只在表头标注
3. **无假数据** — 宁可缺失也不编造

### 引用系统

- 正文中使用 `[ref-xxx]` 格式标记参考文献
- 所有引用 ID 须在 `references.ts` 中有对应条目
- 参考文献按类型分组（论文/文档/网站/专利/书籍）

---

## ✅ 当前进度

### 全部 7 项已知问题已修复

| # | 问题 | 描述 | 修复方式 |
|---|------|------|---------|
| 1 | 层命名规范 | L1-L5 统一命名规范 | `data/layers.ts` 统一命名 |
| 2 | Citations 填充 | 全部 98 个模块完成引用标注 | `data/modules-data.ts` 补充引用 |
| 3 | 引用标记全覆盖 | 998 个 [ref-xxx] 标记全部可追溯 | `data/references.ts` 验证 |
| 4 | TermLink 集成 | DescriptionRenderer 自动链接术语 | `DescriptionRenderer.tsx` + TermLink |
| 5 | 实现差异化描述 | 主流/进阶 Tab 区分 | ImplementationTabs.tsx |
| 6 | 体成分数据补齐 | 体成分模块完整数据 | `modules-data.ts` 补充 |
| 7 | L0 迁移 | 人体/信号源从代码分离为独立模块 | 新增 L0 模块数据 |

### 已知缺口

1. **EEG 信号**: 3 篇已收集的 EEG 参考文献已存在于库中但未集成到模块体系
2. **传感器覆盖**: 部分新兴传感器（如连续血糖监测 CGM）未纳入
3. **实现方案对比**: 部分模块的 Implementation 可补充更多厂商对比数据
4. **交互优化**: DependencyGraph 可增加缩放、平移等交互
5. **国际化**: 目前为全中文，可考虑 i18n 支持
6. **全文搜索**: 可添加 Fuse.js 等搜索功能
7. **知识图谱**: 可生成可导出的数据关系图

---

## 🔧 日常操作

### 开发

```bash
# 启动开发服务器
npm run dev

# 构建静态站点
npm run build

# 预览构建结果
npx serve out/
```

### 编辑知识数据

编辑 `data/` 下的 TypeScript 文件：
- 新增模块 → 编辑 `data/modules-data.ts`
- 新增参考文献 → 编辑 `data/references.ts`
- 新增术语 → 编辑 `data/glossary.ts`
- 新增层级 → 编辑 `data/layers.ts`

### 数据验证（手动）

```bash
# 检查模块数以确认未遗漏
grep "^    id:" data/modules-data.ts | wc -l
# 预期输出: 98

# 检查引用完整性
grep -oh "ref-[a-z0-9-]*" data/modules-data.ts | sort -u | wc -l
# 预期: 所有 [ref-xxx] ID 均在 references.ts 中存在
```

### Build 验证

```bash
npm install && npm run build
# 必须无 TypeScript 错误，输出 out/ 目录
```

---

## 📋 引文格式约定

- [ref-allen2007] → `{ "id": "ref-allen2007", ... }` 在 `references.ts` 中
- DOI 优先链接，其次 URL
- `zhSummary` 字段为中文摘要，可选
- 所有引用按类型分组展示

---

## 🤖 Claude Code 常用提示

### 新增模块模板
```typescript
{
  id: "Lx:new-module",
  layer: "Lx",
  name: "模块名",
  summary: "一句话摘要（≤200字）",
  description: "详细描述，包含技术细节，支持[ref-xxx]标记",
  importance: "medium", // high | medium | low
  dependsOn: [], // 依赖的模块 ID
  feedsInto: [], // 输出的模块 ID
  tags: ["标签1", "标签2"],
  implementations: [],
  glossaryTerms: [],
  references: ["ref-xxx"],
}
```

### 新增引用模板
```typescript
{
  id: "ref-authorYear",
  title: "论文/文档标题",
  authors: "Author A, Author B",
  year: 2024,
  type: "paper", // paper | website | patent | documentation | book
  doi: "10.xxxx/xxxxx",
  zhSummary: "中文摘要（可选）",
}
```

---

## 📝 版本历史

### v1.0.0 (独立仓库化)

- 从 mala-workspace monorepo 分离为独立仓库
- 完整的 README 和 CLAUDE.md 文档
- GitHub: https://github.com/Paipai112/physio-framework-site

---

*Last updated: 2026-06-06*
