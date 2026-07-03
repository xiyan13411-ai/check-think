# Codex 执行计划

> Repository: `xiyan13411-ai/check-think`  
> 建议路径：`docs/CODEX_EXECUTION_PLAN.md`  
> 用途：给 Codex / Copilot / Cursor 作为开发任务说明。  
> 原则：一次只做一小步，每一步都能运行和验收。

---

## 1. 总控指令

请根据 `docs/PROJECT_BRIEF.md` 和 `docs/ROADMAP.md` 开发「愿望拼图存钱 App」MVP。

开发时请遵守：

1. 不扩大范围。
2. 不实现登录、后端、支付、银行绑定或云同步。
3. 先保证项目能运行，再做视觉增强。
4. 每个阶段完成后自测。
5. TypeScript 类型要清晰。
6. 移动端体验优先，尤其是 Android Chrome。
7. 代码要组件化，避免所有逻辑堆在 `page.tsx`。
8. localStorage 逻辑必须封装。
9. 动画使用 Framer Motion。
10. 不引入 Three.js 或复杂 3D。

---

## 2. 推荐开发顺序

### Step 1：检查项目现状

请先检查：

- `package.json`
- Next.js 版本与目录结构
- 是否使用 App Router
- 是否已有 Tailwind
- 是否已有 Framer Motion
- 是否有 `app/page.tsx`
- 是否有 `app/globals.css`
- 是否能运行 `npm run dev`

完成后输出当前项目状态总结。

---

### Step 2：补齐基础目录

如果缺少以下目录，请创建：

```txt
components/
lib/
types/
docs/
public/icons/
```

如果已有目录，请复用，不要重复创建奇怪的新目录。

---

### Step 3：创建类型定义

创建或更新：

```txt
types/goal.ts
types/record.ts
types/achievement.ts
types/app-state.ts
```

内容：

```ts
export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  totalPieces: number;
  createdAt: string;
};

export type SavingRecord = {
  id: string;
  goalId: string;
  amount: number;
  createdAt: string;
  progressAfter: number;
  unlockedPieces: number;
  message: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  threshold: number;
  unlockedAt?: string;
};

export type AppState = {
  goal: Goal;
  records: SavingRecord[];
  unlockedAchievements: string[];
};
```

可以按项目风格拆分或集中导出，但最终必须可被组件复用。

---

### Step 4：创建工具函数

创建：

```txt
lib/progress.ts
lib/storage.ts
lib/copywriting.ts
lib/achievements.ts
lib/vibration.ts
```

#### `lib/progress.ts`

需要包含：

```ts
calculateProgress(currentAmount, targetAmount)
calculateUnlockedPieces(progress, totalPieces)
formatCurrency(amount)
```

#### `lib/storage.ts`

需要包含：

```ts
STORAGE_KEY
createDefaultAppState()
loadAppState()
saveAppState(state)
resetAppState()
```

注意：

- 兼容 SSR，访问 `window` 前判断环境。
- localStorage 解析失败时返回默认状态。
- 不要让页面崩溃。

#### `lib/copywriting.ts`

包含随机存钱文案。

#### `lib/achievements.ts`

包含 25%、50%、75%、100% 成就配置和判断函数。

#### `lib/vibration.ts`

包含：

```ts
export function vibrate(duration = 30) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(duration);
  }
}
```

---

### Step 5：实现组件

创建：

```txt
components/GoalCard.tsx
components/PuzzleView.tsx
components/SavePanel.tsx
components/HistoryReceipt.tsx
components/AchievementModal.tsx
components/ProgressText.tsx
```

#### `GoalCard`

Props 建议：

```ts
type GoalCardProps = {
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
};
```

展示：

- 目标名
- 当前金额
- 目标金额
- 百分比
- 进度条

#### `PuzzleView`

Props 建议：

```ts
type PuzzleViewProps = {
  totalPieces: number;
  unlockedPieces: number;
  newlyUnlockedPieces: number;
};
```

要求：

- 40 个碎片。
- Grid 展示。
- 已解锁高亮。
- 未解锁半透明。
- 新解锁碎片用 Framer Motion 飞入。

#### `SavePanel`

Props 建议：

```ts
type SavePanelProps = {
  onSave: (amount: number) => void;
};
```

要求：

- 快捷按钮
- 自定义金额输入
- 防止非法金额
- 点击有 scale 动画

#### `HistoryReceipt`

展示最近记录。

#### `AchievementModal`

Props 建议：

```ts
type AchievementModalProps = {
  achievement: Achievement | null;
  onClose: () => void;
};
```

---

### Step 6：实现首页逻辑

