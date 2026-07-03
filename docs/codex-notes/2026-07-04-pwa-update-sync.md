# Codex 同步说明：修复手机端 PWA 未同步最新版本问题

> 建议路径：`docs/codex-notes/2026-07-04-pwa-update-sync.md`  
> 适用仓库：`xiyan13411-ai/check-think`  
> 当前状态：V4 小红书 Hero Scene 已完成，但手机桌面 App/PWA 入口疑似未同步最新版本  
> 本次目标：让手机端 PWA 更容易拿到最新部署版本，并给用户明确的更新方式。

---

## 1. 背景

V4 已完成并推送，Web 端能看到新 Hero Scene。

但是用户反馈：

> 网页端表现还行，但是手机端的 app 好像没用同步更新。

这里的“手机端 app”指的是通过 Edge Android 创建到桌面的 PWA / 桌面快捷方式。

这类问题通常不是代码没有推送，而是以下原因之一：

1. 手机桌面入口仍在使用旧页面缓存。
2. 浏览器 service worker 仍控制旧资源。
3. 旧缓存没有被清理。
4. PWA 桌面快捷方式未重新拉取最新 HTML / JS。
5. Vercel 部署完成了，但手机端仍命中本地缓存。
6. 如果没有 service worker，浏览器自身缓存也可能短时间保留旧资源。

---

## 2. 当前判断

这不是阻塞产品方向的问题，而是 PWA 更新机制问题。

需要同时做两件事：

1. **给用户临时手动更新办法**
2. **给代码增加自动/半自动更新能力**

---

## 3. 用户临时解决方案

建议用户现在先执行：

### 方案 A：强制刷新网页

1. 用 Edge 打开 Vercel 链接。
2. 不从桌面图标进，先从浏览器地址栏进。
3. 下拉刷新或菜单中刷新。
4. 确认 Web 端已是 V4。
5. 再从桌面快捷方式打开。

### 方案 B：删除旧桌面快捷方式后重新添加

1. 长按桌面图标。
2. 删除快捷方式。
3. Edge 打开最新 Vercel 链接。
4. 重新“添加到手机 / 添加到桌面”。
5. 从新桌面图标打开。

### 方案 C：清理 Edge 站点缓存

在 Edge Android 中：

1. 打开该站点。
2. 进入浏览器设置。
3. 清理该站点缓存 / Cookie / 站点数据。
4. 或在系统应用设置中清理 Edge 缓存。
5. 重新打开 Vercel 链接。
6. 重新创建桌面入口。

注意：

- 清理站点数据可能会清掉 localStorage 里的存钱记录。
- 测试阶段可以接受。
- 生产阶段需要提供数据导出/导入或云同步，否则不建议频繁清缓存。

---

## 4. Codex 需要执行的任务

### Task 1：增加应用版本号

新增：

```txt
lib/app-version.ts
```

内容示例：

```ts
export const APP_VERSION = "v4.0.0-hero-scene";
export const APP_VERSION_LABEL = "V4 Hero Scene";
```

在页面底部低调显示当前版本：

```txt
V4 Hero Scene
```

目的：

- 用户能确认手机端是否已经更新
- 测试时不用靠肉眼猜版本

显示位置：

- 页面底部
- 重置测试数据附近
- 灰色小字
- 不要影响主体验

---

### Task 2：增加 PWA 更新检测组件

新增组件：

```txt
components/AppUpdateNotice.tsx
```

目标：

当检测到新版本 service worker / 新部署可用时，提示用户刷新。

功能建议：

- 注册 service worker 时监听 `updatefound`
- 如果有 waiting worker，显示 toast/banner：
  - `发现新版本，点击更新`
- 用户点击后：
  - 向 waiting worker 发送 `SKIP_WAITING`
  - 然后 reload 页面

如果当前项目没有 service worker，也可以先做轻量版本：

- 页面加载时请求 `/version.json?ts=${Date.now()}`
- 比较本地版本和远程版本
- 不一致时提示刷新

更简单可靠的 MVP 方案：

```txt
version.json 方案优先
```

原因：

- 不一定需要复杂 service worker
- 适合当前项目快速解决“桌面入口不更新”
- 不容易引入缓存坑

---

### Task 3：新增 public/version.json

新增：

```txt
public/version.json
```

内容示例：

```json
{
  "version": "v4.0.0-hero-scene",
  "label": "V4 Hero Scene",
  "updatedAt": "2026-07-04"
}
```

注意：

每次视觉大版本更新时都要改这个文件。

---

### Task 4：实现版本检查逻辑

新增：

```txt
lib/check-version.ts
```

功能：

```ts
export async function fetchRemoteVersion(): Promise<RemoteVersion | null>
```

请求：

```ts
fetch(`/version.json?ts=${Date.now()}`, {
  cache: "no-store",
});
```

这样可以尽量绕过缓存。

组件逻辑：

1. 读取本地 `APP_VERSION`
2. 请求远程 `version.json`
3. 如果远程 version 不等于本地 version，提示用户刷新
4. 如果相同，不显示

但要注意：

- 如果用户当前 JS 仍是旧版本，那么旧 JS 内的 APP_VERSION 也旧。
- 远程 version.json 是新版本。
- 对比后可以提示刷新。

---

### Task 5：增加“检查更新”按钮

在页面底部增加一个低调按钮：

```txt
检查更新
```

点击后：

1. 请求 `/version.json?ts=Date.now()`
2. 如果发现新版本，提示刷新
3. 如果已经最新，提示 `已经是最新版本`
4. 如果失败，提示 `检查失败，请稍后再试`

