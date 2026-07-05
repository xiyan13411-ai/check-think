# Codex 同步说明：V9 使用生图资产替换工程 SVG

> 建议路径：`docs/codex-notes/2026-07-04-v9-ai-asset-generation-brief.md`  
> 适用仓库：`xiyan13411-ai/check-think`  
> 当前状态：V8 已实现参考图风格破碎重组，但视觉仍然依赖工程 SVG，质感不足  
> 本次目标：准备 AI 生成 / 设计资产接入方案，用高质量视觉素材替换纯工程绘制素材。

---

## 1. 当前判断

V8 的实现机制方向是对的：

- 手机本体可以被拆成碎片
- 碎片可以随存钱进度飞回
- `FragmentedPhoneScene` 已经能承载“破碎后重组”的逻辑

但是当前视觉仍然和参考图有明显差距，主要原因不是代码逻辑，而是素材质量。

当前问题：

1. `phone-render.svg` 仍然是工程绘制插画。
2. 手机缺少真实材质、厚度、金属边缘和镜头质感。
3. 碎片虽然有 clip-path，但底图不够真实，所以切出来仍然像淡色平面。
4. 参考图是高质量产品渲染风，当前更像低保真 SVG mock。
5. 要继续接近小红书效果，需要引入高质量视觉资产。

---

## 2. 参考图判断

用户提供的新参考图是白色/银色智能手机产品渲染图，有以下优点：

- 白银机身质感好
- 镜头模组清晰
- 金属边框和阴影明显
- 机身有厚度
- 适合作为生成素材的风格参考

但它不能直接作为项目素材使用，原因：

- 有水印和来源标识
- 可能存在版权风险
- 图中有两台手机，结构不适合直接切片
- 背景不是透明
- 不符合当前碎片重组所需的单机主体资产

所以它更适合作为风格参考，不建议直接放进项目。

---

## 3. V9 目标

V9 不继续让 Codex 硬画手机，而是让项目支持并接入 AI 生成或设计导出的高质量资产。

目标资产：

```txt
public/wish-assets/phone/generated/
  phone-render.png
  phone-complete.png
  phone-shadow.png
  fragments/
    fragment-01.png
    fragment-02.png
    ...
```

第一阶段不要求所有碎片都人工切好，可以先接入：

1. 一张高质量透明背景手机主图。
2. 一张完整完成态手机图。
3. 若干可选碎片素材。
4. 保留 clip-path 单图切片作为 fallback。

---

## 4. 建议先生成的 3 类素材

### 4.1 主手机图：phone-render.png

用途：

- 作为 `FragmentedPhoneScene` 的基础图
- 用 clip-path 切成碎片
- 替换当前 `phone-render.svg`

规格建议：

```txt
文件名：phone-render.png
尺寸：1000 × 1600
背景：透明
主体：单台智能手机背面
风格：白色 / 银色 / 玫瑰金，产品渲染
视角：3/4 斜角，轻微悬浮
要求：清晰镜头模组、金属边、玻璃/陶瓷背板、深蓝/黑色反光区域
禁止：品牌 Logo、Apple 标志、iPhone 字样、官方素材
```

### 4.2 完成态图：phone-complete.png

用途：

- 100% 时淡入完整手机
- 作为最终奖励态

规格：

```txt
文件名：phone-complete.png
尺寸：1000 × 1600
背景：透明
主体：完整无裂片手机
光效：比 phone-render 更亮一点
```

### 4.3 碎片参考图 / sprite：fragments-reference.png

用途：

- 作为后续人工切片或 AI 辅助切片参考
- 不一定直接进代码

规格：

```txt
文件名：fragments-reference.png
尺寸：1000 × 1600
背景：透明
内容：同一台手机的 12-18 个不规则物理碎片，围绕中心手机漂浮
要求：碎片有厚度、阴影、高光、部分深蓝反光
```

---

## 5. 生图 Prompt 建议

### Prompt A：透明背景手机主资产

