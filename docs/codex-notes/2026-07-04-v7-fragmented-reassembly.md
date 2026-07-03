# Codex 同步说明：V7 破碎重组式主视觉实现

> 建议路径：`docs/codex-notes/2026-07-04-v7-fragmented-reassembly.md`  
> 适用仓库：`xiyan13411-ai/check-think`  
> 当前状态：V5 资产驱动基础设施已完成，V6 调参页已完成  
> 本次目标：从“完整手机 + 装饰碎片”改为“手机被切成碎片，按进度重新组装”。

---

## 1. 当前判断

当前版本已经具备：

- 存钱逻辑
- 进度映射
- PWA
- 资产驱动结构
- 调参页
- fallback 版本
- 手机背面主视觉

但与小红书参考图仍有明显差距。

关键原因不是按钮、金额、文案，也不是普通飞行粒子不够多。

真正的问题是：

> 当前是“完整手机底图 + 外部装饰碎片”。  
> 参考图是“手机本体被打碎，碎片飞回来重新组成手机”。

这两个视觉机制完全不同。

---

## 2. 当前方案为什么不像

### 2.1 当前 V5/V6 的视觉逻辑

当前更像：

```txt
手机完整存在
外面飘一些碎片
进度变化时碎片动一下
```

用户感知：

> 这是一台手机，旁边有装饰碎片。

### 2.2 小红书参考的视觉逻辑

参考图更像：

```txt
手机本身被拆成很多物理碎片
已存部分已经拼回机身
未存部分还漂浮在外面
存钱后，碎片飞回来补到缺口上
```

用户感知：

> 我真的把这个手机一点点拼回来了。

---

## 3. V7 核心方向

V7 不要继续优化装饰碎片。  
请改成：

> Fragmented Reassembly：破碎重组。

也就是：

- 完整手机不直接完整显示
- 手机被切成 18-24 个不规则碎片
- 已解锁碎片在目标位置组成手机
- 未解锁碎片散落在手机周围
- 存钱解锁时，碎片从散落位置飞回目标位置
- 100% 时所有碎片拼合，最后淡入完整手机完成态

---

## 4. 推荐实现方式：单图 clip-path 切片

这是当前最推荐的实现方式，因为不需要马上准备 20 张碎片 PNG，也不用上 Three.js。

### 4.1 基本原理

准备一张完整手机图：

```txt
public/wish-assets/phone/phone-render.png
```

然后每个碎片都是同一张图的一部分：

```tsx
<div
  className="absolute inset-0"
  style={{
    backgroundImage: "url('/wish-assets/phone/phone-render.png')",
    backgroundSize: "100% 100%",
    clipPath: "polygon(...)",
  }}
/>
```

每个碎片都是完整图的一个 clipped layer。  
当它处于目标位置时，所有碎片拼起来就是完整手机。  
当它未解锁时，把这个 clipped layer 通过 transform 移到外部漂浮位置。  
当解锁时，动画从外部 transform 回到 `translate(0,0) rotate(0) scale(1)`。

这就能实现：

> 真正的“碎片飞回去组成完整物体”。

---

## 5. V7 视觉状态

### 5.1 0%

- 只显示非常淡的手机轮廓 / ghost silhouette
- 所有碎片散落在外部
- 手机中心是空的或半透明

### 5.2 20% - 80%

- 已解锁碎片在手机目标位置
- 未解锁碎片漂浮在外部
- 中间有明显缺口
- 用户能看到手机正在逐步完整

### 5.3 解锁新碎片

- 对应碎片从外部位置飞回目标位置
- 到达时有轻微 snap / glow
- 手机缺口被补上
- 这才是真正的“拼回来”

### 5.4 100%

- 全部碎片回到目标位置
- 稍等 300ms 后淡入 `phone-complete.png` 或完整手机图
- 裂缝/碎片边缘弱化
- 显示完成文案

---

## 6. 逻辑碎片与视觉碎片

当前逻辑是 40 块。  
V7 视觉不应显示 40 块，因为太像网格。

建议：

```txt
逻辑碎片：40 块，用于金额进度
视觉碎片：20 块，用于主视觉
```

映射方式：

```ts
visualProgress = currentAmount / targetAmount
visualUnlockedCount = Math.floor(visualProgress * visualShardCount)
```

或者每个视觉碎片配置：

```ts
unlockAt: 0.05, 0.10, 0.15...
```

---

## 7. 文件设计

### Task 1：新增碎片地图配置

新增：

```txt
lib/fragmented-phone-map.ts
```