不要做得很显眼。

---

### Task 6：更新 README

增加：

```md
## PWA / 桌面入口更新说明

如果手机桌面入口没有显示最新版本：

1. 先用浏览器打开最新链接并刷新。
2. 点击页面底部版本号 / 检查更新。
3. 如仍旧，删除桌面快捷方式后重新添加。
4. 测试阶段也可以清理浏览器缓存。
```

同时说明：

- PWA 更新可能不会像普通网页一样立即显示。
- service worker / 浏览器缓存可能会保留旧资源。
- 每次大版本更新要同步更新 `public/version.json` 和 `lib/app-version.ts`。

---

### Task 7：更新 PWA 排查文档

更新：

```txt
docs/PWA_TROUBLESHOOTING.md
```

增加章节：

```md
## 桌面入口没有同步最新版本怎么办

### 现象

浏览器打开是新版，但桌面快捷方式打开还是旧版。

### 原因

- 浏览器缓存
- service worker 缓存
- 桌面快捷方式仍使用旧资源
- 旧 tab / 旧 WebView 未关闭

### 解决

1. 关闭所有该 App 页面。
2. 用浏览器打开最新链接并刷新。
3. 点击“检查更新”。
4. 删除桌面快捷方式重新添加。
5. 必要时清理 Edge / Chrome 站点缓存。
```

---

## 5. 可选：Service Worker 缓存策略调整

如果当前项目已有 `public/sw.js`，请检查：

1. 是否使用固定 cache name。
2. 是否在 activate 时清理旧 cache。
3. 是否对 HTML 使用 network-first。
4. 是否对静态资源使用 cache-first。
5. 是否处理 `SKIP_WAITING` 消息。

建议：

```js
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});
```

注意：

- 如果没有 service worker，本轮不一定要新增复杂缓存。
- 当前优先解决“用户知道有没有更新”和“可以手动检查更新”。

---

## 6. 禁止扩大范围

本轮不要做：

- 多目标管理
- 分享海报
- 自定义图片上传
- 登录
- 云同步
- 后端
- 支付
- 银行绑定
- APK 打包
- 继续大改 Hero Scene
- Three.js / Canvas

本轮只做：

> PWA/桌面入口更新可见、可检查、可刷新。

---

## 7. 验收标准

完成后应满足：

- [ ] 页面底部显示当前版本号
- [ ] 存在 `public/version.json`
- [ ] 存在 `lib/app-version.ts`
- [ ] 用户可点击“检查更新”
- [ ] 如果远程版本不同，显示刷新提示
- [ ] 点击刷新后能重新加载页面
- [ ] README 有 PWA 更新说明
- [ ] `docs/PWA_TROUBLESHOOTING.md` 有桌面入口不同步排查
- [ ] `npm run build` 通过
- [ ] 不影响存钱逻辑、历史记录、localStorage、成就弹窗

---

## 8. 可直接发送给 Codex 的 Prompt

```text
请修复手机端 PWA / 桌面快捷方式不容易同步最新部署版本的问题，不要新增产品大功能。

背景：
V4 Hero Scene 已经推送，网页端能看到新版本，但手机桌面快捷方式打开的 App 可能仍是旧版本。这通常是 PWA / 浏览器缓存 / service worker 更新机制导致的。需要增加版本可见性和手动检查更新能力。

请完成：

1. 新增 lib/app-version.ts
   - 导出 APP_VERSION 和 APP_VERSION_LABEL
   - 当前版本使用 "v4.0.0-hero-scene"

2. 新增 public/version.json
   - 包含 version、label、updatedAt
   - version 与 APP_VERSION 对齐

3. 新增 lib/check-version.ts
   - 使用 fetch("/version.json?ts=" + Date.now(), { cache: "no-store" })
   - 返回远程版本信息

4. 新增 components/AppUpdateNotice.tsx
   - 页面底部低调显示当前版本
   - 提供“检查更新”按钮
   - 如果远程 version 不等于当前 APP_VERSION，提示用户刷新
   - 点击刷新后 window.location.reload()
   - 如果已是最新，提示“已经是最新版本”
   - 如果检查失败，提示“检查失败，请稍后再试”

5. 在 app/page.tsx 中引入 AppUpdateNotice
   - 放在页面底部，靠近“重置测试数据”
   - 不影响主视觉和存钱操作

6. 更新 README
   - 增加 PWA / 桌面入口更新说明
   - 说明手机桌面入口可能因缓存不同步
   - 说明如何检查更新、刷新、重新添加桌面快捷方式

7. 更新 docs/PWA_TROUBLESHOOTING.md
   - 增加“桌面入口没有同步最新版本怎么办”
   - 写明 Edge / Chrome 清缓存、删除快捷方式、重新添加等步骤

要求：
- 不要做多目标
- 不要做分享海报
- 不要做自定义图片上传
- 不要做登录
- 不要做云同步
- 不要引入后端
- 不要打包 APK
- 不要改动当前 V4 Hero Scene 主视觉
- 不要影响 localStorage 数据
- 完成后运行 npm run build 并汇报结果
```

---

## 9. 产品判断

这个问题是正常的 PWA 更新问题，不代表 V4 没成功。

但如果不解决，后续每次视觉迭代都会很痛苦，因为你无法确定手机端到底跑的是哪个版本。

所以现在先把“版本可见 + 检查更新 + 排查文档”补上。  
这会让后续继续打磨小红书视觉时省很多心。
