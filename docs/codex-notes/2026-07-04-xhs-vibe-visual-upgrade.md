# Codex 同步说明：从功能反馈升级到小红书爽感视觉

> 建议路径：`docs/codex-notes/2026-07-04-xhs-vibe-visual-upgrade.md`  
> 适用仓库：`xiyan13411-ai/check-think`  
> 当前状态：MVP + Post-MVP + 小金额反馈 + PWA 验收基本完成  
> 本次目标：从“功能正确”升级到“有小红书那种存钱爽感”。

---

## 1. 当前结论

当前项目已经完成了：

- 存钱逻辑
- localStorage
- 快捷金额和自定义金额
- 拼图进度
- 新增碎片动画
- 下一块碎片进度
- 小金额预热反馈
- 差异化文案
- PWA 桌面入口
- 安卓真机基础验收

但是用户真机体验反馈是：

> 明显了一点，但是没有爽感。  
> 最后目标是小红书那种感觉。

这个判断是准确的。

当前问题不是逻辑不足，而是**主视觉表达不足**。

现在的核心视觉仍然是：

> 8 × 5 的抽象色块网格。

这更像“进度可视化”，而不是“愿望物品正在被拼回来”。

小红书那种爽感的关键不是多一个进度条，而是：

> 让用户看到具体物品、碎片飞回、形体逐渐完整、每次存钱像一次小型奖励事件。

---

## 2. 当前版本与目标版本的差距

| 维度 | 当前版本 | 目标版本 |
|---|---|---|
| 主视觉 | 抽象拼图格子 | 明确的愿望物品，例如手机 |
| 反馈层级 | 金额 + 进度 + 小格子 | 物品变完整 + 碎片飞入 + 光效 |
| 情绪 | “我记录了存钱” | “我的愿望又回来一块” |
| 小金额反馈 | 下一块进度 | 钱被吸入愿望物品，物品发光 |
| 大额反馈 | 多格子动画 | 多个碎片飞回物品 |
| 传播感 | 工具感 | 可以截图发小红书 |
| 爽感来源 | 信息反馈 | 视觉奖励事件 |

所以，下一阶段不要先做多目标、分享海报、云同步、登录。

应该先做：

> 愿望物品主视觉升级。

---

## 3. 下一阶段目标

本阶段目标：

把 `PuzzleView` 从“抽象格子进度”升级为“愿望物品拼装视图”。

MVP 目标物品先固定为：

```txt
新手机 / iPhone 风格手机
```

不需要真的使用 iPhone 商标，不要使用 Apple 官方素材。可以做一个抽象智能手机 SVG / CSS 图形。

目标效果：

- 页面中间出现一个大号手机模型
- 未完成时是灰色轮廓 / 半透明机身
- 已解锁部分逐步显现
- 每次解锁碎片时，有碎片飞回手机对应位置
- 小金额未解锁时，有能量点 / 光点飞向手机
- 进度条退居辅助，不再是主角

---

## 4. 设计方向

### 4.1 主视觉：手机物品拼装

建议新增组件：

```txt
components/WishObjectView.tsx
```

或者重构 `PuzzleView.tsx`，但建议先新建 `WishObjectView`，避免一次性破坏当前稳定组件。

组件职责：

- 展示一个抽象手机形体
- 根据 unlockedPieces 显示不同完成度
- 处理新增碎片飞入
- 处理小金额能量预热
- 展示下一块碎片进度

### 4.2 手机视觉结构

用 CSS / SVG 实现一个手机，不要引入图片版权问题。

建议结构：

```txt
手机外壳
  - 圆角机身
  - 屏幕区域
  - 摄像头小孔
  - 底部小横条
  - 玻璃高光
```

视觉状态：

- 未解锁区域：灰色 / 半透明 / 模糊
- 已解锁区域：粉橙渐变 / 亮色玻璃感
- 当前下一块：轻微发光
- 完成 100%：整机发光 + 彩带/星星

### 4.3 碎片表达

不需要真实图像切割，可以模拟。

方案 A：Overlay 分层遮罩

- 把手机屏幕分成 40 个区域
- 已解锁区域亮起来
- 未解锁区域暗
- 新解锁区域播放 pop-in