类型：

```ts
export type PhoneShard = {
  id: string;
  clipPath: string;
  startX: number;
  startY: number;
  startRotate: number;
  startScale: number;
  targetRotate?: number;
  zIndex: number;
  blur?: number;
  unlockAt: number;
};
```

配置 18-24 个 shards。

每个 shard 使用 `clipPath: polygon(...)`。

示例：

```ts
export const phoneShards: PhoneShard[] = [
  {
    id: "top-left-camera",
    clipPath: "polygon(8% 6%, 42% 4%, 38% 28%, 12% 30%)",
    startX: -90,
    startY: -40,
    startRotate: -18,
    startScale: 0.96,
    zIndex: 20,
    unlockAt: 0.05,
  },
  {
    id: "right-edge-upper",
    clipPath: "polygon(62% 8%, 94% 10%, 90% 36%, 58% 32%)",
    startX: 85,
    startY: -30,
    startRotate: 14,
    startScale: 1,
    zIndex: 18,
    unlockAt: 0.12,
  },
];
```

注意：

- polygon 要不规则，不要矩形网格
- 碎片数量先 20 左右
- 边缘不要太密
- 尽量让每个碎片像手机的一部分

---

### Task 2：新增 FragmentedPhoneScene

新增：

```txt
components/FragmentedPhoneScene.tsx
```

Props：

```ts
type FragmentedPhoneSceneProps = {
  progress: number;
  currentAmount: number;
  targetAmount: number;
  saveAnimation?: {
    key: number;
    mode: "warmup" | "unlock" | "complete";
    count: number;
  } | null;
};
```

职责：

- 渲染淡淡的手机轮廓
- 渲染所有 clipped shards
- 已解锁 shard：transform 为 0，拼合到机身
- 未解锁 shard：transform 到外部漂浮位置
- 新解锁 shard：从外部飞回
- 100%：淡入完整手机完成态

---

### Task 3：准备 phone-render fallback

新增：

```txt
public/wish-assets/phone/phone-render.svg
```

如果没有真实 PNG，就先用 SVG fallback。

要求：

- 抽象手机背面
- 粉白/银色/玫瑰金
- 镜头模组
- 不使用 Apple / iPhone 官方素材
- 可以是简单 SVG，但要能被 clip-path 切片使用

后续真实素材替换为：

```txt
phone-render.png
phone-complete.png
```

---

### Task 4：接入首页 HERO_MODE

在 `app/page.tsx` 中扩展：

```ts
const HERO_MODE: "fragmented" | "asset" | "svg" = "fragmented";
```

渲染逻辑：

```tsx
if HERO_MODE === "fragmented":
  <FragmentedPhoneScene ... />
else if HERO_MODE === "asset":
  <AssetHeroScene ... />
else:
  <WishHeroScene ... />
```

注意：

- 不删除 AssetHeroScene
- 不删除 WishHeroScene
- 不删除 fallback
- 只新增 fragmented 模式

---

### Task 5：更新 /lab/assets 调参页

在 `/lab/assets` 增加模式切换：

```txt
fragmented / asset / svg
```

用于比较：

- FragmentedPhoneScene
- AssetHeroScene
- WishHeroScene

同时展示：

- 当前 progress
- 当前 visualUnlockedCount
- 当前未解锁碎片数
- 动画模式

---

## 8. 动效设计

### 8.1 未解锁碎片漂浮

未解锁碎片应在手机周围不同位置。

视觉：

- 不同 x/y
- 不同 rotate
- 有的稍微 blur
- 有的 zIndex 更前
- opacity 0.6-0.9

不要全部在同一层。

### 8.2 解锁飞回

使用 Framer Motion：

```tsx
<motion.div
  animate={
    unlocked
      ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
      : { x: shard.startX, y: shard.startY, rotate: shard.startRotate, scale: shard.startScale, opacity: 0.75 }
  }
/>
```

当刚刚解锁时：

- duration 0.7-1.0s
- ease: spring
- 到达后 scale 1.04 → 1
- 手机轻微 glow

### 8.3 小金额 warmup

没有解锁视觉碎片时：

- 一条光线飞向最近未解锁碎片
- 最近未解锁碎片轻微亮一下
- 不强行飞回

### 8.4 100% 完成

完成时：

- 所有碎片回到位
- 完整图 fade in
- 裂缝阴影淡出
- 完成 badge 出现
- 少量星点，不要 emoji 爆炸

---

## 9. 与参考图的接近点

