# Codex 同步说明：V4 从“好看的组件”升级为“小红书 Hero Scene”

> 建议路径：`docs/codex-notes/2026-07-04-v4-xhs-hero-scene.md`  
> 适用仓库：`xiyan13411-ai/check-think`  
> 当前状态：V3 飞行碎片奖励动效已完成，视觉已有改善，但与小红书参考仍有明显差距  
> 本次目标：从“手机组件 + 动效”升级为“小红书式主视觉 Hero Scene”。

---

## 1. 当前反馈

用户最新反馈：

> 还行了，但是差距还是比较明显的。

这是准确反馈。

V3 已经完成：

- 柔和手机显影
- 光点飞入
- 碎片奖励动效
- 完成态徽章
- PWA 可用
- 安卓真机可跑

但是当前页面仍然更像：

> 一个手机形状的网页组件。

而小红书参考更像：

> 一张有主角、有空间、有材质、有碎片叙事的产品海报。

所以 V4 不要继续微调按钮、文案或普通 CSS 动画。  
下一轮要重构主视觉的构图和材质。

---

## 2. 与小红书参考的关键差距

### 2.1 参考图的核心不是“手机屏幕”，而是“手机实物”

参考图中展示的是类似 iPhone 背面 / 机身实物：

- 有镜头模组
- 有金属边
- 有背板材质
- 有空间透视
- 有碎片漂浮
- 有被拼合的物理感

当前 V3 展示的是柔和的手机正面屏幕：

- 没有镜头
- 没有背板
- 没有实体碎片感
- 像一张壁纸屏幕
- 更像 App mockup，不像愿望物品

因此 V4 应从“手机屏幕”转向“手机实物背面 / 产品物体”。

---

### 2.2 参考图的碎片是“物理碎片”，当前是“装饰粒子”

小红书参考里，碎片是手机本身的一部分：

- 有厚度
- 有边缘
- 有高光
- 有阴影
- 方向不同
- 像从外部飞回来拼到机身上

当前 V3 的 flying shards 更像：

- 小方块
- 光点
- emoji 星星
- 装饰粒子

这会让用户感觉“有动画”，但不会觉得“物品真的拼回来了”。

V4 要做：

> 物理碎片感，而不是装饰粒子感。

---

### 2.3 参考图的 UI 很克制，当前 UI 还是工具型

参考图主要层级：

1. 顶部标题和目标
2. 大面积主视觉物品
3. 底部玻璃卡片：金额、进度、最近存钱
4. 一个大按钮：存一笔

当前页面层级：

1. 标题
2. 金额卡片
3. 手机视觉
4. 按钮区域
5. 历史列表

当前仍然像功能页，参考更像视觉中心页。

V4 应该让主视觉占据第一屏更多面积，金额和按钮合并到底部 glass panel。

---

### 2.4 参考图有“空间”，当前是“平面”

参考图有：

- 浮动碎片前后景
- 模糊远景碎片
- 光线轨迹
- 主手机阴影
- 背景径向光

当前 V3：

- 手机基本居中
- 光点在手机内
- 空间层次少
- 缺少前景/中景/后景

V4 要增加 2.5D 空间层：

- 背景远处虚化碎片
- 中央主手机
- 前景飞行碎片
- 柔和光线轨迹

---

## 3. V4 方向

V4 的核心策略：

> 不再把主视觉当成组件，而是当成一张小红书海报场景。

建议新增：

```txt
components/WishHeroScene.tsx
components/PhoneArtifact.tsx
components/FloatingFragments.tsx
```

也可以先只新增一个大组件 `WishHeroScene.tsx`，内部拆分小函数。

---

## 4. V4 主视觉设计

### 4.1 Hero Scene 结构

建议结构：

```tsx
<section className="relative overflow-hidden rounded-[2rem]">
  <BackgroundGlow />
  <LightTrails />
  <FloatingFragments layer="back" />
  <PhoneArtifact />
  <FloatingFragments layer="front" />
  <HeroProgressPanel />
</section>
```

视觉目标：

- 像一张产品海报
- 手机是主角
- 碎片围绕手机
- 底部玻璃卡片承载数据
- 页面截图能像小红书笔记封面

---

### 4.2 PhoneArtifact：手机实物，不是屏幕

新增：

```txt
components/PhoneArtifact.tsx
```

不要使用 Apple / iPhone 官方素材。  
做一个抽象高级智能手机背面。

元素：

- 机身背板
- 金属边框
- 镜头模组
- 2-3 个镜头圆
- 背面渐变材质
- 局部裂片 / 拼接线
- 高光面
- 阴影

CSS/SVG 都可以。

建议用 inline SVG 或 div + CSS。  
如果用 CSS，很难做复杂裂片；建议优先用 SVG。

SVG 优点：

- 可以画不规则碎片 path
- 可以控制每块碎片透明度
- 可以做高光和阴影
- 比 40 个 div 方块更像物品

---

