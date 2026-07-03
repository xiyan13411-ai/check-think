# 心愿积累 App — 愿望拼图存钱

每存一笔钱，愿望就拼回来一块。

一个情绪价值型存钱工具，通过拼图、动画、文案和成就反馈，让"存钱"变得像"收集愿望碎片"一样有爽感。

---

## 当前状态

MVP 已完成，进入 **部署预览与安卓真机验收阶段**。

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

- ✅ 默认愿望目标（¥10,000 新手机基金）
- ✅ 快捷金额存钱（¥10 / ¥50 / ¥100 / ¥500）
- ✅ 自定义金额存钱
- ✅ 进度百分比 + 进度条
- ✅ 40 块拼图碎片，随进度解锁
- ✅ 碎片解锁弹簧动画（stagger + scale + rotate）
- ✅ 新增碎片动画精准触发（不误触已有碎片）
- ✅ Framer Motion 动画（按钮点击、金额高亮）
- ✅ 随机鼓励文案（15 条库）
- ✅ 历史记录（存钱小票，最近 5 条）
- ✅ 成就弹窗（25% / 50% / 75% / 100%）
- ✅ 成就去重（不会重复弹出）
- ✅ localStorage 持久化，刷新不丢
- ✅ 重置测试数据（底部灰色按钮，二次确认）
- ✅ 移动端优先设计
- ✅ PWA Manifest + 图标就绪
- ✅ 安卓震动反馈

---

## 安卓真机验收

在 Android Chrome 中打开 Vercel 预览链接，逐项检查：

- 验收清单：[docs/ANDROID_TEST_CHECKLIST.md](docs/ANDROID_TEST_CHECKLIST.md)
- 测试报告模板：[docs/ANDROID_TEST_REPORT_TEMPLATE.md](docs/ANDROID_TEST_REPORT_TEMPLATE.md)

验收完成后，请填写一份测试报告，用于决定下一阶段方向。

---

## 安卓优先说明

- 优先适配 360px - 430px 宽度
- 按钮高度 ≥ 44px
- 数字输入键盘（inputMode="numeric"）
- 禁止横向滚动
- 支持设备震动反馈
- safe area 预留

---

## 下一阶段任务

以下功能按优先级排列：

| 优先级 | 任务 | 状态 | 说明 |
|--------|------|------|------|
| P0 | Vercel 预览部署 | ✅ 待部署 | docs 就绪，需要导入 Vercel |
| P0 | 安卓真机完整验收 | ✅ 待测试 | 按清单逐项检查，填写报告 |
| P1 | 体验问题修复 | ⏸ 待真机反馈 | 根据测试结果决定 |
| P1 | 分享海报 | ⏸ 暂缓 | 爽感确认后再做 |
| P2 | 多目标管理 | ⏸ 暂缓 | 长期使用需要 |
| P2 | 自定义目标图片 | ⏸ 暂缓 | 拼图的核心增强 |
| P3 | Capacitor 打包 APK | ⏸ 暂缓 | 等 Web 体验稳定 |

---

## 非目标（当前阶段不做）

- ❌ 登录注册
- ❌ 后端 API
- ❌ 数据库
- ❌ 真实支付
- ❌ 银行绑定
- ❌ 投资理财
- ❌ 云同步
- ❌ 复杂 3D / Three.js
- ❌ 社交功能