V7 会比 V5 更接近参考图，因为：

| 参考图 | V7 |
|---|---|
| 手机由碎片组成 | phone-render 被 clip-path 切成碎片 |
| 碎片在外部漂浮 | 未解锁 shard 散落在外部 |
| 存钱后碎片飞回 | 解锁 shard transform 回 0 |
| 逐步变完整 | progress 驱动已拼合碎片数量 |
| 100% 完整物品 | complete 图 fade in |
| 无需真实 3D | 2.5D CSS transform 模拟 |

---

## 10. 禁止事项

本轮不要做：

- Three.js
- React Three Fiber
- Canvas 粒子
- 多目标
- 登录
- 云同步
- 支付
- 后端
- APK
- 分享海报
- 自定义上传
- 删除 fallback
- 使用 Apple / iPhone 官方素材

本轮只做：

> 单图切片 + 碎片重组主视觉。

---

## 11. 验收标准

完成后应满足：

- [ ] HERO_MODE 支持 `"fragmented"`
- [ ] 首页默认使用 FragmentedPhoneScene
- [ ] 页面不再显示完整手机底图 + 装饰碎片
- [ ] 0% 时手机大部分是散落碎片/淡轮廓
- [ ] 50% 时手机明显半完整，有缺口
- [ ] 100% 时手机完整
- [ ] 存钱解锁时能看到碎片从外部飞回
- [ ] 小金额时能看到光线投喂最近碎片
- [ ] `/lab/assets` 可以切换 fragmented/asset/svg
- [ ] `npm run build` 通过
- [ ] 安卓端不卡顿

---

## 12. 可直接发送给 Codex 的 Prompt

```text
请进入 V7「破碎重组式主视觉」阶段。

当前反馈：
V5 资产驱动和 V6 调参页已经完成，但现在的主视觉仍然像“完整手机 + 装饰碎片”。小红书参考图的核心是“手机本体被打碎，碎片从旁边飞回来，慢慢重新组成完整物体”。因此需要改实现方式，不是继续优化装饰碎片。

本轮目标：
实现 Fragmented Reassembly：用一张完整手机图通过 CSS clip-path 切成 18-24 个不规则碎片。已解锁碎片在目标位置组成手机，未解锁碎片散落在手机周围。存钱解锁时，对应碎片从外部飞回目标位置。100% 时完整手机出现。

请完成：

1. 新增 lib/fragmented-phone-map.ts
   - 定义 PhoneShard 类型
   - 配置 18-24 个不规则 shard
   - 每个 shard 包含 clipPath、startX、startY、startRotate、startScale、zIndex、unlockAt
   - polygon 必须不规则，不要做矩形网格

2. 新增 components/FragmentedPhoneScene.tsx
   - 使用同一张 phone-render 图作为背景
   - 每个 shard 是一个 absolute full-size layer，通过 clipPath 显示手机的一部分
   - 已解锁 shard transform 到目标位置
   - 未解锁 shard transform 到外部漂浮位置
   - 新解锁 shard 从外部飞回
   - 小金额 warmup 时，光线飞向最近未解锁 shard
   - 100% 时完整手机 fade in，完成 badge 出现

3. 新增 public/wish-assets/phone/phone-render.svg
   - 作为 fallback 手机图
   - 抽象智能手机背面
   - 粉白/银色/玫瑰金风格
   - 有镜头模组
   - 不使用 Apple / iPhone 官方素材

4. 更新 app/page.tsx
   - HERO_MODE 扩展为 "fragmented" | "asset" | "svg"
   - 默认使用 "fragmented"
   - 保留 AssetHeroScene 和 WishHeroScene fallback

5. 更新 app/lab/assets/page.tsx
   - 增加模式切换 fragmented / asset / svg
   - 可以用 slider 预览不同 progress 下碎片重组效果

6. 更新 README 和文档
   - 新增 docs/codex-notes/2026-07-04-v7-fragmented-reassembly.md
   - 说明 V7 从“装饰碎片”改为“破碎重组”

要求：
- 不要引入 Three.js
- 不要引入 Canvas
- 不要做真实 3D
- 不要做多目标
- 不要做登录
- 不要做云同步
- 不要打包 APK
- 不要删除 V4/V5 fallback
- 完成后运行 npm run build 并汇报结果
```

---

## 13. 产品判断

V7 是真正接近小红书参考图的关键一版。

之前版本都是：

> 把碎片放在手机周围。

V7 要变成：

> 手机本身就是碎片组成的。

这才是“破碎之后的重组”。
