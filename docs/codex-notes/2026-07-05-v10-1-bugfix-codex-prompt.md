# V10.1 Codex 修复指令：先止血，再继续做质感

> Repository: `xiyan13411-ai/check-think`  
> 基于当前 V10 截图反馈  
> 原则：先修明显 bug，不要继续扩大功能范围。  

---

## 0. 当前判断

V10 已经把整体页面结构拉近参考图：顶部标题、愿望行、Hero 大图、进度卡片、底部 Tab 都有了。

但是当前版本除了“存一笔”还能点击，视觉和布局有明显问题：

1. Hero 区域出现多张半透明手机叠影，像调试稿，不像一个完整破碎重组主视觉。
2. Hero 整体过灰、过透明，主体手机缺少高对比和质感。
3. Hero 中有大块半透明矩形/遮罩残留，疑似旧 V4/V7 场景层没有清理干净。
4. 页面中间残留 `V4 Hero Scene`、`检查更新` 调试文字，必须移除或隐藏。
5. 底部导航目前是符号占位，视觉弱，且内容区没有给底部导航足够 padding。
6. 顶部状态栏/标题区高度、左右按钮和参考图还有差距。
7. 进度卡片相对接近参考图，但按钮、最近一笔、进度条细节需要再收敛。

本轮不要做复杂新功能。目标是让页面先稳定、干净、像参考图。

---

## 1. 最高优先级修复

### 1.1 移除页面调试残留

检查并清理：

```txt
V4 Hero Scene
检查更新
```

可能来源：

```txt
components/AppUpdateNotice.tsx
app/page.tsx
components/WishHeroScene.tsx
components/AssetHeroScene.tsx
components/FragmentedPhoneScene.tsx
```

要求：

- 首页不要显示 `V4 Hero Scene`。
- 首页不要显示 `检查更新`。
- 如果 `AppUpdateNotice` 只是开发调试组件，暂时从首页移除。
- 保留组件文件本身可以，但不要在 V10 首页渲染。

---

### 1.2 Hero 只保留一个主视觉系统

当前 Hero 像是多个旧场景叠在一起：V4/V7/V10 ghost 都在画。

请检查 V10 Hero 组件，要求：

- 不要同时渲染 `WishHeroScene`、`AssetHeroScene`、`FragmentedPhoneScene`、手写 ghost phone。
- V10 首页只渲染一个 Hero 组件，例如：

```tsx
<ReferencePhoneHero progress={progress} />
```

- 旧组件可以保留，但不要叠在 V10 Hero 里。
- Hero 里只能有：
  1. 一个淡背景光场。
  2. 一个主手机/碎片组合。
  3. 少量外部漂浮碎片。
  4. 可选的淡蓝光线。

---

### 1.3 Hero 主体不要用多张半透明整机叠影

当前截图里有 3-4 台半透明手机叠在一起，视觉非常脏。

修复策略：

- 删除多张整机 ghost layer。
- 最多保留一层极淡 silhouette，opacity 控制在 `0.06 - 0.10`。
- 主体手机必须是高对比、清晰的一个对象。
- 进度未满时，通过碎片缺失表达“未完成”，不要通过多台手机叠影表达。

建议结构：

```tsx
<div className="reference-hero">
  <div className="hero-bg-glow" />
  <div className="phone-silhouette" />  // 可选，极淡
  <div className="phone-shards-layer" /> // 主体，清晰
  <div className="floating-shards-layer" />
</div>
```

---

## 2. Hero 视觉收敛参数

### 2.1 Hero 容器

参考图 Hero 容器建议：

```tsx
<section className="relative mt-4 h-[552px] overflow-hidden rounded-[24px] bg-[#f7f4ee]">
```

移动端可用：

```tsx
className="relative h-[552px] overflow-hidden rounded-[24px] bg-[#f7f4ee]"
```

如果页面太长，可降到：

```tsx
h-[520px]
```

但不要再小于 500px，否则主视觉没有气势。

---

### 2.2 手机主图

当前若使用 `phone-render.svg`，请保证清晰度：

```tsx
className="absolute left-1/2 top-[42%] w-[250px] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] drop-shadow-2xl"
```

透明度：

```tsx
opacity: 1
```

不要对主手机使用：

```tsx
opacity-20
opacity-30
blur
mix-blend-multiply
```

这会导致当前这种灰雾效果。

---

### 2.3 未解锁碎片

未解锁碎片可以漂浮在外部，但不能都是灰色透明大块。