方案 B：碎片飞入手机

- 每次解锁新增碎片时，从按钮附近或屏幕底部飞入手机
- 飞入目标位置可以用随机偏移，不必精确
- 飞入后对应区域亮起来

方案 C：能量球推进

- 小金额没有解锁碎片时，显示一个小光点飞入手机
- 手机轻微发光
- 下一块进度条增长

建议本轮实现：

> 方案 A + 方案 C。  
> 方案 B 可以做简化版，不做复杂轨迹。

---

## 5. Codex 本轮任务

### Task 1：新增愿望物品主视觉组件

新增：

```txt
components/WishObjectView.tsx
```

Props 建议：

```ts
type WishObjectViewProps = {
  totalPieces: number;
  unlockedPieces: number;
  currentAmount: number;
  targetAmount: number;
  newlyUnlockedPieceIndexes?: number[];
  warmUpNextPiece?: boolean;
};
```

内部实现：

- 手机外壳
- 屏幕区域
- 40 个 overlay 碎片
- 已解锁碎片高亮
- 未解锁碎片暗色
- 新增碎片动画
- 小金额 warm-up 动画
- 下一块碎片进度

不要删除 `PuzzleView.tsx`，可以先保留备用。

---

### Task 2：用 WishObjectView 替换首页 PuzzleView

在 `app/page.tsx` 中：

- 引入 `WishObjectView`
- 用它替代当前 `PuzzleView`
- 保持 props 和现有逻辑兼容
- 不要改动存钱逻辑、成就逻辑、历史逻辑

---

### Task 3：增强“存钱事件”视觉反馈

每次成功存钱时，除了 toast，还应有一个小事件。

如果本次解锁碎片：

- 手机区域发光
- 新碎片区域 pop-in
- 可以显示 `+N 块碎片`
- 可选：几个小星星从手机边缘散开

如果本次没有解锁碎片：

- 小光点飞向手机
- 下一块碎片轻微 pulse
- 手机整体轻微 glow
- 文案提示“愿望被喂了一口”

不要做太重，不要卡安卓机。

---

### Task 4：调整页面信息层级

当前页面里“进度条/格子”过于工具化。

建议：

1. 主视觉：手机愿望物品
2. 其次：当前金额
3. 其次：存钱按钮
4. 辅助：下一块进度
5. 辅助：历史记录

UI 重点要变成：

> 我看见目标物品正在成形。

而不是：

> 我看见一个 40 格进度板。

---

### Task 5：保留原逻辑作为 fallback

不要删除已有：

- PuzzleView
- 下一块碎片计算逻辑
- 文案库
- localStorage
- 重置数据
- 成就弹窗

如果新组件有问题，可以快速回退。

---

## 6. 视觉验收标准

本轮完成后，安卓真机上应该满足：

- [ ] 用户一眼能看出目标是“手机”
- [ ] 页面不再像普通进度表
- [ ] 存 ¥10 时，手机区域有明显“被投喂”的反馈
- [ ] 存 ¥50 / ¥100 时，下一块进度变化明显
- [ ] 存 ¥500 / ¥1000 时，新碎片显现明显
- [ ] 解锁碎片时有奖励感
- [ ] 100% 完成时有“目标达成”的仪式感
- [ ] 动画不卡顿
- [ ] UI 仍然小红书感，不像后台系统
- [ ] `npm run build` 通过

---

## 7. 不要做的事

本轮不要做：

- 多目标管理
- 自定义上传图片
- 分享海报
- 登录
- 云同步
- 后端
- 支付
- APK
- 真实 3D
- Three.js
- 复杂 canvas
- 复杂图片切割

原因：

> 现在要先验证“固定手机目标物品”的爽感。  
> 如果固定物品都没爽感，做自定义图片只会把复杂度放大。

---

## 8. 建议实现细节

### 8.1 CSS 手机容器

可以用 div 实现：

```tsx
<div className="relative mx-auto h-72 w-40 rounded-[2rem] bg-stone-200 p-2 shadow-xl">
  <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-stone-100">
    {/* piece overlay */}
  </div>
</div>
```

### 8.2 手机碎片 grid

在屏幕区域内：