```text
A premium white and silver futuristic smartphone back render, no logo, no brand marks, no text, single phone object, three camera lenses in a rounded square camera island, ceramic glass back, polished metal edges, subtle deep blue black reflective inner surface visible through fractured panels, product render, soft studio lighting, floating in air, three-quarter perspective, high detail, clean premium design, transparent background, isolated object, 1000x1600, no watermark
```

中文意图：

```text
一台高级白银色智能手机背面渲染图，无品牌标志、无文字、单台手机、三镜头模组、陶瓷玻璃背板、金属边框、带少量深蓝黑色反光区域、产品渲染风、柔和棚拍光、3/4 透视、透明背景、无水印。
```

### Prompt B：破碎重组参考图

```text
A premium white and silver futuristic smartphone broken into floating physical shards, no logo, no text, the phone is partially reassembled in the center, multiple irregular ceramic and glass fragments floating around it, fragments have thickness, metallic edges, shadows and highlights, some fragments reveal deep blue black reflective inner surfaces, soft studio lighting, clean beige background, product poster style, high-end app hero visual, no watermark
```

### Prompt C：碎片素材 sprite

```text
A set of 16 isolated irregular smartphone body fragments, white silver ceramic glass material, polished metal edges, some deep blue black reflective surfaces, each fragment has thickness, soft shadow and highlight, transparent background, no phone logo, no text, no watermark, arranged with spacing like a sprite sheet
```

---

## 6. Codex 需要执行的任务

### Task 1：新增 generated 资产目录

新增：

```txt
public/wish-assets/phone/generated/
public/wish-assets/phone/generated/fragments/
```

并添加 README：

```txt
public/wish-assets/phone/generated/README.md
```

说明：

- 这里放 AI 生成或设计导出的真实视觉素材
- `phone-render.png` 优先于 `phone-render.svg`
- 如果 PNG 不存在，fallback 到 SVG
- 不要提交带水印/有版权风险的图

---

### Task 2：更新 lib/wish-assets.ts

让资产配置支持优先使用 generated PNG：

```ts
export const phoneRenderAsset = {
  png: "/wish-assets/phone/generated/phone-render.png",
  fallbackSvg: "/wish-assets/phone/phone-render.svg",
};
```

也可以支持：

```ts
phoneCompleteAsset
fragmentSpriteAssets
```

注意：

- 不能因为 PNG 不存在就页面崩溃
- 需要优雅 fallback

---

### Task 3：更新 FragmentedPhoneScene

修改：

```txt
components/FragmentedPhoneScene.tsx
```

要求：

1. 优先尝试使用 `phone-render.png`
2. 如果加载失败，使用 `phone-render.svg`
3. 保持 clip-path 切片机制
4. 保持 `fragmented-phone-map.ts` 配置
5. 保持完成态
6. 不影响现有逻辑

可通过状态判断图片是否加载成功：

```tsx
const [assetSrc, setAssetSrc] = useState(PNG_URL);

<img
  src={assetSrc}
  onError={() => setAssetSrc(SVG_FALLBACK_URL)}
/>
```

如果使用 `backgroundImage`，可以先用 hidden image preload 检查。

---

### Task 4：更新 /lab/assets

在 `/lab/assets` 中显示：

- 当前使用资产：PNG / SVG fallback
- 当前 assetSrc
- 是否加载失败
- 一键复制生图 prompt
- 资产目录说明链接

---

### Task 5：新增 docs/AI_ASSET_PROMPTS.md

新增：

```txt
docs/AI_ASSET_PROMPTS.md
```

写入本文件中的 Prompt A/B/C，并说明：

- 如何生成主手机图
- 如何生成碎片参考图
- 如何命名文件
- 如何放入 `public/wish-assets/phone/generated/`
- 如何测试

---

### Task 6：更新 README

README 增加：

```md
## V9 AI 视觉资产接入

当前项目支持把 AI 生成 / 设计导出的手机素材放入：

public/wish-assets/phone/generated/

如果存在 phone-render.png，将优先使用该资产；否则回退到内置 SVG。
```