### 4.3 视觉碎片数量不要等于逻辑碎片数

当前逻辑是 40 块。  
但是视觉上不应该显示 40 个小格。

建议映射：

```txt
逻辑碎片：40 块，用于进度计算
视觉碎片：12-16 个大碎片，用于物品表现
```

例如：

```ts
visualPieceCount = 14
visualUnlocked = Math.floor(progress * visualPieceCount)
```

为什么：

- 40 个视觉碎片太碎，像表格
- 12-16 个大碎片更像原图中的 3D 物理碎片
- 视觉更高级
- 动画更清晰
- 安卓性能更稳

保留 40 逻辑碎片用于进度，但主视觉使用 14 个 shard。

---

### 4.4 未完成状态

当 progress < 100%：

- 主手机中间部分已拼好
- 未拼好的视觉碎片漂浮在周围
- 已解锁区域显示为完整机身
- 未解锁区域可以用缺口/半透明占位表示
- 下一次解锁时，某个外部碎片飞回手机

不要让整个手机都透明或全亮。  
要让用户看到“差一点就完整”。

---

### 4.5 完成状态

当 progress >= 100%：

- 所有视觉碎片拼回机身
- 手机完整
- 周围光线更亮
- 可显示完成贴纸
- 底部进度卡显示 100%
- 不再展示漂浮未完成碎片

完成态不要只是更多星星，应该是：

> 物品完整了。

---

## 5. 交互与动效

### 5.1 小金额 warmup

没有解锁视觉碎片时：

- 一条小光线从底部存钱按钮方向飞向手机
- 手机轻轻亮一下
- 某个未解锁碎片边缘发亮
- 不需要显示很多粒子

### 5.2 解锁碎片

解锁时：

- 一个视觉碎片从手机外侧飞向目标位置
- 飞行路径使用曲线感：x/y/rotate/scale
- 到达时吸附到手机
- 手机闪一下
- 底部进度同步增长

### 5.3 大额存钱

如果一次解锁多个逻辑碎片：

- 不需要让几十块飞
- 最多飞 2-4 个视觉碎片
- 其余通过 glow / progress 表示
- 避免动画乱

### 5.4 100% 完成

完成时：

- 2-4 个最后碎片飞回
- 手机完整
- 背景光晕增强
- 少量星光散开
- 文案出现：`愿望拼回来了`

不要用太多 emoji。  
emoji 会让视觉变廉价。用 CSS 小星点替代。

---

## 6. UI 布局调整

V4 建议调整首页结构，不要让金额卡片抢主视觉。

当前：

```txt
Title
GoalCard
WishPhoneReveal
SavePanel
History
```

建议：

```txt
Title
WishHeroScene
SavePanel / BottomPanel
History
```

或者把 GoalCard 信息合并到 HeroScene 底部：

```txt
WishHeroScene:
  Top: 新 iPhone / 连续 7 天
  Center: phone artifact
  Bottom glass panel:
    已存 ¥1,280
    目标 ¥7,999
    进度 16%
    progress bar
    最近存入 ¥80
    大按钮 存一笔
```

这更接近参考图。

但是为了减少改动，本轮可以先：

- 保留 GoalCard
- 只重构主视觉
- 下一轮再重构布局

如果时间允许，优先把 HeroScene 做好。

---

## 7. Codex 需要执行的任务

### Task 1：新增 WishHeroScene

新增：

```txt
components/WishHeroScene.tsx
```

Props：

```ts
type WishHeroSceneProps = {
  totalPieces: number;
  unlockedPieces: number;
  currentAmount: number;
  targetAmount: number;
  newlyUnlockedPieceIndexes?: number[];
  warmUpNextPiece?: boolean;
  saveAnimation?: {
    key: number;
    mode: "warmup" | "unlock" | "complete";
    count: number;
  } | null;
};
```

职责：

- 负责主视觉海报场景
- 内含手机实物
- 内含浮动碎片
- 内含光线/背景
- 内含下一块进度轻提示

---

### Task 2：新增 PhoneArtifact

可以作为内部组件或独立文件：

```txt
components/PhoneArtifact.tsx
```

要求：

- 做抽象智能手机背面
- 不使用 Apple / iPhone 官方素材
- 有镜头模组
- 有金属边
- 有背板渐变
- 有高光
- 有阴影
- 有不规则视觉碎片

推荐使用 inline SVG。

---

### Task 3：新增 FloatingFragments

新增：

```txt
components/FloatingFragments.tsx
```

要求：

- 生成 8-12 个外部碎片
- 分为 back layer / front layer
- 部分模糊
- 部分清晰
- 不同大小和角度
- progress 越高，未拼回的外部碎片越少
- 解锁时可触发部分碎片飞回

---

### Task 4：替换 WishPhoneReveal

在 `app/page.tsx`：

