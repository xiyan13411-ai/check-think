# 部署说明

> 项目：愿望拼图存钱 App
> 框架：Next.js 15 (App Router)
> 推荐平台：Vercel

---

## 1. 部署目标

将项目部署到 Vercel，获得可供手机浏览器直接访问的预览链接，用于：

- 安卓真机验收测试
- 分享给朋友试用
- 验证 PWA 表现
- 后续持续迭代预览

---

## 2. Vercel 部署步骤

### 前置条件

1. 拥有 [GitHub](https://github.com) 账号，且已登录
2. 拥有 [Vercel](https://vercel.com) 账号（可用 GitHub 账号直接登录）
3. 当前仓库已推送到 GitHub：`xiyan13411-ai/check-think`

### 部署前检查

在推送代码前，先在本地运行：

```bash
npm install
npm run build
```

确保 build 成功后再推送。如果 build 失败，Vercel 部署也会失败。

### 部署步骤

1. 打开浏览器访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New** → **Project**
3. 在 Import Git Repository 页面，找到并选择 `xiyan13411-ai/check-think`
   - 如果仓库列表没有出现，点击 **Adjust GitHub App Permissions** 授权
4. 在 Configure Project 页面：
   - **Framework Preset** → 自动识别为 **Next.js**
   - **Root Directory** → 保持默认 `./`
   - **Build Command** → 保持默认 `npm run build`
   - **Output Directory** → 保持默认 `~/.next`
   - **Node.js Version** → 保持默认（推荐 20.x）
5. 展开 **Environment Variables** → 无需添加任何环境变量
6. 点击 **Deploy**
7. 等待部署完成（约 1-2 分钟）
8. 部署成功后，Vercel 会提供一个预览链接，格式如：
   ```
   https://check-think.vercel.app
   ```

### 后续更新

每次推送 `master` 分支后，Vercel 会自动重新部署。

如果创建了其他分支，Vercel 会自动生成独立的预览链接。

---

## 3. 部署后检查

部署完成后，在电脑浏览器中检查：

- [ ] 页面能正常打开
- [ ] 没有显示 404 或 500
- [ ] 存钱功能正常
- [ ] 拼图显示正常
- [ ] 页面标题显示「愿望拼图存钱」
- [ ] 图标正常显示

---

## 4. 安卓手机访问

部署成功后，在安卓手机上：

1. 打开 Chrome 浏览器
2. 输入 Vercel 预览链接（如 `https://check-think.vercel.app`）
3. 页面加载后，可以：
   - 执行完整的存钱流程
   - 检查页面布局是否适配手机
   - 尝试添加到主屏幕（Chrome 菜单 → 添加到主屏幕）
   - 按 `docs/ANDROID_TEST_CHECKLIST.md` 逐项验收

---

## 5. 常见问题

### 部署失败

- 检查 `npm run build` 是否能在本地成功
- 检查 `package.json` 是否存在且有正确脚本
- 检查是否有未提交的代码

### 页面空白

- 打开浏览器开发者工具，检查 Console 是否有报错
- 检查浏览器是否支持 ES Modules
- 尝试清除浏览器缓存后刷新

### 样式不对

- 确保 Chrome 版本较新（推荐 90+）
- 检查是否启用了任何浏览器兼容性模式

### 无法添加到主屏幕

- 需要 HTTPS 环境（Vercel 默认提供）
- 需要 Service Worker（下一阶段新增）
- 需要有效的 manifest 配置

### 安卓底部导航遮挡

- 如果页面底部内容被系统导航栏遮挡，后续可以补充 safe-area 适配
- 当前已经预留了 `.safe-area-bottom` 样式

---

## 6. 后续优化方向

- 添加 Service Worker 支持离线访问
- 自定义域名绑定
- 分析面板
- 预览环境分支部署