在 `app/page.tsx` 中：

1. 加载 AppState。
2. 计算 progress。
3. 计算 unlockedPieces。
4. 处理 save 行为。
5. 计算 newlyUnlockedPieces。
6. 生成 SavingRecord。
7. 检查成就。
8. 保存到 localStorage。
9. 渲染组件。

注意：

- 首次渲染要兼容 SSR / hydration。
- 可以用 `useEffect` 在客户端加载 localStorage。
- 存钱后立即更新 UI。
- 成就弹窗不应阻塞保存。

---

### Step 7：实现移动端样式

在 `app/globals.css` 或 Tailwind 类中：

- 设置奶油白背景。
- 禁止横向滚动。
- 处理 safe area。
- 设置页面最大宽度。
- 设置卡片圆角和阴影。
- 设置按钮触摸尺寸。

建议页面容器：

```tsx
<main className="min-h-screen bg-orange-50 px-4 py-6 text-stone-900">
  <div className="mx-auto flex w-full max-w-md flex-col gap-5">
    ...
  </div>
</main>
```

---

### Step 8：添加 PWA Manifest

创建或更新：

```txt
app/manifest.ts
```

内容参考：

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "愿望拼图存钱",
    short_name: "存钱拼图",
    description: "每存一笔钱，愿望就拼回来一块",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#f9a8d4",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
```

如果没有图标文件，可以先创建简单占位图，或在 README 写明待补。

---

### Step 9：更新 README

README 必须包含：

1. 项目介绍
2. 技术栈
3. 本地运行
4. MVP 功能
5. 安卓优先说明
6. 后续路线
7. 非目标说明

---

## 3. 验收命令

完成后请运行：

```bash
npm install
npm run dev
```

如果项目有 lint：

```bash
npm run lint
```

如果项目有 build：

```bash
npm run build
```

如果某个命令失败，请修复；如果暂时无法修复，请在最终说明中明确原因。

---

## 4. 手工测试清单

请在浏览器里测试：

- [ ] 首页能打开
- [ ] 默认目标显示
- [ ] 当前金额默认 0
- [ ] 点击 ¥10 金额增加
- [ ] 点击 ¥50 金额增加
- [ ] 点击 ¥100 金额增加
- [ ] 点击 ¥500 金额增加
- [ ] 自定义金额可以提交
- [ ] 输入 0 不提交
- [ ] 输入负数不提交
- [ ] 输入空值不提交
- [ ] 进度百分比更新
- [ ] 碎片数量更新
- [ ] 存钱后有动画
- [ ] 存钱后有文案
- [ ] 存钱后有记录
- [ ] 刷新后数据不丢
- [ ] 达到 25% 有成就
- [ ] 达到 50% 有成就
- [ ] 达到 75% 有成就
- [ ] 达到 100% 有成就
- [ ] 成就不重复弹出
- [ ] 页面在 390px 宽度下正常
- [ ] 页面没有横向滚动

---

## 5. PR 说明模板

每次提交 PR 时，请使用：

```md
## Summary

本 PR 完成：

-

## Changes

-

## Test

- [ ] npm run dev
- [ ] npm run build
- [ ] 手动测试存钱流程
- [ ] 手动测试 localStorage
- [ ] 手动测试移动端宽度

## Notes

-
```

---

## 6. 禁止事项

本阶段不要做：

- 登录
- 数据库
- 后端 API
- 支付
- 银行接入
- 云同步
- 多目标
- 图片上传
- Three.js
- 复杂 3D
- 社交功能
- 上架配置

---

## 7. 完成后输出要求

Codex 完成开发后，请在最终回复中说明：

1. 实现了哪些功能。
2. 修改了哪些文件。
3. 如何本地运行。
4. 如何测试。
5. 哪些功能是后续计划。
6. 是否有已知问题。

---

## 8. 第一条可直接发送给 Codex 的 Prompt

```text
请阅读 docs/PROJECT_BRIEF.md、docs/ROADMAP.md、docs/CODEX_EXECUTION_PLAN.md，并按照 CODEX_EXECUTION_PLAN 的步骤开发「愿望拼图存钱 App」MVP。

请先检查当前项目结构和 package.json，然后完成：
1. 类型定义
2. storage/progress/copywriting/achievement/vibration 工具
3. 首页移动端 UI
4. 存钱逻辑
5. 拼图碎片展示
6. Framer Motion 动画
7. 历史记录
8. 成就弹窗
9. PWA manifest
10. README 更新

不要实现登录、后端、支付、银行、云同步、多目标和复杂 3D。
完成后请运行可用的检查命令，并汇报修改文件和测试结果。
```