- 用 `WishHeroScene` 替换 `WishPhoneReveal`
- 保留 `WishPhoneReveal` 文件作为 fallback
- 不删除 `WishObjectView` 和 `PuzzleView`
- 不改存钱逻辑
- 不改 localStorage
- 不改成就逻辑

---

### Task 5：减少 emoji

当前完成态和奖励中有较多 emoji。  
V4 建议：

- 少用 emoji
- 使用 CSS 小星点、小圆点、渐变 shard
- 保持高级感

可以保留文案中的 🎉，但不要到处都是 emoji 粒子。

---

### Task 6：文档更新

更新：

```txt
README.md
docs/codex-notes/2026-07-04-v4-xhs-hero-scene.md
```

说明：

- V4 从组件视觉升级为 Hero Scene
- 手机从正面屏幕变为抽象背面物品
- 视觉碎片从 40 格变为 12-16 个物理 shard
- 保留 40 逻辑碎片用于进度计算
- 不使用官方 Apple/iPhone 素材

---

## 8. 禁止事项

本轮不要做：

- 多目标管理
- 自定义图片上传
- 分享海报
- 登录
- 云同步
- 后端
- 支付
- 银行绑定
- Capacitor
- APK
- Three.js
- Canvas 粒子系统
- 真实 3D 引擎
- 使用 Apple / iPhone 官方素材

本轮只做：

> 小红书 Hero Scene 主视觉重构。

---

## 9. 验收标准

完成后真机测试应满足：

- [ ] 第一眼更像小红书产品海报
- [ ] 手机更像实物，不是正面屏幕壁纸
- [ ] 能看到镜头模组 / 背板 / 金属边等物品质感
- [ ] 外部碎片像手机的一部分，不像装饰小方块
- [ ] 有前后景空间层次
- [ ] 小金额存钱有光线飞向手机
- [ ] 解锁时有碎片飞回手机的感觉
- [ ] 100% 时手机完整，而不是粒子乱飞
- [ ] 动画不卡顿
- [ ] `npm run build` 通过

---

## 10. 可直接发送给 Codex 的 Prompt

```text
请进入 V4「小红书 Hero Scene 主视觉重构」阶段。

当前反馈：
V3 加了 FlyingShards 后已经“还行”，但和小红书参考图差距仍明显。核心差距不是功能，而是主视觉仍然像一个手机组件，不像一张有空间、有物品质感、有碎片拼合叙事的小红书产品海报。

本轮目标：
把主视觉从 WishPhoneReveal 的“柔和手机正面显影”升级为“小红书 Hero Scene”。目标是更接近参考图：一个抽象智能手机背面物体，周围有物理碎片，存钱时碎片飞回，逐步拼成完整物品。

请完成：

1. 新增 components/WishHeroScene.tsx
   - 作为新的主视觉场景
   - 有背景光晕、前后景碎片、中心手机物体、轻量进度提示
   - Props 与 WishPhoneReveal 兼容

2. 新增或内置 PhoneArtifact
   - 做一个抽象智能手机背面
   - 不使用 Apple / iPhone 官方素材
   - 有镜头模组、背板、金属边、高光、阴影
   - 建议用 inline SVG 实现不规则碎片和材质
   - 不要做普通正面屏幕壁纸

3. 新增或内置 FloatingFragments
   - 使用 8-12 个不规则碎片
   - 分前景/后景
   - 部分模糊，部分清晰
   - 碎片像手机的一部分，不像装饰方块
   - 解锁时少量碎片飞回手机
   - 100% 时外部碎片减少或消失，手机完整

4. 视觉逻辑
   - 保留 40 个逻辑碎片用于进度计算
   - 主视觉不要显示 40 格
   - 主视觉映射成 12-16 个物理碎片
   - 小金额：光线/小光点飞向手机
   - 解锁：碎片飞回手机
   - 完成：手机完整 + 柔和光晕 + 完成文案

5. 替换首页
   - 在 app/page.tsx 中用 WishHeroScene 替换 WishPhoneReveal
   - 保留 WishPhoneReveal、WishObjectView、PuzzleView 作为 fallback
   - 不改存钱逻辑、localStorage、历史、成就

6. 文档
   - 更新 README
   - 新增 docs/codex-notes/2026-07-04-v4-xhs-hero-scene.md

禁止事项：
- 不要做多目标
- 不要做自定义上传图片
- 不要做分享海报
- 不要做登录
- 不要做云同步
- 不要引入后端
- 不要打包 APK
- 不要引入 Three.js / Canvas
- 不要使用 Apple / iPhone 官方素材

完成后运行 npm run build 并汇报结果。
```

---

## 11. 产品判断

V3 解决了“有动效”的问题。  
V4 要解决“像不像小红书主视觉”的问题。

小红书感不是按钮、文案和进度条堆出来的，而是：

> 大主视觉 + 物品质感 + 空间层次 + 动作因果。

如果 V4 做对，后续再做分享海报会自然很多。  
如果 V4 还不够像，就不该急着做多目标，而应该继续修主视觉。
