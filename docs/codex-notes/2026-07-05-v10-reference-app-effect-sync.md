# Codex 同步说明：V10 参考效果图对齐与下一阶段执行计划

> Repository: `xiyan13411-ai/check-think`  
> 建议路径：`docs/codex-notes/2026-07-05-v10-reference-app-effect-sync.md`  
> 当前阶段：V9 已完成 AI 视觉资产接入方案；下一步进入 V10，目标是把首页做成接近用户最新效果图的完整 App 视觉。  
> 目标关键词：心愿罐 / 新 iPhone / 破碎重组手机 / 顶部状态区 / 大 Hero / 底部进度卡 / 一键存入 / 底部 Tab Bar。

---

## 1. 本次同步背景

用户给了新的目标效果图，核心不是再单独做一个手机 SVG，而是要把整个首页升级成“完整 App 截图级效果”：

- 顶部是接近 iOS App 的状态栏、页面标题、收藏按钮、添加按钮。
- 顿点标题为「心愿罐」。
- 愿望条目展示为「新 iPhone」，左侧有手机缩略图，右侧有「连续 7 天」绿色胶囊状态。
- 主视觉为白银色手机在中心悬浮，手机由不规则厚碎片重组，四周有飞散碎片、淡蓝光线轨迹、柔和棚拍背景。
- 底部大卡片集中展示当前已存金额、目标金额、进度百分比、进度条、差额提示、最近一笔记录，以及主操作按钮「存一笔」。
- 底部有 4 个 Tab：「心愿 / 计划 / 明细 / 我的」。

这意味着 V10 的重点是 **从“功能型 MVP 页面”升级为“参考图式单屏 App Shell + Hero 海报 + 底部操作卡”**。

---

## 2. 当前仓库扫描结论

### 2.1 技术栈已满足继续迭代

当前项目是 Next.js App Router + React + TypeScript + Tailwind + Framer Motion。`package.json` 中已有：

```json
{
  "next": "^15.1.0",
  "react": "^19.0.0",
  "framer-motion": "^11.15.0",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.7.0"
}
```

不用换技术栈，不要引入 Three.js。继续使用 2D / 2.5D / SVG / CSS / Framer Motion。

### 2.2 当前主视觉路线已经走到 V9

README 已记录：

- V7：`FragmentedPhoneScene`，单图切片 + 碎片重组。
- V8：`phone-render.svg` 重做，银白机身、深蓝反光、镜头模组、20 块高扰动碎片。
- V9：`phoneRenderAsset` 支持 PNG 优先 + SVG fallback。
- 目标 PNG 路径：`public/wish-assets/phone/generated/phone-render.png`。

这部分方向正确，不要推倒重做。

### 2.3 当前首页结构还不像目标图

当前 `app/page.tsx` 仍然是旧 MVP 页面结构：

```tsx
<main>
  顶部标题区
  GoalCard
  heroScene
  SavePanel
  HistoryReceipt
  Reset
  AchievementModal
  AppUpdateNotice
</main>
```

它能跑通功能，但布局与目标效果图差异明显：

- 没有 iOS 风格 App Shell。
- 没有顶部收藏 / 添加按钮。
- 没有「心愿罐」主标题和「连续 7 天」状态胶囊。
- GoalCard 在 Hero 上方；参考图中进度卡在 Hero 下方。
- SavePanel 是功能卡；参考图中主操作是底部大蓝色「存一笔」按钮。
- 没有底部 Tab Bar。

### 2.4 当前主视觉组件可继续复用，但需要扩展

`FragmentedPhoneScene.tsx` 当前已经：

- 通过 `useAssetSrc()` 优先加载 PNG，失败回退 SVG。
- 使用 `phoneShards` + `clip-path` 把手机底图切成碎片。
- 解锁后碎片飞回原位，未解锁碎片停在外部。
- 叠加 `EDGE_HIGHLIGHT` 做碎片边缘高光。

问题是：当前组件自己包含卡片背景、下一块碎片进度、完成文案；V10 需要它更像“纯 Hero 视觉组件”，让页面外层控制进度卡和操作卡。

---

## 3. V10 总目标

V10 不做新业务功能，专注把首页视觉对齐最新效果图。

### 3.1 必须保留

- localStorage 持久化。
- 存钱逻辑。
- 快捷金额和自定义金额能力可以暂时保留在备用交互里，但首页主按钮先做「存一笔」。
- 进度计算逻辑。
- 成就弹窗。
- `FragmentedPhoneScene` 的碎片重组能力。
- PNG 优先 + SVG fallback。
- 不引入登录、后端、支付、云同步、Three.js。