---

## 7. 禁止事项

本轮不要做：

- 多目标
- 登录
- 云同步
- 支付
- 后端
- APK
- Three.js
- Canvas
- 删除 SVG fallback
- 直接使用带水印参考图
- 使用 Apple / iPhone 官方素材
- 使用带 Logo 的图

---

## 8. 验收标准

完成后应满足：

- [ ] `public/wish-assets/phone/generated/README.md` 存在
- [ ] `docs/AI_ASSET_PROMPTS.md` 存在
- [ ] `FragmentedPhoneScene` 支持 PNG 优先、SVG fallback
- [ ] PNG 不存在时页面不崩溃
- [ ] `/lab/assets` 显示当前资产来源
- [ ] README 有 V9 AI 视觉资产说明
- [ ] `npm run build` 通过
- [ ] 不影响当前存钱和 PWA 更新逻辑

---

## 9. 可直接发送给 Codex 的 Prompt

```text
请进入 V9「AI 视觉资产接入」阶段。

当前状态：
V8 已经让 FragmentedPhoneScene 的机制和 SVG 质感更接近参考图，但与小红书参考图仍有明显差距。主要原因是 phone-render.svg 仍然是工程绘制素材。下一步需要支持接入 AI 生成或设计导出的高质量 PNG/SVG 视觉资产。

本轮目标：
不要继续硬画 SVG，也不要引入 Three.js。请建立 AI 生成资产的接入结构，让 FragmentedPhoneScene 优先使用 generated/phone-render.png，如果不存在则优雅回退到现有 phone-render.svg。

请完成：

1. 新增 public/wish-assets/phone/generated/README.md
   - 说明 generated 目录用于 AI 生成或设计导出的视觉素材
   - 说明 phone-render.png、phone-complete.png、fragments/ 的命名规范
   - 明确不要提交带水印、带 Logo、有版权风险的参考图

2. 新增 public/wish-assets/phone/generated/fragments/ 目录

3. 更新 lib/wish-assets.ts
   - 增加 generated PNG 和 fallback SVG 的资产配置
   - 导出 phoneRenderAsset / phoneCompleteAsset 等配置

4. 更新 components/FragmentedPhoneScene.tsx
   - 优先使用 generated/phone-render.png
   - 如果加载失败，fallback 到 phone-render.svg
   - 保持 clip-path 切片机制和现有动效
   - PNG 不存在时页面不能崩溃

5. 更新 app/lab/assets/page.tsx
   - 显示当前资产来源：PNG 或 SVG fallback
   - 显示当前 assetSrc
   - 增加“复制生图 prompt”区域或链接到 docs/AI_ASSET_PROMPTS.md

6. 新增 docs/AI_ASSET_PROMPTS.md
   - 写入用于生成 phone-render.png、phone-complete.png、fragments-reference.png 的 Prompt
   - 说明如何生成、命名、放入 generated 目录和测试

7. 更新 README
   - 增加 V9 AI 视觉资产接入说明

要求：
- 不要做多目标
- 不要做分享海报
- 不要做登录
- 不要做云同步
- 不要引入后端
- 不要打包 APK
- 不要引入 Three.js / Canvas
- 不要删除 SVG fallback
- 不要使用带水印参考图
- 不要使用 Apple / iPhone 官方素材
- 完成后运行 npm run build 并汇报结果
```

---

## 10. 关于“这里能不能生成素材”

可以在这里生成参考素材，但建议分两步：

1. 先生成一张高质量 `phone-render` 风格参考图。
2. 再让 Codex 接入 generated 目录，用这张图替代 SVG fallback。

如果一次想生成完整可切片素材，难度会高一些，因为需要：

- 透明背景
- 单体手机
- 无水印
- 无 Logo
- 视角固定
- 后续能被 clip-path 切片

所以建议先生成主手机图，不要一开始就要求模型生成 20 个完美碎片。
