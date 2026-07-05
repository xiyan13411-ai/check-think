# 心愿罐

一个愿望存钱 App：每存一笔钱，心愿物品就拼回来一块。

项目目标是把“攒钱”做成一个有反馈感的轻量仪式：金额增长、碎片吸附、进度推进、完成心愿。

## 当前状态

当前版本是移动端优先的产品原型，已具备完整单心愿闭环：

✅ 新增 earphone 心愿类型（🎧 新耳机 ¥1,999）
✅ 资产图替换为爆炸碎片视图风格（6组WebP）

> 🎯 V10 参考效果图对齐——完整 App 外壳（当前阶段）
- 心愿首页：顶部心愿卡、主视觉 Hero、进度卡、底部 Tab。
- 存钱交互：快捷金额、自定义金额、进度条、最近记录。
- 多心愿类型：MacBook、iPhone、相机、旅行箱、礼物、小家。
- 主视觉：使用生成的 WebP 产品图作为底图，通过 CSS `clip-path` 做碎片切片和吸附动画。
- 数据持久化：localStorage，本地刷新不丢失。

## 视觉说明

当前方案是 **2.5D runtime compositing**：

```txt
一张透明产品图
  -> 前端按 polygon 裁成碎片
  -> 碎片加厚度层、阴影、吸附动画
  -> 进度完成后显示完整产品图
```

它不是完整 3D 场景渲染。小红书参考图更像“预渲染 3D/AI 海报”：碎片本身有真实空间角度、断裂厚度、反射和遮挡关系。

因此当前实现能做到“产品图切片重组”，但和参考图的差距主要来自：

- 参考图是整体 3D 爆炸构图；当前是前端裁切 2D 图片。
- 参考图每个碎片都是独立 3D 物体；当前碎片是 CSS mask 平面。
- 参考图的光影、透视、遮挡在生成时已统一；当前由浏览器实时叠层模拟。

如果要进一步接近参考图，下一步应生成“已爆炸的完整 Hero 海报图”或“每个碎片单独的透明 3D 资产”，而不是继续只切一张平面图。

## 资源路径

生成图资产位于：

```txt
public/wish-assets/generated/macbook-hero.webp
public/wish-assets/generated/phone-hero.webp
public/wish-assets/generated/camera-hero.webp
public/wish-assets/generated/travel-hero.webp
public/wish-assets/generated/gift-hero.webp
public/wish-assets/generated/home-hero.webp
```

核心组件：

```txt
components/ReferenceAppShell.tsx
components/WishHeaderRow.tsx
components/ReferenceWishHero.tsx
components/ReferenceProgressCard.tsx
```

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- localStorage

## 本地运行

```bash
npm install
npm run dev
```

打开：

```txt
http://localhost:3000
```

构建检查：

```bash
npm run build
```

## 下一步

优先级最高的是视觉资产路线收敛：

1. 生成更接近参考图的完整 3D 爆炸 Hero 海报。
2. 或生成每个心愿物品的独立碎片透明资产。
3. 再让前端只负责进度、交互和轻量动效。

这样会比继续在 CSS 里模拟 3D 碎片更稳定。