### 3.2 必须新增或调整

1. 首页改为参考图式单屏结构。
2. 新增顶部 App Header。
3. 新增愿望标题行。
4. 主视觉 Hero 区域放大，并融入浅米白背景、淡蓝光线、外部碎片。
5. 将进度卡移到 Hero 下方，做成白色大圆角浮层。
6. 进度条改成蓝色主调，匹配参考图。
7. 主操作按钮改成大号蓝色胶囊按钮「存一笔」。
8. 新增底部 Tab Bar 静态 UI。
9. 默认目标可临时调整为参考图数据：目标 ¥7,999，演示状态可用 ¥1,280，进度 16%。注意不要破坏已有用户 localStorage 数据。

---

## 4. 推荐文件级任务

### Task 1：新增 App Shell 组件

新增：

```txt
components/ReferenceAppShell.tsx
```

职责：

- 渲染整屏浅米白背景。
- 模拟 iOS 顶部状态栏。
- 顶部中间标题「心愿罐」。
- 左侧星标按钮，右侧加号按钮。
- 底部固定 Tab Bar。
- 中间区域接收 children。

不要在这里写存钱业务逻辑。

### Task 2：新增愿望标题行组件

新增：

```txt
components/WishHeaderRow.tsx
```

Props 建议：

```ts
type WishHeaderRowProps = {
  title: string;
  streakDays: number;
};
```

视觉要求：

- 左侧小手机缩略图卡片。
- 标题「新 iPhone」加右箭头。
- 右侧绿色胶囊：火苗图标 + `连续 7 天`。
- 参考图是 iOS 风格，不要做成网页导航条。

### Task 3：把 FragmentedPhoneScene 拆成“纯 Hero 版本”

建议不要直接大改现有组件，先新增：

```txt
components/ReferencePhoneHero.tsx
```

内部可以复用：

```ts
import { phoneShards, getUnlockedShardIndices } from "@/lib/fragmented-phone-map";
import { phoneRenderAsset } from "@/lib/wish-assets";
```

视觉目标：

- Hero 容器高度约 500px，但需适配 360px-430px 手机宽度。
- 中央手机宽度比当前更大，约 `w-56` 到 `w-64`。
- 背景为浅米白 / 浅暖灰径向渐变。
- 手机下方有软阴影椭圆。
- 外部碎片保持可见，透明度不要太低。
- 增加淡蓝白色弧线或光轨，模拟参考图中碎片飞回轨迹。
- 不在组件底部渲染「下一块碎片」进度，因为 V10 的进度全部放到底部卡片。

### Task 4：新增底部进度操作卡

新增或重做：

```txt
components/ReferenceProgressCard.tsx
```

Props 建议：

```ts
type ReferenceProgressCardProps = {
  currentAmount: number;
  targetAmount: number;
  progress: number;
  lastRecordAmount?: number;
  lastRecordTimeLabel?: string;
  onPrimarySave: () => void;
};
```

视觉结构：

```txt
已存 ¥1,280                         进度 16%
目标 ¥7,999
[蓝色进度条 + 星形节点]
再存 ¥6,719 就能完成心愿啦！
刚刚存入 ¥80                         今天 13:52
[       存一笔       ]
```

主按钮：

- 蓝色渐变。
- 高度 56px 左右。
- 大圆角胶囊。
- 文案「存一笔」。

点击行为第一版可以直接 `onSave(80)` 或 `onSave(100)`，用于复刻参考图；后续再弹出金额输入面板。

### Task 5：重组 `app/page.tsx`

目标结构：

```tsx
<ReferenceAppShell>
  <WishHeaderRow title="新 iPhone" streakDays={7} />

  <ReferencePhoneHero
    totalPieces={state.goal.totalPieces}
    unlockedPieces={unlockedPieces}
    currentAmount={state.goal.currentAmount}
    targetAmount={state.goal.targetAmount}
    newlyUnlockedPieceIndexes={newlyUnlockedPieceIndexes}
    warmUpNextPiece={warmUpNextPiece}
    saveAnimation={saveAnimation}
  />

  <ReferenceProgressCard
    currentAmount={state.goal.currentAmount}
    targetAmount={state.goal.targetAmount}
    progress={progress}
    lastRecordAmount={state.records.at(-1)?.amount}
    lastRecordTimeLabel="今天 13:52"
    onPrimarySave={() => handleSave(80)}
  />

  <AchievementModal ... />
  <AppUpdateNotice />
</ReferenceAppShell>
```

先不要删除旧组件。可以保留旧 `GoalCard / SavePanel / HistoryReceipt` 作为 fallback 或后续详情页素材。

