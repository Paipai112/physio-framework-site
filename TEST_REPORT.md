# 运动生理学算法框架知识网站 — 测试报告

## 测试用例设计思路

从三个维度出发：
- **学术用户**：引用可追溯、术语可查阅、知识体系完整闭环
- **产品/工程用户**：实现方案可对比、依赖关系可跟踪、技术细节可信
- **自学者**：导航清晰、层级分明、入口直观

---

## 🔴 P0 — 数据完整性（严重缺陷阻断浏览）

### TC-01：所有模块必填字段完整

| 字段 | 验收标准 | 通过 |
|------|---------|------|
| id | 按 `Lx:xxx` 格式，不重复 | |
| layer | 仅 L0-L5 取值，与 `layers.ts` 一致 | |
| name | 非空 | |
| summary | 非空，≤200 字 | |
| description | 非空，包含技术细节 | |
| importance | `high/medium/low` 三选一 | |
| dependsOn | 数组，引用 ID 必须存在于 modules 中 | |
| feedsInto | 数组，引用 ID 必须存在于 modules 中 | |
| tags | 数组，非空 | |
| implementations | 数组，非空（L0 除外） | |
| glossaryTerms | 数组，引用 ID 必须存在于 glossary.ts 中 | |
| references | 数组，引用 ID 必须存在于 references.ts 中 | |

**验证：每个模块检查 → 计 98 条**

### TC-02：引用完整性（关键学术需求）

- 所有 [ref-xxx] 标记在 `data/references.ts` 中有对应 ID
- 所有 glossaryTerms 引用的术语在 `data/glossary.ts` 中存在
- 所有 dependsOn/feedsInto 引用的模块 ID 存在

### TC-03：层级一致性

- data/layers.ts 包含 L0-L5（6 层）
- 每个模块的 `.layer` 在 layers 中存在
- 首页 StatBox 覆盖 L1-L5，无遗漏

---

## 🟡 P1 — 路由与导航

### TC-04：所有路由可正常渲染

| 路由 | 描述 | 验证方法 |
|------|------|---------|
| `/` | 首页 | Build 生成静态 |
| `/layer` | 层级列表 | Build 生成静态 |
| `/layer/L1` ~ `/layer/L5` | 各层级详情 | Build 生成静态 |
| `/module` | 模块列表 | Build 生成静态 |
| `/module/L1:ppg` ~ (随机 5 个) | 模块详情 | Build 生成动态 |
| `/glossary` | 术语列表 | Build 生成静态 |
| `/glossary/random-5` | 术语详情 | Build 生成动态 |
| `/references` | 参考文献 | Build 生成静态 |

### TC-05：面包屑导航

- 层级详情页：首页 > 层级名称
- 模块详情页：首页 > 层级名称 > 模块名称
- 术语详情页：首页 > 术语 > 术语名称

### TC-06：链接不中断

- 模块详情页的依赖/供给链接 → 跳转到对应模块
- 术语卡片 → 术语详情页
- 模块列表页 → 模块详情页
- 层级详情页 → 模块详情页
- 快速入口 → 对应层级

---

## 🟡 P1 — 组件渲染

### TC-07：DescriptionRenderer（术语自动链接）

- 段落中包含术语词时，自动渲染为 `<TermLink>`
- 术语词不被部分匹配（如长词优先匹配）
- 点击术语链接跳转到术语详情页

### TC-08：ImplementationTabs

- 主流方案 / 进阶方案 Tab 切换正常
- 显示提供方、优势、局限
- 无 Implementation 时显示"暂无实现方案"

### TC-09：DependencyGraph

- 节点按层级分组（L1-L5）
- 悬停显示节点名称
- 边缘连接正确（源→目标）
- 高亮悬停节点关联边

### TC-10：ModuleCard（层级/术语/方案徽章）

- 层级标签颜色正确
- 方案徽章（蓝色）仅在 implementations.length > 0 时显示
- 术语徽章（紫色）在 glossaryTerms.length > 0 时显示
- 标签按 tags 数组渲染

---

## 🔵 P2 — 学术需求专项

### TC-11：参考文献可追溯

- 参考文献页按类型分组（论文/文档/网站/专利/书籍）
- 每篇文献显示：作者、标题、年份、类型
- 有 DOI/URL 时提供可点击链接
- modules-data.ts 中的 [ref-xxx] 标记可追溯到此处

### TC-12：术语词典完整

- 术语列表页按分类分组
- 字母索引可用
- 术语详情页显示定义、相关模块、参考文献
- 定义文字完整、可读

### TC-13：五层架构知识闭环

从传感器 → 信号 → 指标 → 平台 → AI 教练，依赖关系可完整追溯
- 点击一层 → 看到模块列表 → 点击模块 → 看到依赖/供给 → 点击依赖 → 跳转
- 闭环不中断

---

## 🔵 P2 — 边界与异常

### TC-14：不存在的 ID 路由

- `/module/nonexistent` → redirect to `/`
- `/layer/nonexistent` → redirect to `/`
- `/glossary/nonexistent` → redirect to `/glossary`

### TC-15：空模块层

- 检查所有层的模块数 > 0
- L0 层没有模块时显示空状态

### TC-16：静态 SPA 与 Next.js 数据一致性

- `site/data.json` 的 98 个模块和 Next.js 的 98 个模块 ID 集合一致
- 层级定义一致

---

## 测试执行

开始逐轮执行。