建议：

```tsx
opacity: unlocked ? 1 : 0.88
filter: unlocked
  ? "drop-shadow(0 16px 24px rgba(15,23,42,0.18))"
  : "drop-shadow(0 12px 18px rgba(15,23,42,0.14))"
```

未解锁碎片仍然要有实体感。

---

### 2.4 移除大块半透明矩形

当前 Hero 中间有明显大矩形灰色蒙版。

检查是否存在类似：

```tsx
<div className="absolute ... bg-gray-... opacity-..." />
<div className="absolute ... backdrop-blur..." />
<div className="absolute ... bg-white/40 ..." />
```

除背景柔光外，不要放大块半透明矩形。参考图背景是干净暖白，不是灰玻璃叠片。

---

## 3. 进度卡片修复

当前进度卡片方向对，但需要收敛：

### 3.1 卡片尺寸和间距

```tsx
className="mt-4 rounded-[18px] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
```

### 3.2 已存金额

```tsx
<span className="text-xs text-stone-400">已存</span>
<div className="text-[28px] font-bold leading-none text-stone-950">¥1,680</div>
```

### 3.3 进度百分比

参考图右侧是大蓝色数字：

```tsx
<div className="text-right">
  <span className="text-[34px] font-bold text-blue-500">21</span>
  <span className="ml-1 text-xs text-stone-400">%</span>
</div>
```

### 3.4 最近一笔

当前“刚刚存入 ¥80”应该做成浅蓝底 pill，不要太抢：

```tsx
<div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 text-xs">
  <span className="font-semibold text-blue-600">刚刚存入 ¥80</span>
  <span className="text-stone-400">今天</span>
</div>
```

### 3.5 主按钮

```tsx
<button className="mt-4 h-14 w-full rounded-[18px] bg-blue-500 text-base font-bold text-white shadow-[0_10px_20px_rgba(59,130,246,0.28)] active:scale-[0.98]">
  存一笔
</button>
```

---

## 4. 底部 Tab 修复

不要用单字符符号当最终 icon。

可以先不用引入 icon 库，用 CSS/emoji/简单 SVG，但要统一：

```txt
心愿：房子/星星 icon
计划：靶心 icon
明细：时钟 icon
我的：笑脸 icon
```

要求：

- 底部 Tab 固定在视口底部。
- 首页主内容必须给 bottom padding：`pb-28`。
- Tab 背景：`bg-white/95 backdrop-blur`。
- 当前选中项蓝色或粉色，不要混乱。

示例：

```tsx
<nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] rounded-t-[18px] border-t border-black/5 bg-white/95 px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
```

---

## 5. App Shell 修复

参考图整体是一个 iPhone 截图感页面，不是普通网页卡片堆叠。

建议根结构：

```tsx
<main className="min-h-screen bg-[#f4f1ea] text-stone-950">
  <div className="mx-auto min-h-screen w-full max-w-[430px] px-4 pb-28 pt-4">
    ...
  </div>
  <BottomTabBar />
</main>
```

不要在根上继续使用旧的 `bg-orange-50 px-4 py-6`，否则和参考图不一致。

---

## 6. 不要做的事

本轮禁止：

- 不要新增登录、计划页、明细页真实功能。
- 不要接后端。
- 不要引入 Three.js。
- 不要继续叠多套旧 Hero。
- 不要把所有旧组件删除。
- 不要大改存钱逻辑。
- 不要让页面只剩静态假图，`存一笔` 必须继续能改变金额和进度。

---

## 7. 验收标准

完成后必须满足：

1. `npm run build` 通过。
2. 首页不显示 `V4 Hero Scene` 和 `检查更新`。
3. 点击 `存一笔` 后金额、进度、最近一笔变化。
4. Hero 区只看到一套主视觉，不再有多台半透明手机重叠。
5. Hero 没有大块灰色矩形残留。
6. 页面结构接近参考图：Header / Wish Row / Hero / Progress Card / Bottom Tab。
7. 375px、390px、430px 宽度下无横向滚动。

---

## 8. 建议执行顺序

1. 先清理 `AppUpdateNotice` 和调试文字。
2. 再重构 `ReferencePhoneHero`，只保留一套视觉层。
3. 再微调 `ReferenceProgressCard`。
4. 最后修底部 Tab 和页面 padding。
5. 跑 `npm run build`。
6. 提交 commit：

```txt
fix: stabilize V10 reference app layout
```
