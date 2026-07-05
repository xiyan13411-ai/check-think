# 心愿积累 App — 愿望拼图存钱

每存一笔钱，愿望就拼回来一块。

一个情绪价值型存钱工具，通过拼图、动画、文案和成就反馈，让"存钱"变得像"收集愿望碎片"一样有爽感。

> 灵感来源：[小红书笔记](https://www.xiaohongshu.com/explore/6a4661e40000000021008d32) — 完整效果分析及V1/V2视觉对比见 [docs/XHS_BRIEF_ANALYSIS.md](docs/XHS_BRIEF_ANALYSIS.md)

---

## 当前状态

> 🎯 V4 小红书Hero Scene 主视觉重构（当前阶段）

> 🎯 V9 AI 视觉资产 + 纯文字 Prompt（当前阶段）

✅ docs/AI_ASSET_PROMPTS_TEXT_ONLY.md — 无识图模型专用文字 Prompt
✅ docs/REFERENCE_IMAGE_SOURCES.md — 手机背面参考图来源指引
✅ Pure text prompts optimized for text-only AI image models

> 🎯 V9 AI 视觉资产接入（当前阶段）

✅ public/wish-assets/phone/generated/ 目录 + README
✅ lib/wish-assets.ts — phoneRenderAsset (PNG优先+SVG降级)
✅ FragmentedPhoneScene — useAssetSrc() 自动检测PNG，失败回退SVG
✅ docs/AI_ASSET_PROMPTS.md — 3组AI生图Prompt (Midjourney/DALL-E)
✅ PNG 不存在时页面不崩溃，优雅降级到 SVG

下一步：在 Midjourney/即梦中生成 phone-render.png 放入 generated 目录即可生效

> 🎯 V8 参考图风格破碎重组（当前阶段）

✅ phone-render.svg 重做 — 银白机身+深蓝反光+清晰镜头模组+金属边框
✅ fragmented-phone-map.ts — 20 块高扰动不规则碎片（±9% 扰动，打破网格感）
✅ FragmentedPhoneScene — ghost silhouette + drop-shadow + 玻璃高光边缘层
✅ shard 边缘高光：linear-gradient + overlay blend 模拟玻璃碎片厚度
✅ 100% 完成态改善
✅ 仍然是 2.5D SVG/CSS，无 Three.js

> 🎯 V7 破碎重组式主视觉（当前阶段）

✅ lib/fragmented-phone-map.ts — 20 个不规则 clip-path shards 配置
✅ components/FragmentedPhoneScene.tsx — 单图切片+碎片重组场景
✅ phone-render.svg — SVG 手机背面 fallback
✅ HERO_MODE = "fragmented"（默认），回退 "asset"/"svg" 保留
✅ /lab/assets 模式切换（fragmented / asset / svg）

核心变化：手机本身由 20 块不规则碎片组成，碎片从外部飞回重组，而不是“完整手机+装饰碎片”

> 🎯 V6 视觉资产生产与预览调参（当前阶段）

✅ docs/ASSET_PRODUCTION_BRIEF.md 资产生产规范
✅ docs/VISUAL_QA_CHECKLIST.md 视觉验收清单
✅ app/lab/assets 开发预览调参页（slider + warmup/unlock/complete 按钮）
✅ 当前视觉仍是 SVG fallback，后续替换 PNG 素材即可升级质感

调试页：/lab/assets（仅开发使用，不加入首页导航）

> 🎯 V5 资产驱动主视觉基础设施（当前阶段）

✅ V5 visual assets 目录结构 (public/wish-assets/phone/)
✅ V5 lib/wish-assets.ts 碎片资产配置（14块，支持SVG fallback）
✅ V5 AssetHeroScene — 资产驱动英雄场景组件
✅ V5 可切换 HERO_MODE（asset / svg），不破坏现有回退路径
✅ UX_NEXT_STEPS.md 下一轮布局重构规划

✅ V4 手机实物背面（PhoneArtifact — SVG 手机背板+镜头模组+金属边框）
✅ V4 外部浮动碎片（FloatingFragments — 前后景层次，碎片随进度减少）
✅ V4 2.5D 空间层次（背景光晕+后景模糊碎片+前景清晰碎片+主手机）
✅ V4 视觉碎片映射（40逻辑碎片→16视觉碎片，避免满屏小格子）
✅ V4 小金额光线轨迹（warmup 时光点从底部飞向手机）
✅ V4 少于 emoji（用 CSS 渐变碎片替代 emoji 粒子）
✅ 保留 V1/V2/V3 全部代码可回退

✅ 小金额：金色光点飞入手机（warmup mode）
✅ 解锁碎片：粉橙碎片从外部飞向手机（unlock mode）
✅ 100% 完成：星星/✨ 向外散开 + 完成徽章（complete mode）

MVP 已完成，进入 **V2 视觉重构阶段**。

主视觉已从硬网格升级为 **柔和手机显影视图（Reveal）**。

---

## 技术栈

- **Next.js** 15 (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **localStorage**（数据持久化）

---

## 本地运行

```bash
npm install
npm run dev
```

然后浏览器打开 `http://localhost:3000`

---

## 部署预览

部署到 Vercel 后可通过手机浏览器直接访问：

详细部署步骤见：[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

```bash
# 部署前确认
npm install
npm run build     # 必须通过
```

---

## MVP 功能

- ✅ 默认愿望目标（10,000 元新手机基金）
- ✅ 快捷金额存钱（10 / 50 / 100 / 500 元）
- ✅ 自定义金额存钱
- ✅ 进度百分比 + 进度条
- ✅ **柔和手机显影视图**（WishPhoneReveal，雾层遮罩 Reveal）
- ✅ 碎片解锁雾层消失动画（fade + blur + scale）
- ✅ 小金额光点飞入（金币飞入手机）
- ✅ 100% 完整手机完成态（光晕 + 星星 + 庆祝文案）
- ✅ 下一块碎片进度显示
- ✅ 差异化文案：解锁碎片 vs 推进下一块
- ✅ Framer Motion 动画（按钮点击、金额高亮）
- ✅ 随机鼓励文案（解锁类 + 推进类 + 通用类）
- ✅ 历史记录（存钱小票，最近 5 条）
- ✅ 成就弹窗（25% / 50% / 75% / 100%）
- ✅ 成就去重（不会重复弹出）
- ✅ localStorage 持久化，刷新不丢
- ✅ 重置测试数据（底部灰色按钮，二次确认）
- ✅ 移动端优先设计
- ✅ PWA Manifest + maskable 图标就绪
- ✅ 安卓震动反馈

---

## 愿望物品主视觉 V2

核心组件 `WishPhoneReveal` 从 V1 的"格子填色"升级为 **柔和显影（Reveal）**：

### 雾层遮罩 Reveal 机制

```
┌─────────────────────────┐
│     ● (灵动岛)           │
│  ┌───────────────────┐  │
│  │▄▄▄▄▄▄▄▄▄▄░░░░░░░░│  │  ▄ = 雾层遮罩（未解锁）
│  │▄▄▄▄▄▄▄▄▄▄░░░░░░░░│  │  ░ = 露出壁纸（已解锁）
│  │▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄│  │
│  │  底下是一整张渐变壁纸  │  │  解锁 → 雾层 fade/blur 消失
│  └───────────────────┘  │
│          ━━━━            │  (Home Bar)
└─────────────────────────┘
```

- **手机外观**：暖白/玫瑰金边框（非黑色），柔和阴影
- **屏幕底图**：粉橙渐变壁纸始终完整存在
- **未解锁**：半透明白色雾层覆盖在壁纸上（40 个碎片）
- **已解锁**：对应雾层消失，露出底下完整壁纸
- **新解锁**：雾层 `fade + blur(8px) + scale(0.94)` 动画消失
- **小金额**：金色光点从屏幕外飞入手机
- **100%**：完整手机显示 + 径向光晕 + 浮动星星 + 庆祝文案

### 与 V1 的区别

| 维度 | V1（WishObjectView） | V2（WishPhoneReveal） |
|------|---------------------|----------------------|
| 手机边框 | 纯黑 | 暖白/玫瑰金渐变 |
| 碎片视觉 | 粉橙格子填满 | 雾层遮罩逐渐揭开 |
| 解锁效果 | 格子变亮 | 雾 fade+blur 消失 |
| 小金额 | 格子微闪 | 金币飞入手机 |
| 100% | 格子填满 | 完整手机 + 光晕 + 星星 |

**上一版 `WishObjectView` 和 `PuzzleView` 保留在代码中，可随时回退。**

---

## 安卓真机验收

在 Android Chrome 中打开 Vercel 预览链接，逐项检查：

- 验收清单：[docs/ANDROID_TEST_CHECKLIST.md](docs/ANDROID_TEST_CHECKLIST.md)
- 测试报告模板：[docs/ANDROID_TEST_REPORT_TEMPLATE.md](docs/ANDROID_TEST_REPORT_TEMPLATE.md)
- PWA 排查指南：[docs/PWA_TROUBLESHOOTING.md](docs/PWA_TROUBLESHOOTING.md)

---

## 下一阶段任务

| 优先级 | 任务 | 状态 | 说明 |
|--------|------|------|------|
| P0 | 安卓真机验收 V2 视觉 | 待测试 | 重点确认雾层 Reveal 的爽感 |
| P1 | 体验问题修复 | 待真机反馈 | 根据测试结果 |
| P1 | 分享海报 | 暂缓 | 爽感确认后再做 |
| P2 | 自定义目标图片 | 暂缓 | 从手机升级为自定义物品 |
| P2 | 多目标管理 | 暂缓 | 长期使用功能 |
| P3 | Capacitor 打包 APK | 暂缓 | Web 稳定后再做 |

---

## 非目标（当前阶段不做）

- 登录注册
- 后端 API
- 数据库
- 真实支付
- 银行绑定
- 投资理财
- 云同步
- 复杂 3D / Three.js
- 社交功能

---

## PWA / 桌面入口更新说明

如果手机桌面 App 入口没有显示最新版本，通常是缓存问题：

1. 用手机浏览器打开最新链接并刷新，确认是新版。
2. 点击页面底部的 **检查更新** 按钮。
3. 如检测到新版本，点击立即刷新。
4. 如仍未更新，删除桌面快捷方式后重新添加。
5. 必要时清理浏览器站点缓存（注意：会清掉存钱记录）。

每次大版本更新时需同步修改 lib/app-version.ts 和 public/version.json。
