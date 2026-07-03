# Codex 同步说明：V8 参考图风格碎片重组升级

> 建议路径：`docs/codex-notes/2026-07-04-v8-reference-style-fragments.md`  
> 适用仓库：`xiyan13411-ai/check-think`  
> 当前状态：V7 已实现破碎重组逻辑，但视觉仍然不完整、手机样式单调  
> 本次目标：不再只验证逻辑，而是让破碎重组主视觉更接近参考图形式。

---

## 1. 当前反馈

用户反馈：

> 图片不是很完整啊，而且手机样式是不是太单调了，模拟这种形式。

配图参考是小红书原型中的手机碎片重组视觉：

- 手机是高质感实物
- 有银白背板
- 有深色蓝黑屏幕/反光区域
- 有立体镜头模组
- 碎片有厚度、阴影和高光
- 碎片从四周飞回手机主体
- 主体不是淡淡的粉色卡片，而是有明确产品质感的物品

当前 V7 方向对了，但效果还不够像。

---

## 2. V7 当前问题

### 2.1 手机图不完整

当前 `phone-render.svg` 太淡、太平，作为碎片背景时：

- 手机轮廓不够明显
- 切出来的碎片对比弱
- 100% 时看起来仍然像半透明图层
- 主体没有参考图那种完整产品感

### 2.2 切片方式太规整

当前使用类似 `5×4` 的不规则网格生成 20 个 shard。

问题：

- 仍然能看出网格结构
- 不像真实破碎
- 中间缺口不够自然
- 边缘碎片不够锋利
- 视觉不像“玻璃/机身碎裂”

### 2.3 缺少材质层

参考图的爽感来自材质：

- 金属边缘
- 玻璃高光
- 白色陶瓷/金属背板
- 深蓝屏幕反光
- 镜头高光
- 碎片侧面厚度

当前 SVG 更像平面插画，没有足够材质层。

### 2.4 碎片不像手机的一部分

当前碎片虽然用了 `clip-path`，但由于底图太淡，视觉上仍然像白色淡块。

V8 需要让碎片带有：

- 明暗面
- 边缘描边
- 投影
- 高光
- 部分深色区域
- 与手机主体一致的纹理

---

## 3. V8 核心方向

V8 不再只是“破碎重组逻辑”，而是：

> 参考图风格的 2.5D 破碎重组。

目标：

1. 手机主体更像高质感产品渲染。
2. 碎片更像从手机上碎出来的物理块。
3. 不完整状态下，手机有明显缺口。
4. 解锁时，碎片从外部飞回缺口。
5. 100% 时，手机完整且有完成奖励感。

---

## 4. 推荐实现方式

V8 继续不用 Three.js。  
用 **增强 SVG + clip-path + 多层材质** 实现。

### 4.1 改造 `phone-render.svg`

请重做：

```txt
public/wish-assets/phone/phone-render.svg
```

要求：

- 竖向智能手机背面
- 主体偏白色 / 银色 / 奶油色
- 有深色蓝黑反光区域，模拟参考图里露出的屏幕/暗面
- 有金属边框
- 有立体镜头模组
- 有高光线
- 有底部阴影
- 整体比现在更清晰、更完整、更有对比

不要使用 Apple / iPhone 官方素材。  
可以做抽象高级智能手机。

建议 SVG 层级：

```txt
defs:
  gradients
  filters
  phoneBodyClip

body:
  phone shadow
  metal rim
  back plate gradient
  dark blue reflection area
  camera island
  lenses
  glass highlights
  subtle crack lines
```

---

### 4.2 改造 shard map

重做：

```txt
lib/fragmented-phone-map.ts
```

不要再用 5×4 网格。

改为手工配置 18-22 个不规则碎片：

- 大碎片：6-8 个，构成机身主体
- 中碎片：8-10 个，补边缘和中部
- 小碎片：4-6 个，漂浮在外部

每个 polygon 应该更像裂片：

```ts
clipPath: "polygon(34% 8%, 58% 12%, 54% 28%, 38% 24%, 30% 16%)"
```

不要使用规则矩形或平均分块。

### 4.3 增加 shard 边缘效果

每个 shard 不应该只是 clipped background。

建议增加：

- `filter: drop-shadow(...)`
- `outline` 或 pseudo border
- 轻微 `box-shadow`
- `::after` 高光层，模拟碎片边缘
- 解锁后边缘减弱
- 未解锁漂浮时边缘更明显

CSS class：

```css
.fragment-shard {
  filter: drop-shadow(0 10px 18px rgba(80, 60, 60, 0.16));
}

.fragment-shard::after {
  content: "";
  position: absolute;
  inset: 0;
  clip-path: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.55), transparent 45%);
  pointer-events: none;
}
```

如果 `::after` 不方便，可在组件内加一层 overlay。

---

## 5. V8 关键视觉目标

### 5.1 0%

- 中心只显示淡淡的手机轮廓
- 大部分碎片在外部
- 外部碎片清晰可见，有厚度
- 用户能感到“手机还没拼回来”

### 5.2 50%

- 手机主体一半拼回
- 中间有明显缺口
- 外部还漂着若干碎片
- 主体仍有明确手机形态

### 5.3 100%

- 手机完整
- 不再显得淡
- 外部碎片收回或消失
- 完成态像一张小海报

---

## 6. Codex 需要执行的任务

### Task 1：重做 phone-render.svg

修改：

```txt
public/wish-assets/phone/phone-render.svg
```

要求：

- 更清晰
- 更完整
- 更像产品渲染
- 加深对比
- 增加深蓝/黑色反光区域
- 增加镜头细节
- 增加金属边缘
- 增加高光与阴影
- 不使用官方 Apple / iPhone 素材