### Task 6：更新默认演示数据，但避免破坏老用户数据

当前默认是：

```ts
targetAmount: 10000,
currentAmount: 0,
totalPieces: 40
```

参考图是：

```txt
目标：¥7,999
已存：¥1,280
进度：16%
最近一笔：¥80
```

建议不要直接覆盖已有 localStorage。可以：

1. 将 `createDefaultAppState()` 改为参考图演示数据；
2. 已存在 localStorage 时继续读取旧数据；
3. 如需强制看新效果，用户可点重置测试数据或清 localStorage。

示例：

```ts
const goal: Goal = {
  id: "default-goal",
  name: "新 iPhone",
  targetAmount: 7999,
  currentAmount: 1280,
  totalPieces: 40,
  createdAt: new Date().toISOString(),
};
```

可选增加一条默认记录：

```ts
records: [
  {
    id: "demo-record-1",
    goalId: "default-goal",
    amount: 80,
    createdAt: new Date().toISOString(),
    progressAfter: 1280 / 7999,
    unlockedPieces: Math.floor((1280 / 7999) * 40),
    message: "刚刚存入 ¥80",
  },
]
```

如果担心默认记录污染真实使用，可以只在 UI 中 fallback 显示 `刚刚存入 ¥80`，不写入 records。

---

## 5. 视觉验收标准

### 5.1 首屏观感

打开首页后，第一眼应该像一张 App 效果图，而不是普通 Web MVP。

必须看到：

- 顶部标题「心愿罐」。
- 愿望「新 iPhone」。
- 右侧「连续 7 天」。
- 中央破碎重组手机大 Hero。
- 底部白色进度操作卡。
- 蓝色「存一笔」主按钮。
- 底部四个 Tab。

### 5.2 主视觉

- 手机不应再像淡粉卡片。
- 碎片要有厚度感、阴影、高光。
- 手机本体要有银白背板、深蓝黑反光区域、三镜头模组。
- 16% 进度时，中心只能拼回少量主体，外部碎片应明显漂浮。
- 100% 时手机完整，不能还有明显缺口。

### 5.3 交互

- 点击「存一笔」后金额增加。
- 进度条更新。
- 手机碎片有飞回反馈。
- 历史最近一笔展示同步更新。
- 刷新后数据不丢。

### 5.4 移动端适配

重点测试：

- Android Chrome / Edge。
- 360px 宽度不横向滚动。
- iPhone 参考图比例下，Hero 不被底部卡片挤没。
- 底部 Tab Bar 不遮挡主按钮。
- 安全区 padding 正常。

---

## 6. 不要做的事

V10 不要做：

- 登录。
- 支付。
- 银行绑定。
- 云同步。
- 真正 iPhone / Apple 品牌素材。
- 复杂 3D / Three.js。
- 一次生成 20 个独立 PNG 碎片。
- 大规模重构状态管理。
- 删除旧组件。

---

## 7. 建议提交顺序

1. `feat: add reference app shell layout`
2. `feat: add reference wish header row`
3. `feat: add reference phone hero scene`
4. `feat: add reference progress card`
5. `refactor: switch home page to reference layout`
6. `chore: update demo default wish data`
7. `docs: add v10 reference app effect sync note`

每一步都必须能运行 `npm run build`。

---

## 8. Codex 执行指令

请按以下顺序执行，不要一次性重写全项目：

```txt
1. 先读取 README.md、docs/PROJECT_BRIEF.md、docs/CODEX_EXECUTION_PLAN.md。
2. 确认当前 `app/page.tsx` 使用 HERO_MODE = "fragmented"。
3. 新增 ReferenceAppShell / WishHeaderRow / ReferenceProgressCard。
4. 新增 ReferencePhoneHero，复用 phoneRenderAsset 与 phoneShards。
5. 将首页布局改成参考图式单屏 App。
6. 保留旧组件，不删除。
7. 保持 localStorage、存钱逻辑、成就逻辑可用。
8. 运行 npm run build。
9. 如构建失败，只修类型和引用错误，不扩大范围。
```

---

## 9. 当前判断

项目已经完成“碎片重组技术路线”和“PNG 接入 fallback 路线”。现在缺的是 **产品截图级 UI 外壳与页面构图**。

下一步不要继续只调 `phone-render.svg`，而要把整个页面重排成参考图的层级：

```txt
App Shell
  Header
  Wish Row
  Hero Poster
  Progress Action Card
  Tab Bar
```

这一步完成后，即使还没有真正高质量 PNG，也会明显接近用户给出的效果图。
