# PWA 问题排查指南

> 项目：愿望拼图存钱 App
> 目标平台：Android Chrome / Edge
> 当前状态：PWA 桌面快捷方式已验证可用

---

## 1. 概述

本项目为 PWA（Progressive Web App）路线，不依赖原生打包工具。

在 Android 设备上，用户可以通过 Chrome 或 Edge 浏览器将应用添加到主屏幕，获得接近原生 App 的体验。

---

## 2. 常见问题

### 2.1 Edge Android 添加到桌面后找不到图标

**现象**：

点击 Edge 浏览器的"添加到手机"后，显示"正在安装"，但桌面没有出现图标。

**原因**：

荣耀 / MagicOS 等系统中，Edge 默认没有"创建桌面快捷方式"权限。安装流程虽然触发，但系统阻止了图标创建。

**解决方案**：

1. 打开手机 **设置** → **应用** → **应用管理**
2. 找到 **Microsoft Edge**
3. 点击 **权限管理**
4. 开启 **创建桌面快捷方式** 权限
5. 重新在 Edge 中打开项目，点击"添加到手机"
6. 确认桌面出现图标

**验证结果**：

在荣耀 Magic7 Pro + Edge Android 上已验证：开启权限后可以成功创建桌面入口，从桌面打开后没有浏览器导航栏，体验接近轻量 App。

---

### 2.2 Chrome Android 添加到主屏幕

**操作步骤**：

1. 在 Chrome 中打开项目链接
2. 点击右上角菜单（三个点）
3. 选择 **添加到主屏幕**
4. 确认名称和图标
5. 点击 **添加**

**注意事项**：

- Chrome 通常不需要额外权限
- 如果添加失败，检查 Chrome 是否有"创建桌面快捷方式"权限
- 需要 HTTPS 环境（Vercel 默认提供）

---

### 2.3 从主屏幕打开后显示浏览器导航栏

**原因**：

PWA Manifest 中 `display` 设置为 `standalone` 时，正常情况不会显示导航栏。

如果仍然显示：

1. 确认 Manifest 已正确加载（打开浏览器开发者工具 → Application → Manifest）
2. 确认 `start_url` 配置正确
3. 尝试从主屏幕重新添加
4. 清除浏览器缓存后重试

---

### 2.4 图标显示不正确

**原因**：

- 图标文件缺失或路径错误
- 图标尺寸不符合 PWA 要求
- 浏览器缓存了旧图标

**解决方案**：

1. 确认 `/icons/icon-192.png` 和 `/icons/icon-512.png` 存在
2. 确认 Manifest 中图标路径正确
3. 清除浏览器缓存后重新添加

---

### 2.5 页面离线后无法访问

**当前状态**：

MVP 阶段尚未添加 Service Worker，因此离线时无法访问。

**后续计划**：

Service Worker 将在后续迭代中补充。届时：

- 静态资源将被缓存
- 页面打开后可以在离线状态下使用
- 已经加载的数据不会丢失（localStorage 仍然可用）

---

## 3. 浏览器兼容性

| 浏览器 | PWA 支持 | 备注 |
|--------|----------|------|
| Chrome Android | ✅ 完整支持 | 推荐使用 |
| Edge Android | ✅ 完整支持 | 需检查桌面快捷方式权限 |
| Chrome Desktop | ✅ 支持 | 可安装为桌面应用 |
| Edge Desktop | ✅ 支持 | 可安装为桌面应用 |
| Safari iOS | ⚠️ 有限支持 | 后续补充适配 |
| Firefox Android | ⚠️ 有限支持 | 未重点测试 |

---

## 4. 验证方法

```bash
# 1. 确认 Manifest 可访问
curl https://your-app.vercel.app/manifest.webmanifest

# 2. 确认图标可访问
curl -I https://your-app.vercel.app/icons/icon-192.png
curl -I https://your-app.vercel.app/icons/icon-512.png

# 3. 浏览器开发者工具检查
# Application → Manifest → 确认所有字段正常
# Application → Service Workers → 确认状态（后续 SW 添加后）
```

---

## 5. 参考链接

- [MDN: PWA](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)
- [Web App Manifest](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)
- [Vercel PWA 部署](https://vercel.com/docs/frameworks/nextjs)
- [Maskable Icons](https://web.dev/articles/maskable-icon)
 
 ---
 
 ## 6. 桌面入口没有同步最新版本怎么办
 
 ### 现象
 
 浏览器打开是新版，但手机桌面快捷方式打开还是旧版。
 
 ### 原因
 
 - 浏览器缓存 - 旧 HTML/CSS/JS 仍被浏览器或 service worker 缓存
 - 桌面快捷方式仍使用旧 WebView/旧资源
 - 旧 Tab 未关闭，打开的仍是旧版
 - PWA 的 service worker 等待激活
 
 ### 解决步骤
 
 1. 关闭所有该 App 的页面/Tab。
 2. 用手机浏览器（Chrome/Edge）打开最新 Vercel 链接，下拉刷新确认是新版。
 3. 点击页面底部的 **"检查更新"** 按钮确认版本。
 4. 如果发现新版本，点击"立即刷新"。
 5. 如仍未更新，删除桌面快捷方式，在浏览器中重新"添加到主屏幕"。
 6. 必要时清理浏览器站点缓存：
    - Chrome：地址栏 → 左侧锁图标 → 站点设置 → 清除数据
    - Edge：菜单 → 设置 → 隐私和安全 → 清除浏览数据 → 缓存的图片和文件
 
 > **注意**：清理站点缓存会同时清除 localStorage（存钱记录），测试阶段可以接受，正式使用前请先导出数据。
 
 ### 预防
 
 每次大版本更新后：
 
 1. 同步更新 `lib/app-version.ts` 和 `public/version.json` 中的版本号。
 2. 推送代码到 GitHub，等待 Vercel 重新部署。
 3. 在版本说明中告知用户需要"检查更新 → 刷新"。