验收：

- 单独打开 SVG 时，能一眼看出是一台高级手机背面
- 切成碎片后，每块也能看出材质
- 不再只是淡粉色块

---

### Task 2：重做 fragmented-phone-map

修改：

```txt
lib/fragmented-phone-map.ts
```

要求：

- 从 20 个网格 shard 改为 18-22 个手工不规则 shard
- 每个 shard 的 `clipPath` 都要不规则
- 视觉上要覆盖整台手机
- 不要留下过大空白导致“图片不完整”
- 大小碎片要有变化
- startX/startY 分布在四周
- zIndex 有前后层次
- blur 只给后景远处碎片，不要让主体碎片模糊

---

### Task 3：增强 FragmentedPhoneScene 视觉

修改：

```txt
components/FragmentedPhoneScene.tsx
```

要求：

- 增加 ghost silhouette，0% 时仍能看出手机轮廓
- 已解锁 shard 拼回主体位置
- 未解锁 shard 漂浮在外部
- 外部 shard 有阴影、高光、边缘感
- 100% 时淡入完整 phone-render 或 complete overlay
- 完成态隐藏多余外部碎片
- 增加柔和光线轨迹，但不要太多

---

### Task 4：增加参考图风格调试参数

在 `/lab/assets` 中增加 V7/V8 调试信息：

- 当前模式：fragmented
- 当前 shard 数量
- 当前已拼回 shard 数量
- 当前外部 shard 数量
- progress slider
- 是否显示完整底图
- 是否显示 ghost silhouette

可选增加开关：

```txt
Show ghost
Show complete overlay
Show shard outlines
```

这些开关仅用于调试，不要出现在正式首页。

---

### Task 5：更新文档

新增或更新：

```txt
docs/codex-notes/2026-07-04-v8-reference-style-fragments.md
README.md
docs/VISUAL_QA_CHECKLIST.md
```

README 增加：

- V8 目标是参考图风格破碎重组
- 重做了 phone-render.svg
- 使用手工不规则 shard map
- 当前仍是 2.5D CSS/SVG，不是 Three.js

---

## 7. 禁止事项

本轮不要做：

- Three.js
- Canvas
- React Three Fiber
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

---

## 8. 验收标准

完成后应满足：

- [ ] 手机不再像淡粉色卡片
- [ ] 手机主体更完整
- [ ] 镜头模组更清晰
- [ ] 有深色反光区域，接近参考图的蓝黑暗面
- [ ] 碎片不再像规则网格
- [ ] 碎片有边缘、高光、阴影
- [ ] 0% 能看到散落碎片和淡轮廓
- [ ] 50% 能看到手机半拼合状态
- [ ] 100% 能看到完整手机完成态
- [ ] 外部碎片像手机的一部分
- [ ] 安卓端不卡顿
- [ ] `npm run build` 通过

---

## 9. 可直接发送给 Codex 的 Prompt

```text
请进入 V8「参考图风格破碎重组」阶段。

当前反馈：
V7 已实现单图 clip-path 破碎重组逻辑，但视觉仍然不够完整，手机样式太单调。参考图里是高质感白银手机，有镜头、金属边、深蓝/黑色反光区域，碎片有厚度和高光。当前 V7 更像淡粉色手机卡片被切开，缺少材质和完整感。

本轮目标：
在不引入 Three.js / Canvas 的前提下，用增强 SVG + 手工不规则 shard map，让 FragmentedPhoneScene 更接近参考图的“手机本体破碎后重组”。

请完成：

1. 重做 public/wish-assets/phone/phone-render.svg
   - 抽象高级智能手机背面
   - 白色/银色/玫瑰金机身
   - 清晰镜头模组
   - 金属边框
   - 深蓝/黑色反光区域
   - 高光和阴影
   - 单独打开 SVG 就要像一个完整手机物体
   - 不使用 Apple / iPhone 官方素材

2. 重做 lib/fragmented-phone-map.ts
   - 不要再用 5×4 网格
   - 手工配置 18-22 个不规则 shard
   - polygon 必须像裂片，不要矩形网格
   - 大小碎片混合
   - 覆盖完整手机主体，避免主体残缺太大
   - startX/startY 分布在四周
   - zIndex 有层次

3. 增强 components/FragmentedPhoneScene.tsx
   - 加 ghost silhouette，让 0% 时仍能看出手机轮廓
   - shard 加边缘感、高光、drop-shadow
   - 未解锁 shard 在外部漂浮
   - 已解锁 shard 拼回主体
   - 100% 时完整手机 clear reveal
   - 减少淡粉雾感，提升手机材质对比

4. 更新 /lab/assets
   - 增加 fragmented 调试信息
   - 显示 shard 总数、已拼回数、外部碎片数
   - 可选调试开关：show ghost / show outlines / show complete overlay

5. 更新 README 和 docs/VISUAL_QA_CHECKLIST.md
   - 说明 V8 参考图风格升级
   - 说明仍是 2.5D SVG/CSS，不是 Three.js

要求：
- 不要引入 Three.js
- 不要引入 Canvas
- 不要做真实 3D
- 不要做多目标
- 不要做登录
- 不要做云同步
- 不要打包 APK
- 不要删除 V4/V5/V7 fallback
- 不要使用 Apple / iPhone 官方素材
- 完成后运行 npm run build 并汇报结果
```

---

## 10. 产品判断

V7 解决了“实现机制”：

> 手机本体可以由碎片组成。

V8 要解决“视觉可信度”：

> 这些碎片看起来真的像手机的一部分。

只要 V8 把手机素材和碎片材质做出来，距离参考图会比之前所有版本都更近。