```tsx
<div className="grid h-full w-full grid-cols-5 grid-rows-8 gap-[2px]">
  {pieces.map(...)}
</div>
```

建议手机内部使用 `5 × 8 = 40`，比当前 `8 × 5` 更像手机纵向屏幕。

### 8.3 已解锁碎片

```tsx
className={unlocked ? "bg-gradient-to-br from-pink-300 to-orange-300" : "bg-stone-200/70"}
```

### 8.4 新增碎片动画

```css
@keyframes object-piece-pop {
  0% { opacity: 0; transform: scale(0.4) translateY(20px) rotate(-8deg); }
  60% { opacity: 1; transform: scale(1.08) translateY(-4px) rotate(3deg); }
  100% { opacity: 1; transform: scale(1) translateY(0) rotate(0); }
}
```

### 8.5 小金额 warm-up

```css
@keyframes object-warm-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(244, 114, 182, 0); }
  50% { box-shadow: 0 0 24px rgba(244, 114, 182, 0.55); }
}
```

### 8.6 能量球

可选：

```tsx
{warmUpNextPiece && (
  <motion.div
    className="absolute bottom-4 left-1/2 h-3 w-3 rounded-full bg-pink-300"
    initial={{ opacity: 0, y: 40, scale: 0.5 }}
    animate={{ opacity: [0, 1, 0], y: [-10, -120], scale: [0.5, 1.2, 0.7] }}
  />
)}
```

---

## 9. 可直接发送给 Codex 的 Prompt

```text
请进入「小红书爽感视觉升级」阶段。

当前问题：
现在 App 的逻辑和反馈已经基本完成，但真机体验仍然没有小红书那种爽感。原因是主视觉仍然是抽象 8×5 拼图格子，更像进度表，而不是“愿望物品正在被拼回来”。

本轮目标：
把当前 PuzzleView 的主视觉升级为“愿望物品拼装视图”。目标物品先固定为一个抽象智能手机，不使用 Apple 或 iPhone 官方素材，只做 CSS/SVG 风格的手机模型。

请完成：

1. 新增 components/WishObjectView.tsx
   - 展示一个纵向手机模型
   - 手机屏幕内使用 5×8 = 40 个碎片区域
   - 已解锁碎片显示粉橙渐变
   - 未解锁碎片显示灰色/半透明
   - 新解锁碎片播放 pop-in 动画
   - 小金额未解锁碎片时，手机或下一块碎片有 warm-up glow
   - 显示下一块碎片进度和“再存 ¥X 就能拼回下一块”

2. 在 app/page.tsx 中用 WishObjectView 替代 PuzzleView
   - 保持现有存钱逻辑、成就逻辑、localStorage、文案逻辑不变
   - 继续传入 currentAmount、targetAmount、unlockedPieces、newlyUnlockedPieceIndexes、warmUpNextPiece

3. 增强存钱事件反馈
   - 解锁碎片时，手机区域有明显发光和 pop-in
   - 未解锁碎片时，有小光点/轻微 glow 表示钱被投喂到愿望里
   - 动画要轻，不要影响安卓性能

4. 保留原 PuzzleView 作为 fallback，不要删除

5. 更新 README
   - 说明主视觉已从抽象格子升级为愿望物品拼装视图
   - 说明当前目标物品是抽象手机模型
   - 下一阶段才考虑自定义目标图片

6. 新增或更新文档
   - docs/codex-notes/2026-07-04-xhs-vibe-visual-upgrade.md

禁止事项：
- 不要做多目标
- 不要做自定义上传图片
- 不要做分享海报
- 不要引入后端
- 不要引入 Three.js
- 不要做复杂 3D
- 不要打包 APK
- 不要使用 Apple / iPhone 官方素材

完成后运行 npm run build 并汇报结果。
```

---

## 10. 产品判断

这一步不是“小修小补”，而是产品质感的关键跃迁：

从：

> 我存了一笔钱，格子变了。

升级到：

> 我存了一笔钱，手机真的被拼回来了一块。

如果这个阶段做对，才有必要继续做：

1. 分享海报
2. 自定义目标图片
3. 多目标管理

如果这个阶段仍然没有爽感，不建议继续堆功能，而应该继续打磨主视觉和动画。
